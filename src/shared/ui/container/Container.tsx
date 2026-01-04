import { type ReactNode } from 'react';
import { cn } from '../../lib/clsx';

interface ContainerProps {
  children: ReactNode;
  /**
   * Defines if the container should center its content vertically and horizontally
   * Useful for Auth and Error pages
   */
  isCentered?: boolean;
  className?: string;
}

/**
 * Reusable Container component to maintain consistent layout width and padding across the app.
 */
export const Container = ({
  children,
  isCentered = false,
  className,
}: ContainerProps) => {
  return (
    <div
      className={cn(
        'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-auto',
        isCentered && 'min-h-screen flex flex-col items-center justify-center',
        className
      )}
    >
      {children}
    </div>
  );
};

Container.displayName = 'Container';
