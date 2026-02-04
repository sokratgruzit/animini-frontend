import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSeriesDetails, useVoteVideo } from '../../../features/video/model';
import { ReviewSection } from '../../../features/interactions/ui';
import {
  Badge,
  Button,
  ProgressBar,
  LoadingScreen,
  ErrorMessage,
} from '../../../shared/ui';
import { GENRE_METADATA, type GenreType } from '../../../shared/config/genres';
import { ROUTES } from '../../../shared/config/routes';
import {
  IoPlayOutline,
  IoLockClosedOutline,
  IoDiamondOutline,
  IoStatsChartOutline,
  IoInformationCircleOutline,
  IoShapesOutline,
  IoArrowBackOutline,
} from 'react-icons/io5';
import { cn } from '../../../shared/lib/clsx';

export const PublicSeriesPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { series, isLoading, error } = useSeriesDetails(id || '');
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const { mutate: vote, isPending: isVoting } = useVoteVideo(id);

  if (isLoading) return <LoadingScreen message="Initializing Neural Link..." />;
  if (error || !series)
    return <ErrorMessage message="Failed to sync with series data" />;

  const currentVideo =
    series.videos.find((v) => v.id === activeVideoId) ||
    series.videos.find((v) => v.isReleased) ||
    series.videos[0];

  const handleVote = () => {
    if (!currentVideo) return;
    vote({
      videoId: currentVideo.id,
      amount: 10,
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* HEADER WITH BACK BUTTON */}
      <header className="flex items-center gap-6">
        <Button
          variant="secondary"
          onClick={() => navigate(ROUTES.DISCOVER)}
          className="w-12 h-12 p-0 flex items-center justify-center rounded-xl bg-glass-bg border-glass-border hover:border-brand-primary/50 transition-all"
        >
          <IoArrowBackOutline size={24} />
        </Button>
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-surface-100 tracking-tight uppercase">
              {series.title}
            </h1>
            <Badge variant="primary" icon={<IoShapesOutline size={12} />}>
              {GENRE_METADATA[series.genre as GenreType]?.label || series.genre}
            </Badge>
          </div>
          <p className="text-xs font-bold text-surface-400 uppercase tracking-widest px-0.5">
            {series.description || 'Global Protocol Active'}
          </p>
        </div>
      </header>

      {/* 1. CINEMATIC PLAYER LAYER */}
      <section className="relative group aspect-video w-full overflow-hidden rounded-3xl border border-glass-border bg-black shadow-2xl">
        {currentVideo?.isReleased || currentVideo?.status === 'PUBLISHED' ? (
          <video
            key={currentVideo.id}
            src={currentVideo.url}
            controls
            className="w-full h-full object-contain"
            poster={series.coverUrl || ''}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-4 bg-dark-base/80 backdrop-blur-xl">
            <IoLockClosedOutline
              size={48}
              className="text-brand-primary animate-pulse"
            />
            <div className="text-center">
              <h3 className="text-sm font-black uppercase tracking-[0.3em] text-surface-100">
                Content Encrypted
              </h3>
              <p className="text-[10px] font-bold text-surface-500 uppercase mt-2">
                This episode is currently in funding phase
              </p>
            </div>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* 2. LEFT: EPISODE ROADMAP */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
              <IoPlayOutline className="text-brand-primary" />
              Production Roadmap
            </h2>
            <Badge variant="glass">{series.videos.length} Episodes</Badge>
          </div>

          <div className="space-y-3">
            {series.videos.map((video, index) => {
              const isActive = currentVideo?.id === video.id;
              const isLocked =
                !video.isReleased && video.status !== 'PUBLISHED';

              return (
                <div
                  key={video.id}
                  onClick={() => !isLocked && setActiveVideoId(video.id)}
                  className={cn(
                    'group flex items-center gap-6 p-5 rounded-2xl border transition-all duration-300 cursor-pointer',
                    isActive
                      ? 'bg-brand-primary/10 border-brand-primary shadow-brand-glow'
                      : 'bg-glass-bg border-glass-border hover:border-brand-primary/30',
                    isLocked && 'opacity-50 cursor-not-allowed grayscale'
                  )}
                >
                  <div className="text-2xl font-black italic opacity-20 group-hover:opacity-100 transition-opacity">
                    {(index + 1).toString().padStart(2, '0')}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black uppercase tracking-widest text-surface-100 truncate">
                      {video.title}
                    </h4>
                    <p className="text-[10px] font-bold text-surface-500 uppercase tracking-tighter truncate mt-1">
                      {video.description || 'No data protocol available'}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    {video.isReleased ? (
                      <Badge
                        variant="glass"
                        className="text-brand-success border-brand-success/20"
                      >
                        Released
                      </Badge>
                    ) : (
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] font-black text-brand-primary italic">
                          {Math.floor(
                            (video.collectedFunds / video.votesRequired) * 100
                          )}
                          % Funded
                        </span>
                        <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-primary"
                            style={{
                              width: `${
                                (video.collectedFunds / video.votesRequired) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. RIGHT: SUPPORT MATRIX (VOTING) */}
        <aside className="space-y-6">
          <div className="panel-glass p-8 rounded-3xl border-brand-primary/20 bg-brand-primary/5 sticky top-24">
            <div className="flex items-center gap-3 mb-6">
              <IoStatsChartOutline className="text-brand-primary animate-pulse" />
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-surface-100">
                Support Matrix
              </h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-surface-400">
                  <span>Current Progress</span>
                  <span className="text-surface-100">
                    {currentVideo?.collectedFunds.toLocaleString()} /{' '}
                    {currentVideo?.votesRequired.toLocaleString()}
                  </span>
                </div>
                <ProgressBar
                  progress={
                    currentVideo
                      ? (currentVideo.collectedFunds /
                          currentVideo.votesRequired) *
                        100
                      : 0
                  }
                  variant="primary"
                  className="h-2 shadow-brand-glow"
                />
              </div>

              <div className="p-4 rounded-xl bg-dark-base/50 border border-glass-border">
                <div className="flex items-center gap-3 text-brand-primary mb-2">
                  <IoInformationCircleOutline size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Protocol
                  </span>
                </div>
                <p className="text-[9px] font-medium text-surface-400 leading-relaxed uppercase">
                  {currentVideo?.isReleased
                    ? "Production finalized. Any further votes will contribute to author's global reputation."
                    : 'Funding active. Reaching 100% threshold will trigger automatic episode release.'}
                </p>
              </div>

              <Button
                variant="primary"
                className="w-full py-5 text-[11px] font-black uppercase tracking-[0.4em] shadow-brand-glow"
                onClick={handleVote}
                isLoading={isVoting}
                disabled={
                  !currentVideo ||
                  (!currentVideo.isReleased &&
                    currentVideo.status !== 'PUBLISHED')
                }
              >
                <IoDiamondOutline className="mr-2" size={18} />
                Cast Your Vote
              </Button>
            </div>
          </div>
        </aside>
      </div>

      {/* 4. INTERACTION LAYER: EXPERT REVIEWS */}
      {currentVideo && (
        <section className="mt-20 pt-20 border-t border-glass-border">
          <ReviewSection videoId={currentVideo.id} seriesId={series.id} />
        </section>
      )}
    </div>
  );
};

export default PublicSeriesPage;
