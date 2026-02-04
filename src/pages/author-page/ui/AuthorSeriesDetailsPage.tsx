import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  IoArrowBackOutline,
  IoWalletOutline,
  IoLockClosedOutline,
  IoMailUnreadOutline,
  IoShapesOutline, // Added for Genre icon
} from 'react-icons/io5';
import { Button, Badge } from '../../../shared/ui';
import { CreateVideoForm, EpisodeList } from '../../../features/video/ui';
import { useSeriesDetails } from '../../../features/video/model/use-series-details';
import { ROUTES } from '../../../shared/config/routes';
import { GENRE_METADATA, type GenreType } from '../../../shared/config/genres'; // Added Genres Config
import { type RootState } from '../../../app/store';

const AuthorSeriesDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 1. Get series data via React Query
  const { series, isLoading, error, refresh } = useSeriesDetails(id || '');

  /**
   * 2. Accessing user data correctly from Redux state.
   */
  const userData = useSelector((state: RootState) => state.user.data);

  if (!id) {
    return (
      <div className="p-8 text-brand-danger font-black uppercase tracking-widest text-center">
        Critical Error: Series ID is missing
      </div>
    );
  }

  /**
   * BUSINESS LOGIC:
   * - Block if email is not verified.
   * - Block if there's any video that hasn't been released yet (active funding).
   */
  const isEmailUnverified = userData?.emailVerified === false;
  const hasActiveFunding = series?.videos.some((video) => !video.isReleased);
  const isUploadLocked = isEmailUnverified || hasActiveFunding;

  return (
    <div className="max-w-7xl mx-auto py-8 space-y-8">
      <header className="flex items-center gap-6">
        <Button
          variant="secondary"
          onClick={() => navigate(ROUTES.AUTHOR)}
          className="w-12 h-12 p-0 flex items-center justify-center rounded-xl bg-glass-bg border-glass-border hover:border-brand-primary/50 transition-all"
        >
          <IoArrowBackOutline size={24} />
        </Button>
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-surface-100 tracking-tight uppercase">
              {isLoading
                ? 'Loading Project...'
                : series?.title || 'Project Details'}
            </h1>
            {!isLoading && series && (
              <Badge variant="primary" icon={<IoWalletOutline size={12} />}>
                {series.totalEarnings.toLocaleString()} coins earned
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-4 px-0.5">
            {/* Genre display added here */}
            {!isLoading && series && (
              <div className="flex items-center gap-1.5 text-brand-primary">
                <IoShapesOutline size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {GENRE_METADATA[series.genre as GenreType]?.label ||
                    series.genre}
                </span>
              </div>
            )}
            <p className="text-xs font-bold text-surface-400 uppercase tracking-widest">
              {series?.description ||
                'Manage your production episodes and funding'}
            </p>
          </div>
        </div>
      </header>

      <div className="space-y-6">
        <h2 className="text-xs font-black uppercase tracking-super-wide text-surface-400 px-1">
          Production Pipeline
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <div className="h-full">
            {isUploadLocked && !isLoading ? (
              <div className="panel-glass p-8 h-full flex flex-col items-center justify-center text-center space-y-4 border-dashed border-brand-primary/20">
                <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  {isEmailUnverified ? (
                    <IoMailUnreadOutline size={32} />
                  ) : (
                    <IoLockClosedOutline size={32} />
                  )}
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-black uppercase tracking-widest text-surface-100">
                    Upload Locked
                  </h3>
                  <p className="text-xs text-surface-400 font-medium leading-relaxed max-w-240px">
                    {isEmailUnverified
                      ? 'Please verify your email address to unlock production tools.'
                      : 'You can only upload a new episode once the current one is fully funded and released.'}
                  </p>
                </div>
              </div>
            ) : (
              <CreateVideoForm seriesId={id} onSuccess={refresh} />
            )}
          </div>

          <EpisodeList
            videos={series?.videos || []}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthorSeriesDetailsPage;
