import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { createVideoSchema, type CreateVideoInput } from '../model';
import { createVideo, getUploadUrl, uploadFileToStorage } from '../api';
import { VIDEO_KEYS } from '../../../shared/config/query-keys';
import { Button, ProgressBar, ErrorMessage } from '../../../shared/ui';

interface CreateVideoFormProps {
  seriesId: string;
  onSuccess?: () => void;
}

/**
 * RESTORED WORKING VERSION
 * Fixed form reset logic to ensure UI clears after success.
 */
export const CreateVideoForm = ({
  seriesId,
  onSuccess,
}: CreateVideoFormProps) => {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateVideoInput>({
    resolver: zodResolver(createVideoSchema),
    defaultValues: {
      seriesId,
      url: '',
      title: '',
      description: '',
    },
  });

  const videoUrl = watch('url');

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setServerError(null);
      setIsUploading(true);
      setProgress(0);

      const { uploadUrl, fileKey } = await getUploadUrl({
        fileName: file.name,
        fileType: file.type,
        seriesId: seriesId,
      });

      await uploadFileToStorage(uploadUrl, file, (percent) => {
        setProgress(percent);
      });

      const baseUrl = import.meta.env.VITE_SUPABASE_URL;
      const publicUrl = `${baseUrl}/storage/v1/object/public/animini-videos/${fileKey}`;

      setValue('url', publicUrl, { shouldValidate: true });
    } catch (error: any) {
      setServerError(error.response?.data?.message || 'Upload failed');
      setProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: CreateVideoInput) => {
    try {
      setServerError(null);
      const response = await createVideo(data);

      if (response.success) {
        // 1. Refresh global server state
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: VIDEO_KEYS.workspace() }),
          queryClient.invalidateQueries({
            queryKey: VIDEO_KEYS.details(seriesId),
          }),
        ]);

        // 2. FULL RESET of the form and local UI state
        reset({
          seriesId,
          url: '',
          title: '',
          description: '',
        });
        setProgress(0);

        // 3. Clear file input manually
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      setServerError(
        error.response?.data?.message || 'Failed to save video metadata'
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="panel-glass p-6 space-y-4 flex flex-col h-full"
    >
      <div className="space-y-1">
        <label className="text-xs font-black uppercase tracking-widest text-surface-400">
          Episode Title
        </label>
        <input
          {...register('title')}
          disabled={isUploading || isSubmitting}
          placeholder="e.g. Episode 01: The Beginning"
          className="w-full bg-dark-base border border-glass-border rounded-md px-4 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-primary transition-colors disabled:opacity-50"
        />
        {errors.title && (
          <p className="text-[10px] text-brand-danger uppercase font-bold">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="space-y-1 flex-1 flex flex-col">
        <label className="text-xs font-black uppercase tracking-widest text-surface-400">
          Episode Summary
        </label>
        <textarea
          {...register('description')}
          disabled={isUploading || isSubmitting}
          placeholder="Briefly describe what happens in this part"
          className="w-full bg-dark-base border border-glass-border rounded-md px-4 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-primary transition-colors resize-none flex-1 min-h-24 disabled:opacity-50"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-black uppercase tracking-widest text-surface-400">
          Video Content
        </label>
        <input
          type="file"
          accept="video/*"
          className="hidden"
          ref={fileInputRef}
          onChange={onFileChange}
          disabled={isUploading || isSubmitting}
        />

        <div
          onClick={() =>
            !isUploading && !isSubmitting && fileInputRef.current?.click()
          }
          className={`border-2 border-dashed border-glass-border rounded-xl p-6 text-center transition-all bg-dark-base/50 group ${
            isUploading || isSubmitting
              ? 'cursor-not-allowed opacity-70'
              : 'cursor-pointer hover:border-brand-primary/50'
          }`}
        >
          {isUploading ? (
            <ProgressBar
              progress={progress}
              label={`Uploading ${progress}%`}
              variant="primary"
            />
          ) : (
            <span className="text-xs font-bold uppercase tracking-widest text-surface-400 group-hover:text-brand-primary transition-colors">
              {videoUrl ? 'File Ready' : 'Select Video File'}
            </span>
          )}
        </div>

        {serverError && (
          <div className="mt-2">
            <ErrorMessage message={serverError} />
          </div>
        )}

        {errors.url && !isUploading && (
          <p className="text-[10px] text-brand-danger text-center uppercase font-bold mt-2">
            Video file is required
          </p>
        )}
      </div>

      <Button
        type="submit"
        isLoading={isSubmitting}
        disabled={isUploading || !videoUrl}
        className="w-full text-[10px] tracking-[0.2em] uppercase py-4"
      >
        Add to Series
      </Button>
    </form>
  );
};
