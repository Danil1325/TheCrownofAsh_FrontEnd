// Client for the backend location progression endpoints.
// Reuses apiFetch so location calls keep the same cookie-authenticated behavior
// and ApiError handling as the rest of the frontend.

import { apiFetch } from './authApi'
import type {
  LocationDetails,
  LocationEnemy,
  LocationRoute,
  LocationSummary,
  LocationStatus,
  TravelToLocationRequest,
  TravelToLocationResult,
} from '../types/location'

/** GET /api/locations - all stable location catalog entries. */
export function getAllLocations(): Promise<LocationSummary[]> {
  return apiFetch<LocationSummary[]>('/api/locations', {
    method: 'GET',
  })
}

/** GET /api/locations/player/{playerId} - player-specific locations from the backend. */
export function getPlayerLocations(playerId: number): Promise<LocationStatus[]> {
  return apiFetch<LocationStatus[]>(`/api/locations/player/${playerId}`, {
    method: 'GET',
  })
}

/** GET /api/locations/player/{playerId}/route - backend-owned route state. */
export function getPlayerRoute(playerId: number): Promise<LocationRoute[]> {
  return apiFetch<LocationRoute[]>(`/api/locations/player/${playerId}/route`, {
    method: 'GET',
  })
}

/** GET /api/locations/{locationId} - one location's catalog details. */
export function getLocationDetails(locationId: number): Promise<LocationDetails> {
  return apiFetch<LocationDetails>(`/api/locations/${locationId}`, {
    method: 'GET',
  })
}

/** GET /api/locations/{locationId}/enemies?playerId={playerId} - backend-owned encounter data. */
export function getLocationEnemies(
  locationId: number,
  playerId: number,
): Promise<LocationEnemy[]> {
  return apiFetch<LocationEnemy[]>(
    `/api/locations/${locationId}/enemies?playerId=${playerId}`,
    {
      method: 'GET',
    },
  )
}

/** POST /api/locations/travel - asks the backend to move the player to a location. */
export function travelToLocation(
  playerId: number,
  locationId: number,
): Promise<TravelToLocationResult> {
  return apiFetch<TravelToLocationResult>('/api/locations/travel', {
    method: 'POST',
    body: JSON.stringify({ playerId, locationId } satisfies TravelToLocationRequest),
  })
}
