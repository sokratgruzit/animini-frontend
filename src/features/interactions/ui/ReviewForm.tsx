import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useAppSelector } from '../../../app/store';
import { selectUserData } from '../../../entities/user';
import { INTERACTION_ECONOMY } from '../../../shared/config/constants';
import { Button, ErrorMessage } from '../../../shared/ui';
import { usePostReview } from '../model/use-post-review';
import {
  createReviewSchema,
  type CreateReviewInput,
} from '../../../features/interactions/model';
import { cn } from '../../../shared/lib/clsx';
import {
  IoAlertCircleOutline,
  IoFlashOutline,
  IoShieldOutline,
} from 'react-icons/io5';

interface ReviewFormProps {
  videoId: string;
  seriesId: string;
  onSuccess?: () => void;
}

export const ReviewForm = ({
  videoId,
  seriesId,
  onSuccess,
}: ReviewFormProps) => {
  const user = useAppSelector(selectUserData);
  const { mutate: post, isPending } = usePostReview(seriesId);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateReviewInput>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      videoId,
      type: 'POSITIVE',
      content: '',
    },
  });

  const selectedType = watch('type');
  const content = watch('content');

  const canAfford =
    (user?.balance || 0) >= INTERACTION_ECONOMY.REVIEW_CREATION_FEE;

  // Calculate potential impact for UI feedback
  const potentialImpact =
    (user?.reputation || 0) * INTERACTION_ECONOMY.NEGATIVE_REVIEW_STAKE;

  const onSubmit = (data: CreateReviewInput) => {
    setServerError(null);
    post(data, {
      onSuccess: () => {
        if (onSuccess) onSuccess();
      },
      onError: (err: any) => {
        setServerError(err.response?.data?.message || 'Failed to post review');
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="panel-glass p-6 rounded-2xl border-glass-border space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-surface-100">
          Deploy Expert Review
        </h3>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-dark-base border border-glass-border">
          <span className="text-[9px] font-black uppercase text-surface-400">
            Cost:
          </span>
          <span className="text-[9px] font-black text-brand-primary">
            {INTERACTION_ECONOMY.REVIEW_CREATION_FEE} Coins
          </span>
        </div>
      </div>

      {/* PROTOCOL SELECTION */}
      <div className="grid grid-cols-2 gap-4">
        <label
          className={cn(
            'cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2',
            selectedType === 'POSITIVE'
              ? 'border-brand-primary bg-brand-primary/5 shadow-brand-glow'
              : 'border-glass-border bg-dark-base hover:border-surface-600'
          )}
        >
          <input
            {...register('type')}
            type="radio"
            value="POSITIVE"
            className="hidden"
          />
          <IoShieldOutline
            size={20}
            className={
              selectedType === 'POSITIVE'
                ? 'text-brand-primary'
                : 'text-surface-500'
            }
          />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Support
          </span>
        </label>

        <label
          className={cn(
            'cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2',
            selectedType === 'NEGATIVE'
              ? 'border-brand-danger bg-brand-danger/5 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
              : 'border-glass-border bg-dark-base hover:border-surface-600'
          )}
        >
          <input
            {...register('type')}
            type="radio"
            value="NEGATIVE"
            className="hidden"
          />
          <IoFlashOutline
            size={20}
            className={
              selectedType === 'NEGATIVE'
                ? 'text-brand-danger'
                : 'text-surface-500'
            }
          />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Attack
          </span>
        </label>
      </div>

      {/* CONTENT AREA */}
      <div className="space-y-2">
        <textarea
          {...register('content')}
          placeholder="Analyze production quality..."
          className="w-full bg-dark-base border border-glass-border rounded-xl p-4 text-sm text-surface-100 focus:outline-none focus:border-brand-primary transition-colors min-h-120px resize-none"
        />
        {errors.content && (
          <p className="text-[9px] text-brand-danger font-bold uppercase tracking-tighter">
            {errors.content.message}
          </p>
        )}
      </div>

      {/* DYNAMIC IMPACT PREVIEW */}
      {selectedType === 'NEGATIVE' && content.length > 5 && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-brand-danger/10 border border-brand-danger/20 animate-in fade-in slide-in-from-top-1">
          <IoAlertCircleOutline className="text-brand-danger" size={18} />
          <p className="text-[9px] font-bold text-surface-200 uppercase leading-tight">
            Attack Strength:{' '}
            <span className="text-brand-danger">{potentialImpact} Coins</span>{' '}
            will be drained from author if executed.
          </p>
        </div>
      )}

      {/* STATUS & ACTIONS */}
      <div className="space-y-4">
        <ErrorMessage message={serverError || undefined} />

        <Button
          type="submit"
          isLoading={isPending}
          disabled={!canAfford}
          variant={selectedType === 'NEGATIVE' ? 'primary' : 'primary'}
          className={cn(
            'w-full py-4 text-[10px] font-black uppercase tracking-[0.3em]',
            selectedType === 'NEGATIVE' &&
              'bg-brand-danger hover:bg-red-600 shadow-none'
          )}
        >
          {canAfford ? 'Authorize Protocol' : 'Insufficient Balance'}
        </Button>
      </div>
    </form>
  );
};
