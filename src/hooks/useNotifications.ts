import { createContext, useContext } from 'react';
import type { NotificationApi } from '../types/notifications';

/** Provided by `<NotificationsProvider>`; null when used outside of it. */
export const NotificationsContext = createContext<NotificationApi | null>(null);

/** Returns the notification dispatcher or throws outside of a provider. */
export function useNotifications(): NotificationApi {
  const api = useContext(NotificationsContext);
  if (!api) {
    throw new Error('useNotifications must be used inside a <NotificationsProvider>.');
  }
  return api;
}