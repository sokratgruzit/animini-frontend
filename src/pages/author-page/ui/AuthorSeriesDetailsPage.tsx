import { useParams, useNavigate } from 'react-router-dom';
import { IoArrowBackOutline } from 'react-icons/io5';
import { Button } from '../../../shared/ui';
import { CreateVideoForm, EpisodeList } from '../../../features/video/ui';
import { useSeriesDetails } from '../../../features/video/model/use-series-details';
import { ROUTES } from '../../../shared/config/routes';

const AuthorSeriesDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { series, isLoading, error, refresh } = useSeriesDetails(id || '');

  if (!id) {
    return (
      <div className="p-8 text-brand-danger font-black uppercase tracking-widest text-center">
        Critical Error: Series ID is missing
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Section (unchanged) */}
      <header className="flex items-center gap-6">
        <Button
          variant="secondary"
          onClick={() => navigate(ROUTES.AUTHOR)}
          className="w-12 h-12 p-0 flex items-center justify-center rounded-xl bg-glass-bg border-glass-border hover:border-brand-primary/50 transition-all"
        >
          <IoArrowBackOutline size={24} />
        </Button>
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-surface-100 tracking-tight uppercase">
            {isLoading
              ? 'Loading Project...'
              : series?.title || 'Project Details'}
          </h1>
          {/* ... metadata ... */}
        </div>
      </header>

      {/* UNIFIED GRID: Exactly like AuthorPage, but with different columns */}
      <div className="space-y-6">
        <h2 className="text-xs font-black uppercase tracking-super-wide text-surface-400 px-1">
          Production Pipeline
        </h2>

        {/* 
          Main Grid: Form goes first, followed by Episode cards.
          We use grid-cols-1 for mobile, md:grid-cols-2 for wider screens.
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Primary Action Card: Always first in the grid */}
          <div className="h-full">
            <CreateVideoForm seriesId={id} onSuccess={refresh} />
          </div>

          {/* Episode Cards: Need EpisodeList to return a Fragment (see below) */}
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
