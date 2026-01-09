import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createVideoSchema, type CreateVideoInput } from '../model';
import { createVideo, getUploadUrl, uploadFileToStorage } from '../api';

interface CreateVideoFormProps {
  seriesId: string; // Required to link the episode to a project
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
      seriesId, // Pre-bind the series ID
    },
  });

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setProgress(0);

      // FIXED: Added seriesId to the payload to satisfy the backend Zod schema
      const { uploadUrl, fileKey } = await getUploadUrl({
        fileName: file.name,
        fileType: file.type,
        seriesId: seriesId,
      });

      // 2. Upload file directly to Supabase
      await uploadFileToStorage(uploadUrl, file, (percent) => {
        setProgress(percent);
      });

      // 3. Construct public URL and set it to form state
      const baseUrl = import.meta.env.VITE_SUPABASE_URL;
      const publicUrl = `${baseUrl}/storage/v1/object/public/animini-videos/${fileKey}`;

      setValue('url', publicUrl, { shouldValidate: true });
    } catch (error) {
      console.error('Upload failed', error);
      alert('File upload failed. Please try again.');
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
      className="panel-glass p-6 space-y-4"
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

      <div className="space-y-1">
        <label className="text-xs font-black uppercase tracking-widest text-surface-400">
          Episode Summary
        </label>
        <textarea
          {...register('description')}
          placeholder="Briefly describe what happens in this part"
          className="w-full bg-dark-base border border-glass-border rounded-md px-4 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-primary transition-colors resize-none h-24"
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
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-brand-primary">
                <span>{progress === 100 ? 'Ready' : 'Uploading'}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1 w-full bg-glass-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
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

      <button
        type="submit"
        disabled={isSubmitting || isUploading || progress < 100}
        className="w-full bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-30 text-white text-[10px] font-black py-4 rounded-xl transition-all duration-300 uppercase tracking-[0.2em] shadow-lg shadow-brand-primary/20"
      >
        {isSubmitting ? 'Syncing...' : 'Add to Series'}
      </button>
    </form>
  );
};
