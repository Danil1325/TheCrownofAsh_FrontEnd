// Client for the backend character-creation endpoint
// (DnDGame.API.Controllers.CharacterController). Reuses the cookie-authenticated
// apiFetch from authApi.ts, so every request carries the session cookie.
// The endpoint has no [Authorize] and resolves the owning player server-side
// (ICurrentPlayerService.GetCurrentPlayerId()) — the client never sends a playerId.

import { apiFetch } from './authApi'
import type {
  CharacterResponseDto,
  NewGameCharacterRequest,
  NewGameCharacterResponse,
} from '../types/character'

/**
 * POST /api/character/new-game — creates the player's character.
 * Rejects with 409 Conflict when the player already has a character.
 */
export function createCharacter(
  request: NewGameCharacterRequest,
): Promise<NewGameCharacterResponse> {
  return apiFetch<NewGameCharacterResponse>('/api/character/new-game', {
    method: 'POST',
    body: JSON.stringify(request),
  })
}

/**
 * GET /api/character/current — the signed-in player's active character.
 * Rejects with 404 (ApiError) when the player has not created a character yet.
 */
export function getCurrentCharacter(): Promise<CharacterResponseDto> {
  return apiFetch<CharacterResponseDto>('/api/character/current')
}