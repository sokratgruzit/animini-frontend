import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createVideoSchema, type CreateVideoInput } from '../model';
import { createVideo } from '../api';

interface CreateVideoFormProps {
  onSuccess?: () => void;
}

export const CreateVideoForm = ({ onSuccess }: CreateVideoFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateVideoInput>({
    resolver: zodResolver(createVideoSchema),
  });

  const onSubmit = async (data: CreateVideoInput) => {
    try {
      const response = await createVideo(data);
      if (response.success) {
        reset();
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
        <label className="text-xs font-medium text-surface-400">Title</label>
        <input
          {...register('title')}
          placeholder="Series Title"
          className="w-full bg-dark-base border border-glass-border rounded-md px-4 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-primary transition-colors"
        />
        {errors.title && (
          <p className="text-[10px] text-brand-danger">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-surface-400">
          Description
        </label>
        <textarea
          {...register('description')}
          placeholder="Brief summary"
          className="w-full bg-dark-base border border-glass-border rounded-md px-4 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-primary transition-colors resize-none h-24"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-surface-400">
          Video URL
        </label>
        <input
          {...register('url')}
          placeholder="https://..."
          className="w-full bg-dark-base border border-glass-border rounded-md px-4 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-primary transition-colors"
        />
        {errors.url && (
          <p className="text-[10px] text-brand-danger">{errors.url.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-50 text-white text-xs font-bold py-3 rounded-md transition-all duration-300 uppercase tracking-widest"
      >
        {isSubmitting ? 'Processing...' : 'Publish Series'}
      </button>
    </form>
  );
};
