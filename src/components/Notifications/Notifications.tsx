import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { CheckCircle2, Heart, MapPin, ScrollText, Sparkles, Target, Trophy, X, XCircle, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { NotificationsContext } from '../../hooks/useNotifications';
import type {
  GameNotification,
  LocationUnlockedNotificationInput,
  NotificationApi,
  NotificationType,
} from '../../types/notifications';
import './Notifications.css';

const MAX_NOTIFICATIONS = 4;
const EXIT_ANIMATION_MS = 260;

interface NotificationMeta {
  title: string;
  icon: LucideIcon;
  tone: string;
  /** Milliseconds before the toast starts its exit animation. */
  duration: number;
}

const NOTIFICATION_META: Record<NotificationType, NotificationMeta> = {
  'quest-started': { title: 'Quest Started', icon: ScrollText, tone: 'gold', duration: 3400 },
  'objective-updated': { title: 'Objective Updated', icon: Target, tone: 'blue', duration: 3800 },
  'quest-completed': { title: 'Quest Completed', icon: CheckCircle2, tone: 'green', duration: 3600 },
  'quest-failed': { title: 'Quest Failed', icon: XCircle, tone: 'red', duration: 3600 },
  'exp-gained': { title: 'EXP Gained', icon: Zap, tone: 'gold', duration: 2600 },
  'level-up': { title: 'Level Up!', icon: Sparkles, tone: 'purple', duration: 3800 },
  'location-unlocked': { title: 'New Location Unlocked', icon: MapPin, tone: 'teal', duration: 6200 },
  'loyalty-changed': { title: 'Loyalty Changed', icon: Heart, tone: 'rose', duration: 3000 },
  'achievement-unlocked': { title: 'Achievement Unlocked', icon: Trophy, tone: 'purple', duration: 4200 },
};

type NotificationDraft = Omit<GameNotification, 'id'>;

function capVisibleNotifications(notifications: GameNotification[]): GameNotification[] {
  let ordinaryToDrop =
    notifications.filter((notification) => notification.type !== 'location-unlocked').length -
    MAX_NOTIFICATIONS;

  if (ordinaryToDrop <= 0) {
    return notifications;
  }

  return notifications.filter((notification) => {
    if (notification.type === 'location-unlocked') {
      return true;
    }

    if (ordinaryToDrop > 0) {
      ordinaryToDrop -= 1;
      return false;
    }

    return true;
  });
}

function normalizeLocationNotification(
  location: string | LocationUnlockedNotificationInput,
): NotificationDraft {
  if (typeof location === 'string') {
    return {
      type: 'location-unlocked',
      message: location,
      locationName: location,
    };
  }

  const action =
    location.action ??
    (location.onViewMap
      ? { label: 'View on Map', onClick: location.onViewMap }
      : undefined);

  return {
    type: 'location-unlocked',
    message: location.locationName,
    locationName: location.locationName,
    thumbnail: location.thumbnail,
    recommendedLevel: location.recommendedLevel,
    action,
  };
}

interface NotificationToastProps {
  notification: GameNotification;
  onDismiss: (notification: GameNotification) => void;
}

/** One auto-dismissing toast; plays an exit animation before being removed. */
function NotificationToast({ notification, onDismiss }: NotificationToastProps) {
  const meta = NOTIFICATION_META[notification.type];
  const Icon = meta.icon;
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLeaving(true), meta.duration);
    return () => clearTimeout(timer);
  }, [meta.duration]);

  useEffect(() => {
    if (!isLeaving) return;
    const timer = setTimeout(() => onDismiss(notification), EXIT_ANIMATION_MS);
    return () => clearTimeout(timer);
  }, [isLeaving, notification, onDismiss]);

  const handleDismiss = useCallback(() => setIsLeaving(true), []);
  const isLocationUnlocked = notification.type === 'location-unlocked';
  const locationName = notification.locationName ?? notification.message;

  const handleAction = useCallback(() => {
    notification.action?.onClick();
    setIsLeaving(true);
  }, [notification.action]);

  return (
    <div
      className={`notification notification--${meta.tone}${isLocationUnlocked ? ' notification--location' : ''}${isLeaving ? ' notification--leaving' : ''}`}
      onClick={isLocationUnlocked ? undefined : handleDismiss}
    >
      {isLocationUnlocked ? (
        <>
          {notification.thumbnail ? (
            <img className="notification-location-thumbnail" src={notification.thumbnail} alt="" />
          ) : (
            <span className="notification-icon notification-location-fallback" aria-hidden="true">
              <Icon size={18} strokeWidth={2.2} />
            </span>
          )}
          <span className="notification-location-content">
            <strong className="notification-title">{meta.title}</strong>
            <span className="notification-location-name">{locationName}</span>
            {notification.recommendedLevel != null && (
              <span className="notification-location-level">
                Recommended level: {notification.recommendedLevel}
              </span>
            )}
            {notification.action && (
              <button
                type="button"
                className="notification-action"
                onClick={handleAction}
              >
                {notification.action.label}
              </button>
            )}
          </span>
        </>
      ) : (
        <>
          <span className="notification-icon" aria-hidden="true">
            <Icon size={18} strokeWidth={2.2} />
          </span>
          <span className="notification-text">
            <strong className="notification-title">{meta.title}</strong>
            <span className="notification-message">{notification.message}</span>
          </span>
        </>
      )}
      <button
        type="button"
        className="notification-dismiss"
        aria-label="Dismiss notification"
        onClick={handleDismiss}
      >
        <X size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
}

