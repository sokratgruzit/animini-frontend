import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getUploadUrl, uploadFileToStorage, createVideo } from '../api';
import { VIDEO_KEYS } from '../../../shared/config/query-keys';
import { type CreateVideoInput } from '../model';

interface UploadVideoPayload extends Omit<CreateVideoInput, 'url'> {
  file: File;
  onProgress?: (percent: number) => void;
}

export const useCreateVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      onProgress,
      ...videoData
    }: UploadVideoPayload) => {
      // 1. Get URL
      const { uploadUrl, fileKey } = await getUploadUrl({
        fileName: file.name,
        fileType: file.type,
        seriesId: videoData.seriesId,
      });

      // 2. Upload with Progress (THIS WAS THE BROKEN LINK)
      await uploadFileToStorage(uploadUrl, file, (percent) => {
        if (onProgress) onProgress(percent);
      });

      // 3. Save to DB
      return await createVideo({
        ...videoData,
        url: fileKey,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: VIDEO_KEYS.workspace() });
      queryClient.invalidateQueries({
        queryKey: VIDEO_KEYS.details(variables.seriesId),
      });
    },
  });
};
