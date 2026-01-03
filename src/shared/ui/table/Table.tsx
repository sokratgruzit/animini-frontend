import type { ReactNode } from 'react';
import { cn } from '../../lib/clsx';

export const Table = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <table className={cn('w-full border-collapse text-left', className)}>
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
    className={cn('bg-[#020617] backdrop-blur-md sticky top-0 z-10', className)}
  >
    {children}
  </thead>
);

export const TBody = ({ children }: { children: ReactNode }) => (
  <tbody className="divide-y divide-white/5">{children}</tbody>
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
      'px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500',
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
      'group hover:bg-white/5 transition-colors duration-200',
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
  <td className={cn('px-6 py-4 text-sm text-white/70', className)}>
    {children}
  </td>
);
