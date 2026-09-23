// Client for the backend achievement endpoints
// (DnDGame.API.Controllers.AchievementsController). Reuses the cookie-authenticated
// apiFetch from authApi.ts, so every request carries the HttpOnly session cookie.
// GET /api/achievements/current and GET /api/achievements/overview resolve the
// player server-side via ICurrentPlayerService — the client never sends a
// playerId, exactly like GET /api/character/current.

import { apiFetch } from './authApi'
import type {
  AchievementDefinition,
  AchievementsOverviewResponse,
  AchievementsProgressResponse,
} from '../types/achievements'

/** GET /api/achievements — the static catalog, without any player data. */
export function getAchievementCatalog(): Promise<AchievementDefinition[]> {
  return apiFetch<AchievementDefinition[]>('/api/achievements', {
    method: 'GET',
  })
}

/**
 * GET /api/achievements/current — the signed-in player's flat achievement
 * progress merged with the catalog. Rejects with 404 (ApiError) when the
 * player has no character yet.
 */
export function getAchievementProgress(): Promise<AchievementsProgressResponse> {
  return apiFetch<AchievementsProgressResponse>('/api/achievements/current', {
    method: 'GET',
  })
}

/**
 * GET /api/achievements/overview — the signed-in player's achievement progress
 * grouped into locked / inProgress / unlocked buckets. Rejects with 404
 * (ApiError) when the player has no character yet.
 */
export function getAchievementsOverview(): Promise<AchievementsOverviewResponse> {
  return apiFetch<AchievementsOverviewResponse>('/api/achievements/overview', {
    method: 'GET',
  })
}