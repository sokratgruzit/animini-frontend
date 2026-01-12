import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { GET_EVENTS_URL } from '../../config/constants';
import { QUERY_KEYS } from '../../config/query-keys';
import { updateUser, resetUserState } from '../../../entities/user/model/slice';
import { addNotification } from '../../model/notification-slice';
import { type RootState } from '../../../app/store';

/**
 * Global SSE subscriber that bridges Backend events with React Query and Redux.
 * Ensures UI updates in real-time without page reloads.
 */
export const useEventSubscriber = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const isAuth = useSelector((state: RootState) => state.user.isAuth);

  useEffect(() => {
    if (!isAuth) return;

    const eventSource = new EventSource(GET_EVENTS_URL, {
      withCredentials: true,
    });

    eventSource.onmessage = (event) => {
      try {
        const { type, data } = JSON.parse(event.data);

        switch (type) {
          // --- Wallet & Balance Events ---
          case 'BALANCE_UPDATED':
            // 1. Update global user object in Redux if needed
            dispatch(updateUser(data));
            // 2. CRITICAL: Invalidate React Query wallet cache
            // This is what makes your balance update instantly!
            queryClient.invalidateQueries({
              queryKey: QUERY_KEYS.wallet.balance(),
            });
            break;

          case 'TRANSACTION_SUCCESS':
            dispatch(
              addNotification({
                type: 'success',
                message: data.message || 'Deposit successful!',
              })
            );
            // Refresh transaction history as well
            queryClient.invalidateQueries({
              queryKey: QUERY_KEYS.wallet.transactions(),
            });
            break;

          case 'TRANSACTION_FAILED':
            dispatch(
              addNotification({
                type: 'error',
                message: data.message || 'Transaction failed',
              })
            );
            break;

          // --- Video & Series Events ---
          case 'VIDEO_STATUS_UPDATED':
            dispatch(
              addNotification({
                type: 'info',
                message: `Video "${data.title}" status: ${data.status}`,
              })
            );
            queryClient.invalidateQueries({
              queryKey: QUERY_KEYS.videos.workspace(),
            });
            if (data.seriesId) {
              queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.videos.details(data.seriesId),
              });
            }
            break;

          case 'SERIES_CREATED':
            queryClient.invalidateQueries({
              queryKey: QUERY_KEYS.videos.workspace(),
            });
            break;

          // --- Auth Events ---
          case 'USER_LOGOUT':
            dispatch(resetUserState());
            queryClient.clear(); // Wipe all cache on logout
            break;

          default:
            console.warn('Unhandled SSE event type:', type);
        }
      } catch (e) {
        console.error('Failed to parse SSE data:', e);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE Connection error:', error);
    };

    return () => {
      eventSource.close();
    };
  }, [isAuth, dispatch, queryClient]);
};
