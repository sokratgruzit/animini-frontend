import { IoClose } from 'react-icons/io5';
import { cn } from '../../lib/clsx';
import { Button } from '../button/Button';

interface PanelHeaderProps {
  title: string;
  onClose: () => void;
  className?: string;
}

export const PanelHeader = ({
  title,
  onClose,
  className,
}: PanelHeaderProps) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-6 border-b border-glass-border pointer-events-auto',
        className
      )}
    >
      <h2 className="text-xl font-bold text-brand-primary selection:bg-brand-primary/30 tracking-tight">
        {title}
      </h2>

      <Button
        variant="outline"
        onClick={onClose}
        className="w-10 h-10 p-0 rounded-lg border-transparent hover:bg-glass-hover text-surface-300 hover:text-surface-100"
        aria-label="Close panel"
      >
        <IoClose size={24} />
      </Button>
    </div>
  );
};
