import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSeriesSchema, type CreateSeriesInput } from '../model';
import { createSeries } from '../api';
import { Button } from '../../../shared/ui';

interface CreateSeriesFormProps {
  onSuccess?: () => void;
}

/**
 * Form for creating a new production series.
 * Logic for votesRequired is now strictly server-side.
 */
export const CreateSeriesForm = ({ onSuccess }: CreateSeriesFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateSeriesInput>({
    resolver: zodResolver(createSeriesSchema),
    defaultValues: {
      title: '',
      description: '',
      coverUrl: '',
      // REMOVED: votesRequired is no longer managed by the client
    },
  });

  const onSubmit = async (data: CreateSeriesInput) => {
    try {
      const response = await createSeries(data);
      if (response.success) {
        reset();
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error('Failed to create series', error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="panel-glass p-6 space-y-5 flex flex-col h-full"
    >
      <div className="space-y-1">
        <label className="text-xs font-black uppercase tracking-widest text-surface-400">
          New Series Title
        </label>
        <input
          {...register('title')}
          placeholder="Enter series name..."
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
          Project Description
        </label>
        <textarea
          {...register('description')}
          placeholder="Briefly describe your production..."
          className="w-full bg-dark-base border border-glass-border rounded-md px-4 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-primary transition-colors resize-none flex-1 min-h-24"
        />
      </div>

      {/* REMOVED: Funding Goal input section is gone */}

      <Button
        type="submit"
        isLoading={isSubmitting}
        className="w-full text-[10px] tracking-[0.2em] uppercase py-4"
      >
        Launch Project
      </Button>
    </form>
  );
};
