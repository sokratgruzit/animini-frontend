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
        'flex items-center justify-between p-6 border-b border-white/10',
        className
      )}
    >
      <h2 className="text-xl font-bold text-indigo-500 selection:bg-indigo-500/30">
        {title}
      </h2>

      <Button
        variant="outline"
        onClick={onClose}
        className="w-10 h-10 p-0 rounded-lg border-transparent hover:bg-white/5 text-gray-400 hover:text-white"
        aria-label="Close panel"
      >
        <IoClose size={24} />
      </Button>
    </div>
  );
};
