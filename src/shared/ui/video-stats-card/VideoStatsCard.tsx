import { cn } from '../../lib/clsx';
import { IoPlayCircleOutline } from 'react-icons/io5';
import { Badge } from '../badge/Badge';
import { ProgressBar } from '../progress-bar/ProgressBar';

interface VideoStatsCardProps {
  title: string;
  url?: string;
  collected?: number;
  required?: number;
  status: string;
  className?: string;
  index?: number;
  metadata?: React.ReactNode;
  actions?: React.ReactNode;
}

export const VideoStatsCard = ({
  title,
  url,
  collected,
  required,
  status,
  className,
  index,
  metadata,
  actions,
}: VideoStatsCardProps) => {
  const showProgress = collected !== undefined && required !== undefined;
  const progress = showProgress
    ? Math.min(Math.round((collected / required) * 100), 100)
    : 0;

  return (
    <div
      className={cn(
        'panel-glass overflow-hidden flex flex-col group h-full relative isolate',
        className
      )}
    >
      {/* Media Section */}
      <div className="relative aspect-video bg-dark-base border-b border-glass-border overflow-hidden shrink-0">
        {url ? (
          <>
            <video
              src={`${url}#t=0.1`}
              preload="metadata"
              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
            />
            {/* Play Overlay - pointer-events-none ensures clicks go through to card wrapper/link */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 pointer-events-none">
              <IoPlayCircleOutline
                size={48}
                className="text-white drop-shadow-2xl"
              />
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-brand-primary/10 to-transparent">
            <IoPlayCircleOutline
              size={40}
              className="text-surface-400 opacity-20"
            />
          </div>
        )}

        {index !== undefined && (
          <Badge variant="primary" className="absolute top-3 left-3">
            {index.toString().padStart(2, '0')}
          </Badge>
        )}

        <Badge variant="primary" className="absolute top-3 right-3 shadow-xl">
          {status}
        </Badge>
      </div>

      {/* Content Section - elevate it */}
      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between relative z-10">
        <h3 className="text-md font-bold text-surface-100 truncate group-hover:text-brand-primary transition-colors">
          {title}
        </h3>

        {/* Combined Footer Section */}
        <div className="space-y-3">
          {showProgress ? (
            <ProgressBar
              progress={progress}
              label="Funding Progress"
              subLabel={`${collected.toLocaleString()} / ${required.toLocaleString()}`}
              size="md"
            />
          ) : (
            // Metadata for Series view (no progress bar)
            <div className="min-h-1.5rem flex items-center">{metadata}</div>
          )}

          {/* Actions are now always rendered below the progress/metadata block */}
          <div className="flex items-center justify-between gap-4 pointer-events-auto">
            {showProgress && metadata && (
              // Metadata for Episode view (rendered next to actions if progress is shown)
              <div className="flex-1 min-w-0">{metadata}</div>
            )}

            <div className="shrink-0 relative z-50 pointer-events-auto">
              {actions}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
