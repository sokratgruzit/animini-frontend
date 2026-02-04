import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { GET_EVENTS_URL } from '../../config/constants';
import { QUERY_KEYS, VIDEO_KEYS } from '../../config/query-keys';
import { updateUser, resetUserState } from '../../../entities/user/model/slice';
import { addNotification } from '../../model/notification-slice';
import { type RootState } from '../../../app/store';

/**
 * Global SSE subscriber that bridges Backend events with React Query and Redux.
 * Updated with Interaction (War) logic.
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
          // --- User & Auth Events ---
          case 'USER_UPDATED':
          case 'BALANCE_UPDATED':
            dispatch(updateUser(data));

            if (data.emailVerified === false) {
              dispatch(
                addNotification({
                  type: 'warning',
                  message:
                    'Please verify your email to unlock all platform features.',
                })
              );
            }

            if (type === 'BALANCE_UPDATED') {
              queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.wallet.balance(),
              });
            }
            break;

          case 'TRANSACTION_SUCCESS':
            dispatch(
              addNotification({
                type: 'success',
                message: data.message || 'Transaction successful!',
              })
            );
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
                message: `Video "${data.title}" status: ${data.status.toLowerCase()}`,
              })
            );
            queryClient.invalidateQueries({ queryKey: VIDEO_KEYS.workspace() });
            if (data.seriesId) {
              queryClient.invalidateQueries({
                queryKey: VIDEO_KEYS.details(data.seriesId),
              });
            }
            break;

          case 'VIDEO_CREATED':
            dispatch(
              addNotification({
                type: 'success',
                message: data.message || 'Episode added successfully!',
              })
            );

            queryClient.invalidateQueries({ queryKey: VIDEO_KEYS.workspace() });
            queryClient.invalidateQueries({
              queryKey: QUERY_KEYS.wallet.transactions(),
            });
            queryClient.invalidateQueries({
              queryKey: QUERY_KEYS.wallet.balance(),
            });

            if (data.seriesId) {
              queryClient.invalidateQueries({
                queryKey: VIDEO_KEYS.details(data.seriesId),
              });
            }
            break;

          case 'SERIES_CREATED':
            queryClient.invalidateQueries({ queryKey: VIDEO_KEYS.workspace() });
            break;

          // --- Interaction & War Events (NEW) ---
          case 'NEW_REVIEW_POSTED':
            queryClient.invalidateQueries({
              queryKey: ['interactions', 'reviews', data.videoId],
            });
            break;

          case 'REVIEW_VOTE_UPDATED':
            queryClient.invalidateQueries({
              queryKey: ['interactions', 'reviews', data.videoId],
            });
            break;

          case 'REVIEW_CANCELED':
            dispatch(
              addNotification({
                type: 'info',
                message: 'A review was canceled by social consensus.',
              })
            );
            queryClient.invalidateQueries({
              queryKey: ['interactions', 'reviews', data.videoId],
            });
            break;

          case 'VIDEO_FUNDS_STOLEN':
            dispatch(
              addNotification({
                type: 'error',
                message: `CRITICAL: ${data.criticName} drained ${data.impactAmount} coins from this episode!`,
              })
            );
            // Refresh video progress bar immediately
            queryClient.invalidateQueries({
              queryKey: VIDEO_KEYS.details(data.videoId),
            });
            break;

          case 'AUTHOR_REPUTATION_BOOSTED':
            // If the current user is the author, their balance/rep is updated via BALANCE_UPDATED
            // But we invalidate details to show updated stats to everyone
            queryClient.invalidateQueries({
              queryKey: VIDEO_KEYS.details(data.videoId),
            });
            break;

          // --- Auth Events ---
          case 'USER_LOGOUT':
            dispatch(resetUserState());
            queryClient.clear();
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
