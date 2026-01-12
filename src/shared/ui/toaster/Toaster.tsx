import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoCheckmarkCircle,
  IoAlertCircle,
  IoWarning,
  IoInformationCircle,
  IoClose,
} from 'react-icons/io5';
import { type RootState } from '../../../app/store';
import {
  removeNotification,
  type NotificationType,
} from '../../model/notification-slice';
import { cn } from '../../lib/clsx';

const iconMap: Record<NotificationType, React.ReactNode> = {
  success: <IoCheckmarkCircle className="text-brand-success" size={20} />,
  error: <IoAlertCircle className="text-brand-danger" size={20} />,
  warning: <IoWarning className="text-brand-warning" size={20} />,
  info: <IoInformationCircle className="text-brand-primary" size={20} />,
};

export const Toaster = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(
    (state: RootState) => state.notification.items
  );

  return (
    /**
     * FIXED:
     * - top-24: placed below the header (h-20) with extra gap
     * - right-6: consistent spacing from the edge
     * - items-end: align notifications to the right
     */
    <div className="fixed top-6 right-6 z-50 pointer-events-none flex flex-col items-end gap-3 w-fit max-w-280px">
      <AnimatePresence mode="popLayout">
        {notifications.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{
              opacity: 0,
              x: 20,
              scale: 0.9,
              transition: { duration: 0.15 },
            }}
            className="pointer-events-auto w-full"
          >
            {/* 
              - bg-dark-card/90: less transparent, more readable
              - max-w-[280px]: compact width
            */}
            <div className="panel-glass bg-dark-card/90 border-glass-border p-4 flex items-start gap-3 shadow-2xl relative overflow-hidden group">
              {/* Vertical accent indicator */}
              <div
                className={cn(
                  'absolute left-0 top-0 bottom-0 w-1',
                  item.type === 'success' && 'bg-brand-success',
                  item.type === 'error' && 'bg-brand-danger',
                  item.type === 'warning' && 'bg-brand-warning',
                  item.type === 'info' && 'bg-brand-primary'
                )}
              />

              <div className="shrink-0 pt-0.5">{iconMap[item.type]}</div>

              <div className="grow min-w-0">
                <span className="text-label block mb-0.5 opacity-60 text-[8px] leading-none">
                  {item.type}
                </span>
                <p className="text-[13px] font-bold text-surface-100 leading-tight wrap-break-word">
                  {item.message}
                </p>
              </div>

              <button
                onClick={() => dispatch(removeNotification(item.id))}
                className="shrink-0 text-surface-300 hover:text-white transition-colors"
              >
                <IoClose size={16} />
              </button>

              <AutoRemove id={item.id} duration={item.duration || 5000} />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const AutoRemove = ({ id, duration }: { id: string; duration: number }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const timer = setTimeout(() => dispatch(removeNotification(id)), duration);
    return () => clearTimeout(timer);
  }, [id, duration, dispatch]);
  return null;
};
