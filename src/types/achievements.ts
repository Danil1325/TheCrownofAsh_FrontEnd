// Mirrors the backend achievement DTOs
// (DnDGame.BusinessLayer.Dtos.Achievements). JSON is camelCase (ASP.NET Core default).

/** A single achievement as it appears in the catalog (GET /api/achievements). */
export interface AchievementDefinition {
  id: number
  /** Stable machine-readable key, e.g. "A_HERO_IS_BORN". */
  code: string
  title: string
  description: string
  /** Backend AchievementType enum id (semantics defined server-side). */
  type: number
  /** Amount required to complete the achievement. */
  targetAmount: number
}

/** An achievement together with the current player's progress on it. */
export interface PlayerAchievement extends AchievementDefinition {
  /** The player's current progress towards targetAmount. */
  currentAmount: number
  isCompleted: boolean
  /** ISO timestamp of completion, or null while not completed. */
  completedAt: string | null
}

/** Response body for GET /api/achievements/current — flat progress + catalog. */
export interface AchievementsProgressResponse {
  /** The owning player, resolved server-side via ICurrentPlayerService. */
  playerId: number
  totalCount: number
  completedCount: number
  achievements: PlayerAchievement[]
}

/** Response body for GET /api/achievements/overview — progress grouped by state. */
export interface AchievementsOverviewResponse {
  /** The owning player, resolved server-side via ICurrentPlayerService. */
  playerId: number
  totalCount: number
  completedCount: number
  /** Not started yet (no progress towards the target). */
  locked: PlayerAchievement[]
  /** Partially progressed but not yet completed. */
  inProgress: PlayerAchievement[]
  /** Completed. */
  unlocked: PlayerAchievement[]
}