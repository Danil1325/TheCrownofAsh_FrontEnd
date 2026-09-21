// Client for the backend scenario/quest/progression endpoints
// (DnDGame.API.Controllers.{ScenarioController,QuestController,ProgressionController}).
// Reuses the cookie-authenticated apiFetch from authApi.ts, so every request
// carries the HttpOnly session cookie via `credentials: 'include'`.

import { apiFetch } from './authApi'
import type {
  LevelProgress,
  PlayerQuest,
  QuestSummary,
  ScenarioProgress,
  StoryScene,
} from '../types/scenario'

export interface SelectChoiceRequest {
  playerId: number
  sceneId: number
  choiceId: number
}

/** POST /api/scenario/start/{playerId} — starts the scenario run for a player. */
export function startScenario(playerId: number): Promise<ScenarioProgress> {
  return apiFetch<ScenarioProgress>(`/api/scenario/start/${playerId}`, {
    method: 'POST',
  })
}

/** GET /api/scenario/current/{playerId} — the player's current story scene. */
export function getCurrentScene(playerId: number): Promise<StoryScene> {
  return apiFetch<StoryScene>(`/api/scenario/current/${playerId}`, {
    method: 'GET',
  })
}

/** POST /api/scenario/choice — selects a choice and advances the scenario. */
export function selectChoice(
  playerId: number,
  sceneId: number,
  choiceId: number,
): Promise<ScenarioProgress> {
  return apiFetch<ScenarioProgress>('/api/scenario/choice', {
    method: 'POST',
    body: JSON.stringify({ playerId, sceneId, choiceId } satisfies SelectChoiceRequest),
  })
}

/** GET /api/quests/{playerId}/available — quests the player may start. */
export function getAvailableQuests(playerId: number): Promise<QuestSummary[]> {
  return apiFetch<QuestSummary[]>(`/api/quests/${playerId}/available`, {
    method: 'GET',
  })
}

/** GET /api/quests/{playerId}/active — quests currently in progress. */
export function getActiveQuests(playerId: number): Promise<PlayerQuest[]> {
  return apiFetch<PlayerQuest[]>(`/api/quests/${playerId}/active`, {
    method: 'GET',
  })
}

/** GET /api/quests/{playerId}/completed — quests the player has finished. */
export function getCompletedQuests(playerId: number): Promise<PlayerQuest[]> {
  return apiFetch<PlayerQuest[]>(`/api/quests/${playerId}/completed`, {
    method: 'GET',
  })
}

/** POST /api/quests/{playerId}/{questId}/start — starts a quest for the player. */
export function startQuest(playerId: number, questId: number): Promise<PlayerQuest> {
  return apiFetch<PlayerQuest>(`/api/quests/${playerId}/${questId}/start`, {
    method: 'POST',
  })
}

/** GET /api/progression/{playerId} — the player's level and experience state. */
export function getPlayerProgression(playerId: number): Promise<LevelProgress> {
  return apiFetch<LevelProgress>(`/api/progression/${playerId}`, {
    method: 'GET',
  })
}