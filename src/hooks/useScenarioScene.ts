import { useCallback, useMemo, useRef, useState } from 'react';
import { ApiError } from '../api/authApi';
import { getLocationDetails } from '../api/locationApi';
import * as scenarioApi from '../api/scenarioApi';
import { useNotifications } from './useNotifications';
import type { ScenarioProgress, StoryChoice, StoryScene } from '../types/scenario';

export interface UseScenarioSceneOptions {
  /** The scene currently displayed — controlled by the parent. */
  scene: StoryScene | null;
  /** The player whose scenario run is advancing. */
  playerId: number;
  /** Receives the freshly loaded next scene after a successful choice. */
  onSceneChange: (scene: StoryScene) => void;
  /** Called with the run's progress when a choice finishes the scenario (`nextSceneId === null`). */
  onScenarioEnd?: (progress: ScenarioProgress) => void;
  /** Opens the gameplay map from rich location-unlocked notifications when available. */
  onViewMap?: () => void;
}

/** What a retry still has to redo after a failure. */
interface SceneChoiceAttempt {
  /** The scene the attempt belonged to, so a retry never replays a stale one. */
  sceneId: number;
  choice: StoryChoice;
  /** `fetchScene` means the choice was already accepted by the server. */
  phase: 'submit' | 'fetchScene';
}

/**
 * Drives the dialogue reader and choice flow of one story scene.
 *
 * The parent owns the current scene and passes it in; when a choice is made
 * this hook posts it, loads the following scene via the API and hands it back
 * through `onSceneChange`. When `scene.id` changes the dialogue reader resets
 * to the first line.
 */
export function useScenarioScene({
  scene,
  playerId,
  onSceneChange,
  onScenarioEnd,
  onViewMap,
}: UseScenarioSceneOptions) {
  const notifications = useNotifications();
  const dialogues = useMemo(
    () => (scene ? [...scene.dialogues].sort((a, b) => a.order - b.order) : []),
    [scene],
  );

  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  // Covers the whole transition between scenes: the choice POST plus loading
  // the next scene. Exposed to the parent both as `isSubmittingChoice` and as
  // `isLoading`, since both describe the same in-flight window.
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Synchronous guard: an extra click in the same batch cannot start a second
  // request while one choice submission is still in flight.
  const activeRequestRef = useRef(false);
  // Kept on failure so `retry` can replay the attempt without re-submitting a
  // choice the server already accepted.
  const lastAttemptRef = useRef<SceneChoiceAttempt | null>(null);

  // A changed scene means the run moved to the next scene — reset the dialogue
  // reader and any leftover failure state. Adjusted during render (React's
  // official "adjust state when a prop changes" pattern) keyed on `scene.id`.
  // The request refs are intentionally left untouched: an in-flight submission
  // keeps owning `activeRequestRef` until it settles, and `lastAttemptRef`
  // carries the `sceneId` it belongs to.
  const [previousSceneId, setPreviousSceneId] = useState(scene?.id);
  if (previousSceneId !== scene?.id) {
    setPreviousSceneId(scene?.id);
    setCurrentDialogueIndex(0);
    setError(null);
    setIsTransitioning(false);
  }

  const allDialoguesRead = dialogues.length === 0 || currentDialogueIndex >= dialogues.length;
  const currentDialogue =
    scene != null && !allDialoguesRead ? (dialogues[currentDialogueIndex] ?? null) : null;
  const hasNextDialogue = currentDialogueIndex < dialogues.length - 1;

  // Choices appear only after the last dialogue line has been consumed.
  const showChoices =
    scene !== null &&
    allDialoguesRead &&
    !isTransitioning &&
    error === null &&
    scene.choices.length > 0;

  const notifyUnlockedLocations = useCallback(
    async (locationIds: number[] | undefined) => {
      if (!locationIds || locationIds.length === 0) {
        return;
      }

      const locationResults = await Promise.allSettled(
        locationIds.map((locationId) => getLocationDetails(locationId)),
      );

      locationResults.forEach((result) => {
        if (result.status !== 'fulfilled') {
          return;
        }

        const details = result.value;
        notifications.locationUnlocked({
          locationName: details.name,
          thumbnail: details.backgroundImage,
          recommendedLevel: details.recommendedMinimumLevel,
          onViewMap,
        });
      });
    },
    [notifications, onViewMap],
  );

  const performChoice = useCallback(
    async (choice: StoryChoice, phase: SceneChoiceAttempt['phase']) => {
      if (activeRequestRef.current || !scene) return;

      setError(null);
      setIsTransitioning(true);
      activeRequestRef.current = true;
      lastAttemptRef.current = { sceneId: scene.id, choice, phase };

      try {
        if (phase === 'submit') {
          const progress = await scenarioApi.selectChoice(playerId, scene.id, choice.id);
          void notifyUnlockedLocations(progress.newLocationIds);
          lastAttemptRef.current = { choice, phase: 'fetchScene', sceneId: scene.id };
          if (choice.nextSceneId === null) {
            lastAttemptRef.current = null;
            onScenarioEnd?.(progress);
            return;
          }
        }

        const nextScene = await scenarioApi.getCurrentScene(playerId);
        lastAttemptRef.current = null;
        onSceneChange(nextScene);
      } catch (err) {
        setError(
          err instanceof ApiError
            ? err.message
            : 'Unable to submit the choice. Please try again.',
        );
      } finally {
        activeRequestRef.current = false;
        setIsTransitioning(false);
      }
    },
    [playerId, scene, onSceneChange, onScenarioEnd, notifyUnlockedLocations],
  );

  const selectChoice = useCallback(
    (choice: StoryChoice) => {
      void performChoice(choice, 'submit');
    },
    [performChoice],
  );

  const retry = useCallback(() => {
    const attempt = lastAttemptRef.current;
    if (attempt && attempt.sceneId === scene?.id) {
      void performChoice(attempt.choice, attempt.phase);
    }
  }, [performChoice, scene]);

  const nextDialogue = useCallback(() => {
    setCurrentDialogueIndex((index) => (index < dialogues.length ? index + 1 : index));
  }, [dialogues.length]);

  return {
    currentDialogueIndex,
    currentDialogue,
    hasNextDialogue,
    showChoices,
    nextDialogue,
    selectChoice,
    isSubmittingChoice: isTransitioning,
    isLoading: isTransitioning,
    error,
    retry,
  };
}
