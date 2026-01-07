import { cn } from '../../lib/clsx';

interface VideoStatsCardProps {
  title: string;
  collected: number;
  required: number;
  status: string;
  className?: string;
}

export const VideoStatsCard = ({
  title,
  collected,
  required,
  status,
  className,
}: VideoStatsCardProps) => {
  const progress = Math.min(Math.round((collected / required) * 100), 100);

  return (
    <div className={cn('panel-glass p-6 flex flex-col gap-4', className)}>
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold text-surface-100 truncate pr-4">
          {title}
        </h3>
        <span className="px-2 py-1 text-micro font-black uppercase tracking-wider bg-brand-primary/20 text-brand-primary rounded">
          {status}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-medium text-surface-300">
          <span>Progress: {progress}%</span>
          <span>
            {collected} / {required} coins
          </span>
        </div>

        {/* Progress Bar Container */}
        <div className="h-1.5 w-full bg-glass-border rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-primary transition-all duration-500 ease-out shadow-[0_0_8px_rgba(99,102,241,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
