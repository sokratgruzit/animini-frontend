import { cn } from '../../lib/clsx';

interface SkeletonProps {
  className?: string;
}

/**
 * Animated placeholder for loading states
 */
export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div className={cn('animate-pulse bg-glass-bg rounded-md', className)} />
  );
};
