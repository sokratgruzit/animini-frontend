import { type ReactNode } from 'react';
import { cn } from '../../lib/clsx';

interface PanelContentProps {
  children: ReactNode;
  className?: string;
}

export const PanelContent = ({ children, className }: PanelContentProps) => {
  return (
    <div
      className={cn(
        'flex-1 overflow-y-auto p-6 pointer-events-auto',
        className
      )}
    >
      {children}
    </div>
  );
};
