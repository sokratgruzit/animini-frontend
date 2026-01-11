import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createVideoSchema, type CreateVideoInput } from '../model';
import { createVideo, getUploadUrl, uploadFileToStorage } from '../api';
import { Button, ProgressBar } from '../../../shared/ui';

interface CreateVideoFormProps {
  seriesId: string;
  onSuccess?: () => void;
}

export const CreateVideoForm = ({
  seriesId,
  onSuccess,
}: CreateVideoFormProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateVideoInput>({
    resolver: zodResolver(createVideoSchema),
    defaultValues: {
      seriesId,
    },
  });

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
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
    } catch (error) {
      console.error('Upload failed', error);
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: CreateVideoInput) => {
    try {
      const response = await createVideo(data);
      if (response.success) {
        reset({ seriesId });
        setProgress(0);
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error('Video publication failed', error);
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
          placeholder="e.g. Episode 01: The Beginning"
          className="w-full bg-dark-base border border-glass-border rounded-md px-4 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-primary transition-colors"
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
          placeholder="Briefly describe what happens in this part"
          className="w-full bg-dark-base border border-glass-border rounded-md px-4 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-primary transition-colors resize-none flex-1 min-h-24"
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
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-glass-border rounded-xl p-6 text-center cursor-pointer hover:border-brand-primary/50 transition-all bg-dark-base/50 group"
        >
          {progress > 0 ? (
            <ProgressBar
              progress={progress}
              label={progress === 100 ? 'Ready' : 'Uploading'}
              variant="primary"
            />
          ) : (
            <span className="text-xs font-bold uppercase tracking-widest text-surface-400 group-hover:text-brand-primary transition-colors">
              Select Video File
            </span>
          )}
        </div>

        <input type="hidden" {...register('url')} />
        <input type="hidden" {...register('seriesId')} />

        {errors.url && (
          <p className="text-[10px] text-brand-danger text-center uppercase font-bold mt-2">
            File is missing
          </p>
        )}
      </div>

      <Button
        type="submit"
        isLoading={isSubmitting}
        disabled={isUploading || progress < 100}
        className="w-full text-[10px] tracking-[0.2em] uppercase py-4"
      >
        Add to Series
      </Button>
    </form>
  );
};
