import { useCallback, useEffect, useRef, useState } from 'react';
import { BookOpen, Crown, Home, Loader2, RotateCcw, ScrollText, TrendingUp } from 'lucide-react';
import * as scenarioApi from '../../api/scenarioApi';
import { ApiError } from '../../api/authApi';
import type { ScenarioProgress, StoryChoice, StoryScene } from '../../types/scenario';
import ScenarioBackground from '../../components/ScenarioBackground/ScenarioBackground';
import DialogueBox from '../../components/DialogueBox/DialogueBox';
import ChoiceBox from '../../components/ChoiceBox/ChoiceBox';
import QuestJournal from '../../components/QuestJournal/QuestJournal';
import { useScenarioScene } from '../../hooks/useScenarioScene';
import { useScenarioProgression } from '../../hooks/useScenarioProgression';
import './ScenarioPage.css';

interface ScenarioPageProps {
  /** The player whose scenario run is being played. Passed down to every API call. */
  playerId: number;
  /** Optional scene already returned by another backend flow, such as location travel. */
  initialScene?: StoryScene | null;
  /** One-shot scene returned by map travel while this page is already mounted. */
  travelScene?: StoryScene | null;
  travelSceneId?: number | null;
  /** Lets the parent clear one-shot initial scene state after this page takes ownership. */
  onInitialSceneConsumed?: () => void;
  /** Lets the parent clear one-shot travel scene state after this page applies it. */
  onTravelSceneConsumed?: () => void;
  onBackToMenu: () => void;
  onViewMap?: () => void;
}

/**
 * Scenario page wired to the backend scenario API.
 *
 * Flow (the backend stays the source of truth end to end — this page only
 * renders what the API returns and posts choices back):
 *
 *  1. On mount it loads the run with GET /api/scenario/current/{playerId}, so a
 *     run that was already in progress resumes naturally after a page refresh.
 *     When no run exists yet (404) it starts one via
 *     POST /api/scenario/start/{playerId} first.
 *  2. The scene's location drives the cross-fading ScenarioBackground and its
 *     dialogues/choices drive the DialogueBox/ChoiceBox (one line at a time,
 *     choices only after the last line).
 *  3. Choosing posts POST /api/scenario/choice, then the following scene is
 *     loaded from the backend and the flow restarts for it.
 *  4. After every scene advance the progression/quest endpoints are re-read and
 *     their differences (EXP gained, level-ups, quest/objective updates) are
 *     surfaced as notifications — the numbers come from the backend, never a
 *     frontend calculation.
 *  5. The scenario-end overlay uses the progress returned by the choice POST.
 */
