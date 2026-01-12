import { useState } from 'react';
import { useAppSelector } from '../../../app/store';
import { selectUserData } from '../model/selectors';
import { resendEmailRequest } from '../api/user-api';
import {
  IoMailUnreadOutline,
  IoCheckmarkCircleOutline,
  IoAlertCircleOutline,
} from 'react-icons/io5';
import { cn } from '../../../shared/lib/clsx';
import { Button } from '../../../shared/ui';

export const VerificationBanner = () => {
  const user = useAppSelector(selectUserData);
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');

  if (!user || user.emailVerified) return null;

  const handleResend = async () => {
    try {
      setStatus('loading');
      await resendEmailRequest();
      setStatus('success');
      setTimeout(() => setStatus('idle'), 5000);
    } catch (e) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div
      className={cn(
        'fixed top-20 left-0 right-0 z-30',
        'w-full py-6 px-6 md:px-10 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10 transition-all duration-500',
        status === 'error'
          ? 'bg-brand-danger/30'
          : 'bg-brand-primary/20 border-b border-brand-primary/40 backdrop-blur-md'
      )}
    >
      <div className="flex flex-col md:flex-row items-center gap-3 md:gap-5 text-center md:text-left">
        {status === 'success' ? (
          <IoCheckmarkCircleOutline
            className="text-brand-success animate-bounce"
            size={32}
          />
        ) : status === 'error' ? (
          <IoAlertCircleOutline className="text-brand-danger" size={32} />
        ) : (
          <IoMailUnreadOutline
            className="text-brand-primary animate-pulse"
            size={32}
          />
        )}

        <p className="text-xs sm:text-sm md:text-lg font-black uppercase tracking-[0.15em] md:tracking-[0.25em] text-surface-100 leading-tight">
          {status === 'success'
            ? 'Verification link sent!'
            : status === 'error'
              ? 'Failed to send'
              : 'Account not verified'}
        </p>
      </div>

      <Button
        variant="primary"
        onClick={handleResend}
        isLoading={status === 'loading'}
        disabled={status === 'success'}
        className="py-2 px-6 md:px-8 text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] w-full md:w-auto h-auto min-h-0"
      >
        {status === 'success' ? 'Sent' : 'Resend Email'}
      </Button>
    </div>
  );
};
