import { Link } from 'react-router-dom';
import { VideoStatsCard } from '../../../shared/ui';
import { type SeriesItem } from '../api';
import { ROUTES, getRouteWithId } from '../../../shared/config/routes';

interface AuthorSeriesListProps {
  series: SeriesItem[];
  isLoading: boolean;
  error: string | null;
}

/**
 * AuthorSeriesList now supports navigation to series details (2026).
 */
export const AuthorSeriesList = ({
  series,
  isLoading,
  error,
}: AuthorSeriesListProps) => {
  if (isLoading) {
    return (
      <div className="p-12">
        <div className="text-xs font-medium text-surface-400 animate-pulse uppercase tracking-wider">
          Syncing workspace hierarchy...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 border border-brand-danger/20 bg-brand-danger/5 text-brand-danger text-xs font-medium rounded-xl">
        Error: {error}
      </div>
    );
  }

  if (series.length === 0) {
    return (
      <div className="p-12 border border-dashed border-glass-border rounded-xl text-center">
        <p className="text-sm text-surface-300 italic">
          No series found. Create your first production project to start.
        </p>
      </div>
    );
  }

  return (
    <>
      {series.map((item) => (
        <Link
          key={item.id}
          to={getRouteWithId(ROUTES.AUTHOR_SERIES_DETAILS, item.id)}
          className="transition-transform duration-300 active:scale-95 block"
        >
          <VideoStatsCard
            url={item.coverUrl}
            title={item.title}
            collected={item.collectedFunds}
            required={item.votesRequired}
            status={item.videos.length > 0 ? 'ACTIVE' : 'EMPTY'}
          />
        </Link>
      ))}
    </>
  );
};
