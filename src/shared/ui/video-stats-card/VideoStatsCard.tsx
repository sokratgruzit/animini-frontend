import { cn } from '../../lib/clsx';
import { IoPlayCircleOutline } from 'react-icons/io5';

interface VideoStatsCardProps {
  title: string;
  url?: string; // Added to show the preview
  collected: number;
  required: number;
  status: string;
  className?: string;
}

export const VideoStatsCard = ({
  title,
  url,
  collected,
  required,
  status,
  className,
}: VideoStatsCardProps) => {
  const progress = Math.min(Math.round((collected / required) * 100), 100);

  return (
    <div
      className={cn(
        'panel-glass overflow-hidden flex flex-col group',
        className
      )}
    >
      {/* 1. Preview Section */}
      <div className="relative aspect-video bg-dark-base border-b border-glass-border overflow-hidden">
        {url ? (
          <video
            src={`${url}#t=0.1`}
            preload="metadata"
            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-brand-primary/10 to-transparent">
            <IoPlayCircleOutline
              size={40}
              className="text-surface-400 opacity-20"
            />
          </div>
        )}

        {/* Overlay Status Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 text-[10px] font-black uppercase tracking-wider bg-dark-base/80 backdrop-blur-md text-brand-primary border border-brand-primary/30 rounded shadow-xl">
            {status}
          </span>
        </div>
      </div>

      {/* 2. Content Section */}
      <div className="p-5 space-y-4">
        <h3 className="text-md font-bold text-surface-100 truncate">{title}</h3>

        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-surface-400">
            <span>Funding Progress: {progress}%</span>
            <span className="text-brand-primary">
              {collected.toLocaleString()} / {required.toLocaleString()}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-glass-border rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-primary transition-all duration-700 ease-out shadow-[0_0_12px_rgba(99,102,241,0.6)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
