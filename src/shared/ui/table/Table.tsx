import type { ReactNode } from 'react';
import { cn } from '../../lib/clsx';

export const Table = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <table
    className={cn(
      'w-full border-collapse text-left pointer-events-auto',
      className
    )}
  >
    {children}
  </table>
);

export const THead = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <thead
    className={cn(
      'bg-dark-base backdrop-blur-md sticky top-0 z-10 border-b border-glass-border',
      className
    )}
  >
    {children}
  </thead>
);

export const TBody = ({ children }: { children: ReactNode }) => (
  <tbody className="divide-y divide-glass-border">{children}</tbody>
);

export const TH = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <th
    className={cn(
      'px-6 py-4 text-micro font-black uppercase tracking-super-wide text-surface-300',
      className
    )}
  >
    {children}
  </th>
);

export const TR = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <tr
    className={cn(
      'group hover:bg-glass-hover transition-colors duration-300',
      className
    )}
  >
    {children}
  </tr>
);

export const TD = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <td className={cn('px-6 py-4 text-sm text-surface-200', className)}>
    {children}
  </td>
);
