import { Link } from 'react-router-dom';
import { VideoStatsCard } from '../../../shared/ui';
import { type SeriesItem } from '../api';
import { ROUTES, getRouteWithId } from '../../../shared/config/routes';

interface AuthorSeriesListProps {
  series: SeriesItem[];
  isLoading: boolean;
  error: string | null;
}

export const AuthorSeriesList = ({
  series,
  isLoading,
  error,
}: AuthorSeriesListProps) => {
  if (isLoading)
    return (
      <div className="p-12 animate-pulse text-surface-400">Syncing...</div>
    );
  if (error) return <div className="p-6 text-brand-danger">Error: {error}</div>;
  if (series.length === 0) return null;

  return (
    <>
      {series.map((item) => {
        const status = item.videos.length > 0 ? 'ACTIVE' : 'EMPTY';
        const releasedCount = item.videos.filter((v) => v.isReleased).length;

        return (
          <Link
            key={item.id}
            to={getRouteWithId(ROUTES.AUTHOR_SERIES_DETAILS, item.id)}
            className="transition-transform duration-300 active:scale-95 flex flex-col h-full"
          >
            <VideoStatsCard
              url={item.coverUrl}
              title={item.title}
              status={status}
              className="w-full h-full"
              metadata={
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-surface-400 whitespace-nowrap">
                  <span>Total Earned:</span>
                  <span className="text-brand-primary">
                    {item.totalEarnings.toLocaleString()} coins
                  </span>
                </div>
              }
              actions={
                <span className="text-xs font-bold text-surface-300 whitespace-nowrap">
                  {releasedCount} episodes
                </span>
              }
            />
          </Link>
        );
      })}
    </>
  );
};
