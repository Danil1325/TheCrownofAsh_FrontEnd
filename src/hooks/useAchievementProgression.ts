import { useCallback, useEffect, useRef, useState } from 'react';
import * as achievementApi from '../api/achievementApi';
import { useNotifications } from './useNotifications';
import type { AchievementsProgressResponse } from '../types/achievements';

export interface AchievementProgressionState {
  /** The player's achievement progress, refetched after every scene advance. */
  progress: AchievementsProgressResponse | null;
  /** True until the first successful refetch. */
  isLoading: boolean;
  /** Refetches achievements from the backend and reports newly unlocked ones. */
  refresh: () => Promise<void>;
}

type FetchResult<T> = { ok: true; data: T } | { ok: false };

async function settle<T>(promise: Promise<T>): Promise<FetchResult<T>> {
  try {
    return { ok: true, data: await promise };
  } catch {
    return { ok: false };
  }
}

/**
 * Loads the player's achievement progress straight from the backend (the source
 * of truth — nothing is computed here). After every `refresh()` call it diffs
 * the new snapshot against the previous one and turns the differences into
 * notification toasts:
 *
 * - achievement became completed  → "Achievement Unlocked"
 *
 * The first refetch only records the baseline — no toasts fire, so resuming a
 * run after a page refresh never replays already-earned unlocks. The endpoint
 * resolves the player server-side (like GET /api/character/current), so no
 * player id is passed in — this mirrors useScenarioProgression's diff model.
 */
export function useAchievementProgression(): AchievementProgressionState {
  const notifications = useNotifications();
  const [progress, setProgress] = useState<AchievementsProgressResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshTokenRef = useRef(0);
  const prevCompletedRef = useRef<Set<number> | null>(null);

  const refresh = useCallback(async () => {
    const token = ++refreshTokenRef.current;

    const result = await settle(achievementApi.getAchievementProgress());

    if (token !== refreshTokenRef.current) {
      return;
    }
    setIsLoading(false);

    if (!result.ok) {
      return;
    }

    setProgress(result.data);

    const completedIds = new Set(
      result.data.achievements
        .filter((achievement) => achievement.isCompleted)
        .map((achievement) => achievement.id),
    );

    const previous = prevCompletedRef.current;
    prevCompletedRef.current = completedIds;

    if (previous === null) {
      return;
    }

    for (const achievement of result.data.achievements) {
      if (achievement.isCompleted && !previous.has(achievement.id)) {
        notifications.achievementUnlocked(achievement.title);
      }
    }
  }, [notifications]);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (!cancelled) {
        void refresh();
      }
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [refresh]);

  // Invalidate any in-flight refetch when the hook unmounts.
  useEffect(() => {
    return () => {
      refreshTokenRef.current += 1;
    };
  }, []);

  return { progress, isLoading, refresh };
}