import type { StoryScene } from './scenario';

// Mirrors the backend location progression API. JSON is camelCase.

export interface LocationSummary {
  id: number;
  slug: string;
  name: string;
  recommendedMinimumLevel: number;
  backgroundImage: string;
  isSafeLocation: boolean;
}

export interface LocationDetails {
  id: number;
  slug: string;
  name: string;
  description: string;
  recommendedMinimumLevel: number;
  backgroundImage: string;
  isSafeLocation: boolean;
}

/** Player-specific location state. The frontend displays status but does not calculate it. */
export interface LocationStatus {
  locationId: number;
  locationName: string;
  status: string;
  recommendedLevel: number;
  isCurrent: boolean;
  isCompleted: boolean;
}

export interface LocationRoute {
  order: number;
  locationId: number;
  locationName: string;
  status: string;
  recommendedLevel: number;
  isCurrent: boolean;
  isCompleted: boolean;
}

export interface LocationEnemy {
  id: number;
  name: string;
}

export interface TravelToLocationRequest {
  playerId: number;
  locationId: number;
}

export interface TravelToLocationResult {
  currentLocation: LocationDetails;
  currentScene: StoryScene;
}
