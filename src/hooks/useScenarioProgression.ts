import { useCallback, useEffect, useRef, useState } from 'react';
import * as scenarioApi from '../api/scenarioApi';
import { useNotifications } from './useNotifications';
import { QuestStatus } from '../types/scenario';
import type { LevelProgress, PlayerQuest } from '../types/scenario';

export interface ScenarioProgressionState {
  /** The player's level/experience state, refetched after every scene advance. */
  progression: LevelProgress | null;
  /** Quests currently in progress, refetched after every scene advance. */
  activeQuests: PlayerQuest[] | null;
  /** True until the first successful refetch. */
  isLoading: boolean;
  /** Refetches progression/quests from the backend and reports the deltas. */
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
 * Loads the player's progression and quest state straight from the backend
 * (the source of truth — nothing is computed here). After every `refresh()`
 * call it diffs the new snapshot against the previous one and turns the
 * differences into notification toasts:
 *
 * - level increased          → "Level Up"
 * - current experience rose  → "EXP Gained" (with the exact delta)
 * - quest became active      → "Quest Started"
 * - quest completed          → "Quest Completed"
 * - objective advanced       → "Objective Updated"
 *
 * The first refetch only records the baseline — no toasts fire, so resuming a
 * run after a page refresh never replays already-earned rewards.
 */
export function useScenarioProgression(playerId: number): ScenarioProgressionState {
  const notifications = useNotifications();
  const [progression, setProgression] = useState<LevelProgress | null>(null);
  const [activeQuests, setActiveQuests] = useState<PlayerQuest[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshTokenRef = useRef(0);
  const prevProgressionRef = useRef<LevelProgress | null>(null);
  const prevActiveRef = useRef<PlayerQuest[] | null>(null);
  const prevCompletedRef = useRef<PlayerQuest[] | null>(null);

  const refresh = useCallback(async () => {
    const token = ++refreshTokenRef.current;

    const [progressionResult, activeResult, completedResult] = await Promise.all([
      settle(scenarioApi.getPlayerProgression(playerId)),
      settle(scenarioApi.getActiveQuests(playerId)),
      settle(scenarioApi.getCompletedQuests(playerId)),
    ]);

    if (token !== refreshTokenRef.current) {
      return;
    }
    setIsLoading(false);

    if (progressionResult.ok) {
      const previous = prevProgressionRef.current;
      setProgression(progressionResult.data);
      prevProgressionRef.current = progressionResult.data;

      if (previous) {
        if (progressionResult.data.level > previous.level) {
          notifications.levelUp(progressionResult.data.level);
        }
        const experienceDelta =
          progressionResult.data.currentExperience - previous.currentExperience;
        if (experienceDelta > 0) {
          notifications.expGained(experienceDelta);
        }
      }
    }

    if (activeResult.ok) {
      setActiveQuests(activeResult.data);
    }

    // Quest toasts need both lists to be coherent; without them only track state.
    if (!activeResult.ok || !completedResult.ok) {
      if (activeResult.ok) {
        prevActiveRef.current = activeResult.data;
      }
      if (completedResult.ok) {
        prevCompletedRef.current = completedResult.data;
      }
      return;
    }

    const active = activeResult.data;
    const completed = completedResult.data;
    const prevActive = prevActiveRef.current;
    const prevCompleted = prevCompletedRef.current;
    prevActiveRef.current = active;
    prevCompletedRef.current = completed;

    if (!prevActive && !prevCompleted) {
      return;
    }

    const prevActiveById = new Map((prevActive ?? []).map((quest) => [quest.questId, quest]));
    const prevCompletedIds = new Set((prevCompleted ?? []).map((quest) => quest.questId));

    for (const quest of active) {
      const wasActive = prevActiveById.has(quest.questId);
      const wasCompleted = prevCompletedIds.has(quest.questId);
      if (quest.status === QuestStatus.Active && !wasActive && !wasCompleted) {
        notifications.questStarted(quest.title);
      }
    }

    for (const quest of completed) {
      const isNewlyCompleted =
        !prevCompletedIds.has(quest.questId) && prevActiveById.has(quest.questId);
      if (quest.status === QuestStatus.Completed && isNewlyCompleted) {
        notifications.questCompleted();
      }
    }

    for (const quest of active) {
      if (quest.status !== QuestStatus.Active) {
        continue;
      }
      const previousQuest = prevActiveById.get(quest.questId);
      if (!previousQuest) {
        continue;
      }
      if (quest.currentObjectiveIndex > previousQuest.currentObjectiveIndex) {
        notifications.objectiveUpdated(
          quest.currentObjectiveDescription ?? `Objective ${quest.currentObjectiveIndex + 1}`,
        );
        continue;
      }
      const previousProgress =
        previousQuest.objectiveProgress[previousQuest.currentObjectiveIndex] ?? 0;
      const currentProgress = quest.objectiveProgress[quest.currentObjectiveIndex] ?? 0;
      if (currentProgress > previousProgress && quest.currentObjectiveDescription != null) {
        notifications.objectiveUpdated(quest.currentObjectiveDescription);
      }
    }
  }, [playerId, notifications]);

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

  return { progression, activeQuests, isLoading, refresh };
}