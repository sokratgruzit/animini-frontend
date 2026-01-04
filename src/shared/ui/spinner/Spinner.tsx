import type { JSX } from 'react';

type SpinnerProps = {
  message?: string;
};

export const Spinner = ({ message }: SpinnerProps): JSX.Element => {
  return (
    <div className="flex items-center gap-2">
      {/* Spinner synced with brand colors */}
      <div className="w-5 h-5 border-2 border-surface-100/30 border-t-surface-100 rounded-full animate-spin" />
      {message && (
        <span className="text-micro font-black uppercase tracking-super-wide opacity-70">
          {message}
        </span>
      )}
    </div>
  );
};
