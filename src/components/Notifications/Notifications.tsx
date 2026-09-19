import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { CheckCircle2, Heart, MapPin, ScrollText, Target, X, XCircle, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { NotificationsContext } from '../../hooks/useNotifications';
import type { GameNotification, NotificationApi, NotificationType } from '../../types/notifications';
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
  'location-unlocked': { title: 'Location Unlocked', icon: MapPin, tone: 'teal', duration: 3600 },
  'loyalty-changed': { title: 'Loyalty Changed', icon: Heart, tone: 'rose', duration: 3000 },
};

interface NotificationToastProps {
  notification: GameNotification;
  onDismiss: (id: number) => void;
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
    const timer = setTimeout(() => onDismiss(notification.id), EXIT_ANIMATION_MS);
    return () => clearTimeout(timer);
  }, [isLeaving, notification.id, onDismiss]);

  const handleDismiss = useCallback(() => setIsLeaving(true), []);

  return (
    <div
      className={`notification notification--${meta.tone}${isLeaving ? ' notification--leaving' : ''}`}
      onClick={handleDismiss}
    >
      <span className="notification-icon" aria-hidden="true">
        <Icon size={18} strokeWidth={2.2} />
      </span>
      <span className="notification-text">
        <strong className="notification-title">{meta.title}</strong>
        <span className="notification-message">{notification.message}</span>
      </span>
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

  const dismiss = useCallback((id: number) => {
    setNotifications((current) => current.filter((notification) => notification.id !== id));
  }, []);

  const push = useCallback((type: NotificationType, message: string) => {
    nextIdRef.current += 1;
    const id = nextIdRef.current;
    setNotifications((current) => {
      const next = [...current, { id, type, message }];
      return next.length > MAX_NOTIFICATIONS ? next.slice(next.length - MAX_NOTIFICATIONS) : next;
    });
  }, []);

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
      locationUnlocked(locationName) {
        push('location-unlocked', locationName);
      },
      companionLoyaltyChanged(companionName, delta) {
        const sign = delta > 0 ? '+' : '';
        push('loyalty-changed', `${companionName} ${sign}${delta} Loyalty`);
      },
    }),
    [push],
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