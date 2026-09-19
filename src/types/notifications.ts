/** Kinds of transient in-game notifications shown in the toast feed. */
export type NotificationType =
  | 'quest-started'
  | 'objective-updated'
  | 'quest-completed'
  | 'quest-failed'
  | 'exp-gained'
  | 'level-up'
  | 'location-unlocked'
  | 'loyalty-changed';

/** One transient toast in the game notification feed. */
export interface GameNotification {
  id: number;
  type: NotificationType;
  /** The short body text (quest name, objective, "+180 EXP", ...). */
  message: string;
}

/**
 * Imperative notification API exposed through `useNotifications()`.
 * Each call fires a short, auto-dismissing toast.
 */
export interface NotificationApi {
  /** "Quest Started — <questName>" */
  questStarted(questName: string): void;
  /** "Objective Updated — <description>" */
  objectiveUpdated(description: string): void;
  /** "Quest Completed — +<exp> EXP" (generic message when `exp` is omitted). */
  questCompleted(exp?: number): void;
  /** "Quest Failed — <questName>" */
  questFailed(questName: string): void;
  /** "EXP Gained — +<amount> EXP" */
  expGained(amount: number): void;
  /** "Level Up — Reached level <newLevel>" */
  levelUp(newLevel: number): void;
  /** "Location Unlocked — <locationName>" */
  locationUnlocked(locationName: string): void;
  /** "Loyalty Changed — <companionName> +<delta> Loyalty" */
  companionLoyaltyChanged(companionName: string, delta: number): void;
}