interface NotificationsProviderProps {
  children: ReactNode;
}

/**
 * Provides the notification feed. Toasts render top-right, clear of the
 * centered DialogueBox/ChoiceBox, auto-dismiss after a short duration and cap
 * the visible stack so they never pile up over the scene UI.
 */
function NotificationsProvider({ children }: NotificationsProviderProps) {
  const [notifications, setNotifications] = useState<GameNotification[]>([]);
  const nextIdRef = useRef(0);
  const locationQueueRef = useRef<GameNotification[]>([]);
  const isLocationVisibleRef = useRef(false);

  const createNotification = useCallback((notification: NotificationDraft): GameNotification => {
    nextIdRef.current += 1;
    return { id: nextIdRef.current, ...notification };
  }, []);

  const push = useCallback((type: NotificationType, message: string) => {
    const notification = createNotification({ type, message });
    setNotifications((current) => {
      return capVisibleNotifications([...current, notification]);
    });
  }, [createNotification]);

  const showNextLocationUnlock = useCallback(() => {
    if (isLocationVisibleRef.current || locationQueueRef.current.length === 0) {
      return;
    }

    const [nextLocation, ...remaining] = locationQueueRef.current;
    if (!nextLocation) {
      return;
    }

    locationQueueRef.current = remaining;
    isLocationVisibleRef.current = true;
    setNotifications((current) => capVisibleNotifications([...current, nextLocation]));
  }, []);

  const queueLocationUnlock = useCallback(
    (location: string | LocationUnlockedNotificationInput) => {
      const notification = createNotification(normalizeLocationNotification(location));
      locationQueueRef.current = [...locationQueueRef.current, notification];
      showNextLocationUnlock();
    },
    [createNotification, showNextLocationUnlock],
  );

  const dismiss = useCallback(
    (notificationToDismiss: GameNotification) => {
      setNotifications((current) =>
        current.filter((notification) => notification.id !== notificationToDismiss.id),
      );

      if (notificationToDismiss.type === 'location-unlocked') {
        isLocationVisibleRef.current = false;
        showNextLocationUnlock();
      }
    },
    [showNextLocationUnlock],
  );

  const api = useMemo<NotificationApi>(
    () => ({
      questStarted(questName) {
        push('quest-started', questName);
      },
      objectiveUpdated(description) {
        push('objective-updated', description);
      },
      questCompleted(exp) {
        push('quest-completed', exp != null ? `+${exp} EXP` : 'Quest complete!');
      },
      questFailed(questName) {
        push('quest-failed', questName);
      },
      expGained(amount) {
        push('exp-gained', `+${amount} EXP`);
      },
      levelUp(newLevel) {
        push('level-up', `Reached level ${newLevel}`);
      },
      locationUnlocked(location) {
        queueLocationUnlock(location);
      },
      companionLoyaltyChanged(companionName, delta) {
        const sign = delta > 0 ? '+' : '';
        push('loyalty-changed', `${companionName} ${sign}${delta} Loyalty`);
      },
      achievementUnlocked(achievementTitle) {
        push('achievement-unlocked', achievementTitle);
      },
    }),
    [push, queueLocationUnlock],
  );

  return (
    <NotificationsContext.Provider value={api}>
      {children}
      <div className="notification-feed" aria-live="polite" aria-atomic="false">
        {notifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onDismiss={dismiss}
          />
        ))}
      </div>
    </NotificationsContext.Provider>
  );
}

export default NotificationsProvider;
