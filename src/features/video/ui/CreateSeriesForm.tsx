import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSeriesSchema, type CreateSeriesInput } from '../model';
import { useCreateSeries } from '../model/use-create-series';
import { Button, ErrorMessage } from '../../../shared/ui';
import { GENRE_OPTIONS } from '../../../shared/config/genres'; // Твой новый конфиг

interface CreateSeriesFormProps {
  onSuccess?: () => void;
}

/**
 * Form for creating a new production series using React Query mutation.
 * Updated to include Genre selection from shared config.
 */
export const CreateSeriesForm = ({ onSuccess }: CreateSeriesFormProps) => {
  const { mutate: createSeries, isPending, error } = useCreateSeries();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateSeriesInput>({
    resolver: zodResolver(createSeriesSchema),
    defaultValues: {
      title: '',
      description: '',
      coverUrl: '',
    },
  });

  const onSubmit = (data: CreateSeriesInput) => {
    createSeries(data, {
      onSuccess: () => {
        reset();
        if (onSuccess) onSuccess();
      },
    });
  };

  const serverError = error instanceof Error ? error.message : null;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="panel-glass p-6 space-y-5 flex flex-col h-full"
    >
      {/* 1. TITLE */}
      <div className="space-y-1">
        <label className="text-xs font-black uppercase tracking-widest text-surface-400">
          New Series Title
        </label>
        <input
          {...register('title')}
          disabled={isPending}
          placeholder="Enter series name..."
          className="w-full bg-dark-base border border-glass-border rounded-md px-4 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-primary transition-colors disabled:opacity-50"
        />
        {errors.title && (
          <p className="text-[10px] text-brand-danger uppercase font-bold">
            {errors.title.message}
          </p>
        )}
      </div>

      {/* 2. GENRE SELECTION (NEW) */}
      <div className="space-y-1">
        <label className="text-xs font-black uppercase tracking-widest text-surface-400">
          Production Genre
        </label>
        <select
          {...register('genre')}
          disabled={isPending}
          className="w-full bg-dark-base border border-glass-border rounded-md px-4 py-2.5 text-sm text-surface-100 focus:outline-none focus:border-brand-primary transition-colors disabled:opacity-50 appearance-none cursor-pointer"
        >
          <option value="" disabled>
            Select a genre...
          </option>
          {GENRE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.genre && (
          <p className="text-[10px] text-brand-danger uppercase font-bold">
            {errors.genre.message}
          </p>
        )}
      </div>

      {/* 3. DESCRIPTION */}
      <div className="space-y-1 flex-1 flex flex-col">
        <label className="text-xs font-black uppercase tracking-widest text-surface-400">
          Project Description
        </label>
        <textarea
          {...register('description')}
          disabled={isPending}
          placeholder="Briefly describe your production..."
          className="w-full bg-dark-base border border-glass-border rounded-md px-4 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-primary transition-colors resize-none flex-1 min-h-24 disabled:opacity-50"
        />
      </div>

      {/* Global server error display */}
      <ErrorMessage message={serverError || undefined} />

      <Button
        type="submit"
        isLoading={isPending}
        className="w-full text-[10px] tracking-[0.2em] uppercase py-4"
      >
        Launch Project
      </Button>
    </form>
  );
};
