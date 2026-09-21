import { useLayoutEffect, useRef, type CSSProperties } from 'react'

export interface MarketNotification {
  tone: 'success' | 'error'
  text: string
}

interface MarketToastProps {
  // Pass a fresh object for each event, even when the text and tone repeat.
  notification: MarketNotification | null
  onDismiss: (notification: MarketNotification) => void
}

const NOTIFICATION_DURATION_MS = 3000
const notificationStyle = {
  '--notification-duration': `${NOTIFICATION_DURATION_MS}ms`,
} as CSSProperties

export function MarketToast({ notification, onDismiss }: MarketToastProps) {
  const toastRef = useRef<HTMLParagraphElement>(null)

  useLayoutEffect(() => {
    const toast = toastRef.current
    if (!notification || !toast) return

    // Reset the same DOM element before paint, including identical messages.
    toast.style.animation = 'none'
    void toast.offsetWidth
    toast.style.removeProperty('animation')

    const timer = window.setTimeout(() => onDismiss(notification), NOTIFICATION_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [notification, onDismiss])

  // Float beneath the positioned market header without taking up layout space.
  return (
    notification ? (
      <p
        ref={toastRef}
        className={`purchase-message is-${notification.tone}`}
        style={notificationStyle}
        role="status"
        aria-atomic="true"
      >
        {notification.text}
      </p>
    ) : null
  )
}
