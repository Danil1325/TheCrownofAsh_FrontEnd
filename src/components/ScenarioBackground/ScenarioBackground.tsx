import { useCallback, useEffect, useRef, useState } from 'react';
import { backgroundByLocation } from '../../assets/scenario/scenarioAssets';
import './ScenarioBackground.css';

const FADE_MS = 450;

interface BackgroundState {
  locationId: number | null;
  url: string | undefined;
}

interface ScenarioBackgroundProps {
  /** LocationId of the loaded scene; drives which background image renders. */
  locationId: number | null;
  /**
   * Reported `true` from the moment a new location starts loading until the
   * cross-fade finishes — the page should keep the DialogueBox/ChoiceBox
   * hidden for the whole transition.
   */
  onTransitionChange?: (isTransitioning: boolean) => void;
  /** Extra class for sizing the stage that hosts the background. */
  className?: string;
}

/** Fetches an image into the browser cache; resolves even on error so a transition always completes. */
function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;
  });
}

/**
 * Full-bleed scenario background with a location cross-fade.
 *
 * On `locationId` change it preloads the image of the next location, shows a
 * dimmed loading fallback while it is not decoded, then cross-fades from the
 * old background to the new one. `onTransitionChange` stays `true` for the
 * whole window so the page can hide the DialogueBox. With
 * `prefers-reduced-motion: reduce` the swap happens instantly (no fade).
 */
function ScenarioBackground({ locationId, onTransitionChange, className }: ScenarioBackgroundProps) {
  // Start blank; the first effect below preloads and fades in the first scene.
  const [current, setCurrent] = useState<BackgroundState>({ locationId: null, url: undefined });
  const [incoming, setIncoming] = useState<BackgroundState | null>(null);
  const [isPreloading, setIsPreloading] = useState(false);

  const taskRef = useRef(0);
  const reducedMotionRef = useRef(false);
  const onTransitionChangeRef = useRef(onTransitionChange);

  useEffect(() => {
    onTransitionChangeRef.current = onTransitionChange;
  }, [onTransitionChange]);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = query.matches;
    const update = (event: MediaQueryListEvent) => {
      reducedMotionRef.current = event.matches;
    };
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const startTransition = useCallback(async (target: BackgroundState) => {
    const taskId = ++taskRef.current;
    // The effect defers this call, so the state updates below run outside the
    // effect's synchronous stack and are not inlined into its commit.
    onTransitionChangeRef.current?.(true);
    setIncoming(null);
    setIsPreloading(true);

    if (target.url) {
      await preloadImage(target.url);
    }
    if (taskId !== taskRef.current) {
      return;
    }
    setIsPreloading(false);

    // Reduced motion: swap instantly, no cross-fade.
    if (reducedMotionRef.current) {
      setCurrent(target);
      onTransitionChangeRef.current?.(false);
      return;
    }

    setIncoming(target);
    window.setTimeout(() => {
      if (taskId !== taskRef.current) {
        return;
      }
      setCurrent(target);
      setIncoming(null);
      onTransitionChangeRef.current?.(false);
    }, FADE_MS);
  }, []);

  useEffect(() => {
    const target: BackgroundState = {
      locationId,
      url: locationId != null ? backgroundByLocation[locationId] : undefined,
    };
    if (target.locationId === current.locationId) {
      return;
    }
    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (!cancelled) {
        void startTransition(target);
      }
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [locationId, current.locationId, startTransition]);

  const rootClassName = [
    'scenario-background',
    incoming != null && 'scenario-background--fading',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClassName} aria-hidden="true">
      <div
        className="scenario-background__layer scenario-background__layer--current"
        style={current.url ? { backgroundImage: `url("${current.url}")` } : undefined}
      />
      {incoming != null && (
        <div
          className="scenario-background__layer scenario-background__layer--incoming"
          style={incoming.url ? { backgroundImage: `url("${incoming.url}")` } : undefined}
        />
      )}
      {isPreloading && (
        <div className="scenario-background__loading" role="status">
          <span className="scenario-background__spinner" aria-hidden="true" />
          <span className="scenario-background__loading-text">Traveling…</span>
        </div>
      )}
    </div>
  );
}

export default ScenarioBackground;