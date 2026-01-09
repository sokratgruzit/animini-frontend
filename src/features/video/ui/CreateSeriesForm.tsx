import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSeriesSchema, type CreateSeriesInput } from '../model';
import { createSeries } from '../api';

interface CreateSeriesFormProps {
  onSuccess?: () => void;
}

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
      votesRequired: 1000, // Provides the number to satisfy the schema
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
      className="panel-glass p-6 space-y-5"
    >
      <div className="space-y-1">
        <label className="text-xs font-black uppercase tracking-widest text-surface-400">
          New Series Title
        </label>
        <input
          {...register('title')}
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
          Project Description
        </label>
        <textarea
          {...register('description')}
          className="w-full bg-dark-base border border-glass-border rounded-md px-4 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-primary transition-colors resize-none h-24"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-black uppercase tracking-widest text-surface-400">
          Funding Goal (Coins)
        </label>
        <input
          type="number"
          // valueAsNumber is the key: it ensures the value passed to Zod is a number, not a string
          {...register('votesRequired', { valueAsNumber: true })}
          className="w-full bg-dark-base border border-glass-border rounded-md px-4 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-primary transition-colors"
        />
        {errors.votesRequired && (
          <p className="text-[10px] text-brand-danger uppercase font-bold">
            {errors.votesRequired.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-30 text-white text-[10px] font-black py-4 rounded-xl transition-all duration-300 uppercase tracking-[0.2em] shadow-lg shadow-brand-primary/20"
      >
        {isSubmitting ? 'Initializing...' : 'Launch Project'}
      </button>
    </form>
  );
};