function ScenarioPage({
  playerId,
  initialScene = null,
  travelScene = null,
  travelSceneId = null,
  onInitialSceneConsumed,
  onTravelSceneConsumed,
  onBackToMenu,
  onViewMap,
}: ScenarioPageProps) {
  const hasInitialScene = initialScene != null;
  const [scene, setScene] = useState<StoryScene | null>(() => initialScene);
  const [isInitialLoading, setIsInitialLoading] = useState(!hasInitialScene);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isBackgroundTransitioning, setIsBackgroundTransitioning] = useState(false);
  const [isScenarioEnded, setIsScenarioEnded] = useState(false);
  const [endProgress, setEndProgress] = useState<ScenarioProgress | null>(null);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [selectedChoiceId, setSelectedChoiceId] = useState<number | null>(null);

  const { progression, refresh: refreshProgression } = useScenarioProgression(playerId);

  const loadTaskRef = useRef(0);
  const usedInitialSceneRef = useRef(hasInitialScene);
  const appliedTravelSceneIdRef = useRef<number | null>(null);

  const loadCurrentScene = useCallback(async () => {
    const task = ++loadTaskRef.current;
    setIsInitialLoading(true);
    setLoadError(null);
    try {
      let loadedScene: StoryScene;
      try {
        loadedScene = await scenarioApi.getCurrentScene(playerId);
      } catch (initialError) {
        // No run in progress yet — start one. The backend decides the first scene.
        if (!(initialError instanceof ApiError) || initialError.status !== 404) {
          throw initialError;
        }
        await scenarioApi.startScenario(playerId);
        loadedScene = await scenarioApi.getCurrentScene(playerId);
      }
      if (task !== loadTaskRef.current) {
        return;
      }
      setScene(loadedScene);
      setSelectedChoiceId(null);
      setIsScenarioEnded(false);
      setEndProgress(null);
    } catch (err) {
      if (task !== loadTaskRef.current) {
        return;
      }
      setLoadError(
        err instanceof ApiError ? err.message : 'Unable to load the story. Please try again.',
      );
    } finally {
      if (task === loadTaskRef.current) {
        setIsInitialLoading(false);
      }
    }
  }, [playerId]);

  useEffect(() => {
    if (usedInitialSceneRef.current) {
      onInitialSceneConsumed?.();
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (!cancelled) {
        void loadCurrentScene();
      }
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [loadCurrentScene, onInitialSceneConsumed]);

  useEffect(() => {
    if (!travelScene || travelSceneId == null) {
      return;
    }

    if (appliedTravelSceneIdRef.current === travelSceneId) {
      return;
    }

    let isCancelled = false;
    const nextScene = travelScene;
    const nextTravelSceneId = travelSceneId;

    queueMicrotask(() => {
      if (isCancelled || appliedTravelSceneIdRef.current === nextTravelSceneId) {
        return;
      }

      appliedTravelSceneIdRef.current = nextTravelSceneId;
      setScene(nextScene);
      setSelectedChoiceId(null);
      setIsInitialLoading(false);
      setLoadError(null);
      setIsScenarioEnded(false);
      setEndProgress(null);
      onTravelSceneConsumed?.();
    });

    return () => {
      isCancelled = true;
    };
  }, [travelScene, travelSceneId, onTravelSceneConsumed]);

  const handleSceneChange = useCallback(
    (nextScene: StoryScene) => {
      setScene(nextScene);
      setSelectedChoiceId(null);
      void refreshProgression();
    },
    [refreshProgression],
  );

  const handleScenarioEnd = useCallback(
    (progress: ScenarioProgress) => {
      setEndProgress(progress);
      setIsScenarioEnded(true);
      void refreshProgression();
    },
    [refreshProgression],
  );

  const {
    currentDialogue,
    hasNextDialogue,
    nextDialogue,
    showChoices,
    selectChoice,
    isSubmittingChoice,
    error: choiceError,
    retry: retryChoice,
  } = useScenarioScene({
    scene,
    playerId,
    onSceneChange: handleSceneChange,
    onScenarioEnd: handleScenarioEnd,
    onViewMap,
  });

  const handleChoice = useCallback(
    (choice: StoryChoice) => {
      setSelectedChoiceId(choice.id);
      selectChoice(choice);
    },
    [selectChoice],
  );

  const hideNarrative =
    isInitialLoading || isBackgroundTransitioning || isSubmittingChoice || scene === null;

  const loyaltyTotal = endProgress
    ? Object.values(endProgress.companionLoyalty).reduce((sum, value) => sum + value, 0)
    : 0;
  const questCount = endProgress ? Object.keys(endProgress.questProgress).length : 0;

  return (
    <main className="scenario-page">
      <ScenarioBackground
        locationId={scene?.locationId ?? null}
        backgroundImage={scene?.backgroundImage ?? null}
        onTransitionChange={setIsBackgroundTransitioning}
        className="scenario-page-background"
      />

      <header className="scenario-hud">
        <div className="scenario-hud-left">
          {progression != null && (
            <div className="scenario-hud-progression">
              <span className="scenario-hud-level">
                Level <b>{progression.level}</b>
              </span>
              <div
                className="exp-bar"
                role="progressbar"
                aria-label="Experience progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progression.experienceProgressPercentage)}
              >
                <div
                  className="exp-bar-fill"
                  style={{ width: `${progression.experienceProgressPercentage}%` }}
                />
              </div>
              <span className="exp-bar-text">
                {progression.currentExperience}
                {progression.experienceForNextLevel != null && (
                  <> / {progression.experienceForNextLevel} EXP</>
                )}
              </span>
              {progression.availableSkillPoints > 0 && (
                <span className="exp-bar-skill-points">
                  <TrendingUp size={13} aria-hidden="true" /> +{progression.availableSkillPoints} SP
                </span>
              )}
            </div>
          )}
        </div>

        <nav className="scenario-hud-right" aria-label="Scenario options">
          <button
            type="button"
            className="scenario-hud-button"
            onClick={() => setIsJournalOpen(true)}
          >
            <BookOpen size={18} strokeWidth={2.2} aria-hidden="true" />
            <span>Quest Journal</span>
          </button>
          <button type="button" className="scenario-hud-button" onClick={onBackToMenu}>
            <Home size={18} strokeWidth={2.2} aria-hidden="true" />
            <span>Menu</span>
          </button>
        </nav>
      </header>

      {isInitialLoading && (
        <section className="scenario-status" role="status">
          <Loader2 className="scenario-status-spinner" size={26} aria-hidden="true" />
          <p className="scenario-status-text">Preparing your adventure…</p>
        </section>
      )}

      {!isInitialLoading && loadError != null && (
        <section className="scenario-status scenario-status--error" role="alert">
          <p className="scenario-status-text">{loadError}</p>
          <div className="scenario-status-actions">
            <button type="button" className="scenario-action-button" onClick={loadCurrentScene}>
              <RotateCcw size={16} strokeWidth={2.2} aria-hidden="true" />
              <span>Try again</span>
            </button>
            <button type="button" className="scenario-action-button" onClick={onBackToMenu}>
              <Home size={16} strokeWidth={2.2} aria-hidden="true" />
              <span>Back to menu</span>
            </button>
          </div>
        </section>
      )}

      {!hideNarrative && currentDialogue != null && (
        <section className="scenario-narrative" aria-live="polite">
          <DialogueBox
            key={currentDialogue.id}
            speaker={currentDialogue.speaker}
            text={currentDialogue.text}
            dialogueType={currentDialogue.type}
            onNext={nextDialogue}
            isLastDialogue={!hasNextDialogue}
          />
        </section>
      )}

      {!hideNarrative && showChoices && scene != null && (
        <section className="scenario-narrative" aria-label="Choices">
          <ChoiceBox
            choices={scene.choices}
            selectedChoiceId={selectedChoiceId}
            disabled={isSubmittingChoice}
            onSelectChoice={handleChoice}
          />
        </section>
      )}

      {!hideNarrative && choiceError != null && (
        <section className="scenario-status scenario-status--error" role="alert">
          <p className="scenario-status-text">{choiceError}</p>
          <div className="scenario-status-actions">
            <button type="button" className="scenario-action-button" onClick={retryChoice}>
              <RotateCcw size={16} strokeWidth={2.2} aria-hidden="true" />
              <span>Retry</span>
            </button>
          </div>
        </section>
      )}

      {isScenarioEnded && endProgress != null && (
        <section className="scenario-end" role="dialog" aria-modal="true" aria-label="Scenario complete">
          <div className="scenario-end-card">
            <span className="scenario-end-icon" aria-hidden="true">
              <Crown size={26} strokeWidth={2} />
            </span>
            <h2 className="scenario-end-title">Chapter complete</h2>
            <p className="scenario-end-subtitle">
              Your choices echo through the Crown of Ash.
            </p>
            <dl className="scenario-end-stats">
              <div className="scenario-end-stat">
                <dt>Ash Clock</dt>
                <dd>{endProgress.ashClock}</dd>
              </div>
              <div className="scenario-end-stat">
                <dt>Corruption</dt>
                <dd>{endProgress.corruption}</dd>
              </div>
              <div className="scenario-end-stat">
                <dt>War Score</dt>
                <dd>{endProgress.warScore}</dd>
              </div>
              <div className="scenario-end-stat">
                <dt>Companions</dt>
                <dd>{loyaltyTotal}</dd>
              </div>
              <div className="scenario-end-stat">
                <dt>Quests advanced</dt>
                <dd>{questCount}</dd>
              </div>
            </dl>
            {progression != null && (
              <p className="scenario-end-level">
                <ScrollText size={15} aria-hidden="true" /> You reached level{' '}
                <b>{progression.level}</b>
              </p>
            )}
            <div className="scenario-end-actions">
              <button type="button" className="scenario-action-button" onClick={onBackToMenu}>
                <Home size={16} strokeWidth={2.2} aria-hidden="true" />
                <span>Return to menu</span>
              </button>
              <button
                type="button"
                className="scenario-action-button"
                onClick={() => setIsJournalOpen(true)}
              >
                <ScrollText size={16} strokeWidth={2.2} aria-hidden="true" />
                <span>Review quests</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {isJournalOpen && (
        <QuestJournal playerId={playerId} onClose={() => setIsJournalOpen(false)} />
      )}
    </main>
  );
}

export default ScenarioPage;
