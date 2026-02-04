import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePublicFeed } from '../../../features/video/model';
import { Badge, Button, ProgressBar } from '../../../shared/ui';
import { ROUTES, getRouteWithId } from '../../../shared/config/routes';
import {
  GENRE_OPTIONS,
  GENRE_METADATA,
  type GenreType,
} from '../../../shared/config/genres';
import {
  IoFlashOutline,
  IoTimeOutline,
  IoCheckmarkDoneOutline,
  IoTrendingUpOutline,
  IoFingerPrintOutline,
} from 'react-icons/io5';
import { cn } from '../../../shared/lib/clsx';

const FEED_TYPES = [
  { id: 'new', label: 'Fresh Blood', icon: IoTimeOutline },
  { id: 'hot', label: 'Hot Now', icon: IoFlashOutline },
  { id: 'most_funded', label: 'Top Earners', icon: IoTrendingUpOutline },
  { id: 'completed', label: 'Archive', icon: IoCheckmarkDoneOutline },
] as const;

export const DiscoverPage = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] =
    useState<(typeof FEED_TYPES)[number]['id']>('new');

  // Changed: Single genre selection instead of tags array
  const [selectedGenre, setSelectedGenre] = useState<GenreType | null>(null);

  const { items, hasNextPage, isFetchingNextPage, fetchNextPage } =
    usePublicFeed({
      type: selectedType,
      genre: selectedGenre || undefined, // Updated to pass genre
      limit: 12,
    });

  const toggleGenre = (genre: GenreType) => {
    setSelectedGenre((prev) => (prev === genre ? null : genre));
  };

  const handleCardClick = (id: string) => {
    navigate(getRouteWithId(ROUTES.PUBLIC_SERIES_DETAILS, id));
  };

  return (
    <div className="space-y-12 pb-20">
      {/* 1. RADICAL FILTER SYSTEM */}
      <section className="relative group">
        <div className="absolute -inset-1 bg-linear-to-r from-brand-primary/20 to-transparent blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>

        <div className="relative flex flex-col md:flex-row items-stretch gap-0 border border-glass-border bg-dark-base/40 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl">
          <div className="flex md:flex-col items-center justify-center p-2 border-b md:border-b-0 md:border-r border-glass-border bg-white/5 shrink-0 gap-2">
            {FEED_TYPES.map((type) => {
              const Icon = type.icon;
              const isActive = selectedType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={cn(
                    'w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-500',
                    isActive
                      ? 'bg-brand-primary text-dark-base shadow-brand-glow scale-110'
                      : 'text-surface-500 hover:text-surface-100 hover:bg-white/5'
                  )}
                  title={type.label}
                >
                  <Icon size={24} />
                </button>
              );
            })}
          </div>

          <div className="flex-1 p-6 flex flex-col justify-center min-h-120px">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-6 h-6 rounded bg-brand-primary/10 text-brand-primary animate-pulse">
                <IoFingerPrintOutline size={14} />
              </div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-surface-300">
                System Filter Matrix:{' '}
                <span className="text-brand-primary">{selectedType}</span>
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-wrap gap-2">
                {GENRE_OPTIONS.map((option) => (
                  <Button
                    key={option.value}
                    onClick={() => toggleGenre(option.value)}
                    variant={
                      selectedGenre === option.value ? 'primary' : 'outline'
                    }
                    className={cn(
                      'w-fit h-10 px-4 text-[9px] font-black uppercase tracking-widest transition-all duration-300',
                      selectedGenre === option.value
                        ? 'shadow-brand-glow scale-105'
                        : 'border-glass-border text-surface-500 hover:text-surface-100 hover:bg-white/5'
                    )}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>

              {selectedGenre && (
                <>
                  <div className="w-px h-6 bg-glass-border mx-2 hidden sm:block" />
                  <Button
                    variant="outline"
                    onClick={() => setSelectedGenre(null)}
                    className="h-10 px-6 border-brand-danger/20 text-brand-danger text-[9px] font-black uppercase tracking-widest hover:bg-brand-danger/10"
                  >
                    Purge Matrix
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {items.map((series) => (
          <div
            key={series.id}
            onClick={() => handleCardClick(series.id)}
            className="group relative flex flex-col bg-dark-base border border-glass-border rounded-2xl overflow-hidden hover:border-brand-primary/50 transition-all duration-500 shadow-xl cursor-pointer"
          >
            <div className="relative aspect-16/10 overflow-hidden">
              {series.coverUrl ? (
                <img
                  src={series.coverUrl}
                  alt={series.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center text-[10px] font-black text-surface-600 uppercase tracking-widest">
                  No Cover Data
                </div>
              )}

              <div className="absolute top-4 left-4">
                <Badge
                  variant="glass"
                  className="bg-dark-base/80 border-none px-3 py-1.5 rounded-lg"
                >
                  {series.stats.releasedCount}/{series.stats.totalEpisodes} EP
                </Badge>
              </div>

              {/* Badge for Genre on card */}
              <div className="absolute bottom-4 right-4">
                <div className="px-2 py-1 bg-brand-primary/20 backdrop-blur-md border border-brand-primary/30 rounded text-[8px] font-black text-brand-primary uppercase tracking-tighter">
                  {GENRE_METADATA[series.genre as GenreType]?.label ||
                    series.genre}
                </div>
              </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2 opacity-60">
                  <div className="w-4 h-4 rounded bg-brand-primary/20 flex items-center justify-center overflow-hidden">
                    {series.author.avatar ? (
                      <img
                        src={series.author.avatar}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-2 h-2 bg-brand-primary rounded-full" />
                    )}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-surface-400">
                    {series.author.name}
                  </span>
                </div>
                <h3 className="text-xl font-black text-surface-100 uppercase tracking-tighter leading-none group-hover:text-brand-primary transition-colors">
                  {series.title}
                </h3>
              </div>

              {series.activeEpisode && (
                <div className="mt-auto space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-brand-primary uppercase tracking-widest">
                        Current Pool
                      </span>
                      <span className="text-[10px] font-bold text-surface-300 uppercase truncate max-w-150px">
                        {series.activeEpisode.title}
                      </span>
                    </div>
                    <span className="text-sm font-black italic text-surface-100">
                      {series.activeEpisode.progress}%
                    </span>
                  </div>
                  <ProgressBar
                    progress={series.activeEpisode.progress}
                    variant="primary"
                    className="h-1 shadow-brand-glow"
                  />

                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleGenre(series.genre as GenreType);
                      }}
                      className={cn(
                        'text-[9px] font-black uppercase tracking-tighter transition-all',
                        selectedGenre === series.genre
                          ? 'text-brand-primary'
                          : 'text-surface-600 hover:text-surface-300'
                      )}
                    >
                      #
                      {GENRE_METADATA[series.genre as GenreType]?.label ||
                        series.genre}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {hasNextPage && (
        <div className="flex justify-center pt-10">
          <Button
            onClick={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
            variant="secondary"
            className="px-20 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.5em] border-glass-border hover:border-brand-primary/50 shadow-2xl"
          >
            Load More Units
          </Button>
        </div>
      )}
    </div>
  );
};

export default DiscoverPage;
