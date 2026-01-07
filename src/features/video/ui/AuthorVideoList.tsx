import { useAuthorVideos } from '../model';
import { VideoStatsCard } from '../../../shared/ui';

export const AuthorVideoList = () => {
  const { videos, isLoading, error } = useAuthorVideos();

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <div className="text-xs font-medium text-surface-400 animate-pulse uppercase tracking-wider">
          Loading author workspace...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel-glass p-6 border-brand-danger/20 text-brand-danger text-xs font-medium">
        Error: {error}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="panel-glass p-12 text-center">
        <p className="text-sm text-surface-300">
          No series found. Upload your first video to start collecting votes.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {videos.map((video) => (
        <VideoStatsCard
          key={video.id}
          title={video.title}
          collected={video.collectedFunds}
          required={video.votesRequired}
          status={video.status}
        />
      ))}
    </div>
  );
};
