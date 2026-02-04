import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoSkullOutline,
  IoShieldCheckmarkOutline,
} from 'react-icons/io5';
import { Button, ProgressBar } from '../../../shared/ui';
import { type ReviewItem } from '../api';
import { useVoteReview } from '../model/use-vote-review';
import { cn } from '../../../shared/lib/clsx';

interface ReviewCardProps {
  review: ReviewItem;
  seriesId: string;
}

export const ReviewCard = ({ review, seriesId }: ReviewCardProps) => {
  const { mutate: vote, isPending } = useVoteReview(review.videoId, seriesId);

  const isNegative = review.type === 'NEGATIVE';
  const executeProgress = (review.currentVotes / review.votesRequired) * 100;
  const cancelProgress = (review.cancelVotes / 30) * 100; // Hardcoded limit from constants

  return (
    <div
      className={cn(
        'panel-glass p-5 rounded-2xl border transition-all duration-500',
        isNegative
          ? 'border-brand-danger/20 hover:border-brand-danger/40'
          : 'border-brand-success/20 hover:border-brand-success/40',
        review.isExecuted && 'opacity-80 bg-surface-900/50'
      )}
    >
      {/* HEADER: Author and Type */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-glass-bg border border-glass-border flex items-center justify-center text-xs font-black text-brand-primary">
            {review.critic.name[0]}
          </div>
          <div>
            <h5 className="text-[11px] font-black uppercase tracking-widest text-surface-100">
              {review.critic.name}
              Courier
            </h5>
            <span
              className={cn(
                'text-[9px] font-bold uppercase tracking-tighter',
                isNegative ? 'text-brand-danger' : 'text-brand-success'
              )}
            >
              {isNegative ? 'Negative Protocol' : 'Positive Feedback'}
            </span>
          </div>
        </div>
        {review.isExecuted && (
          <div className="flex items-center gap-1.5 text-brand-primary animate-pulse">
            {isNegative ? (
              <IoSkullOutline size={14} />
            ) : (
              <IoShieldCheckmarkOutline size={14} />
            )}
            <span className="text-[9px] font-black uppercase">Executed</span>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <p className="text-sm text-surface-300 leading-relaxed mb-6 italic">
        "{review.content}"
      </p>

      {/* BATTLE PROGRESS */}
      <div className="space-y-4">
        {/* Execution Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-surface-500">
            <span>Power to Execute</span>
            <span>
              {review.currentVotes} / {review.votesRequired}
            </span>
          </div>
          <ProgressBar
            progress={executeProgress}
            variant={isNegative ? 'danger' : 'primary'}
            showInfo={false}
            className="h-1.5"
          />
        </div>

        {/* Cancellation Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-surface-500">
            <span>Power to Cancel</span>
            <span>{review.cancelVotes} / 30</span>
          </div>
          <ProgressBar
            progress={cancelProgress}
            variant="glass"
            showInfo={false}
            className="h-1.5"
          />
        </div>
      </div>

      {/* ACTIONS */}
      {!review.isExecuted && (
        <div className="grid grid-cols-2 gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => vote({ reviewId: review.id, isCancel: false })}
            isLoading={isPending}
            className="py-2 text-[9px] font-black uppercase tracking-widest border-surface-700 hover:border-brand-primary"
          >
            <IoCheckmarkCircleOutline className="mr-1.5" />
            Support
          </Button>
          <Button
            variant="outline"
            onClick={() => vote({ reviewId: review.id, isCancel: true })}
            isLoading={isPending}
            className="py-2 text-[9px] font-black uppercase tracking-widest border-surface-700 hover:text-brand-danger hover:border-brand-danger"
          >
            <IoCloseCircleOutline className="mr-1.5" />
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};
