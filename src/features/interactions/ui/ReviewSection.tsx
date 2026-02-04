import { useAppSelector } from '../../../app/store';
import { selectIsCritic } from '../../../entities/user';
import { useReviews } from '../model/use-reviews';
import { ReviewCard } from './ReviewCard';
import { ReviewForm } from './ReviewForm';
import { LoadingScreen, ErrorMessage } from '../../../shared/ui';
import { IoChatbubblesOutline } from 'react-icons/io5';

interface ReviewSectionProps {
  videoId: string;
  seriesId: string;
}

export const ReviewSection = ({ videoId, seriesId }: ReviewSectionProps) => {
  const isCritic = useAppSelector(selectIsCritic);
  const { data: reviews, isLoading, error } = useReviews(videoId);

  if (isLoading) {
    return <LoadingScreen message="Syncing Review Grid..." />;
  }

  if (error) {
    return <ErrorMessage message="Failed to load interaction protocols" />;
  }

  return (
    <div className="space-y-12">
      {/* 1. SECTION HEADER */}
      <div className="flex items-center justify-between border-b border-glass-border pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20">
            <IoChatbubblesOutline size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter text-surface-100">
              Expert Reviews
            </h2>
            <p className="text-[10px] font-bold text-surface-500 uppercase tracking-widest mt-1">
              Social Consensus & Production Analysis
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-brand-primary italic">
            {reviews?.length || 0}
          </span>
          <p className="text-[9px] font-bold text-surface-500 uppercase">
            Active Protocols
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* 2. CRITIC ACTION ZONE */}
        {isCritic && (
          <aside className="lg:col-span-1 space-y-4 sticky top-24">
            <ReviewForm videoId={videoId} seriesId={seriesId} />
            <p className="text-[9px] font-medium text-surface-500 uppercase px-2 leading-relaxed">
              Submitting a review requires a collateral fee. Inaccurate or
              malicious reports can be canceled by community consensus.
            </p>
          </aside>
        )}

        {/* 3. REVIEWS GRID */}
        <div className={isCritic ? 'lg:col-span-2' : 'lg:col-span-3'}>
          {reviews && reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  seriesId={seriesId}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-glass-border rounded-3xl bg-dark-base/30">
              <IoChatbubblesOutline
                size={48}
                className="text-surface-600 opacity-20 mb-4"
              />
              <p className="text-sm font-bold text-surface-500 uppercase tracking-widest">
                No active reviews for this episode
              </p>
              {!isCritic && (
                <p className="text-[10px] text-surface-600 uppercase mt-2">
                  Only verified critics can deploy interaction protocols
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
