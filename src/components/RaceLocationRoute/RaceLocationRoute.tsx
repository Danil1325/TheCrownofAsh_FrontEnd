import { CheckCircle2, Circle, MapPin } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { LocationRoute } from '../../types/location';
import './RaceLocationRoute.css';

export interface RaceLocationRouteProps {
  route: LocationRoute[];
}

function getStepIcon(step: LocationRoute): LucideIcon {
  if (step.isCurrent) {
    return MapPin;
  }

  if (step.isCompleted) {
    return CheckCircle2;
  }

  return Circle;
}

function RaceLocationRoute({ route }: RaceLocationRouteProps) {
  if (route.length === 0) {
    return (
      <section className="race-location-route race-location-route--empty" aria-label="Race location route">
        <p className="race-location-route__empty-message">
          No route is available yet.
        </p>
      </section>
    );
  }

  return (
    <section className="race-location-route" aria-label="Race location route">
      <header className="race-location-route__header">
        <h2 className="race-location-route__title">Location Route</h2>
        <p className="race-location-route__subtitle">
          Progression is provided by the backend.
        </p>
      </header>

      <ol className="race-location-route__list">
        {route.map((step, index) => {
          const StepIcon = getStepIcon(step);
          const statusText = step.status.trim().length > 0 ? step.status : 'Status unavailable';
          const className = [
            'race-location-route__step',
            step.isCurrent && 'race-location-route__step--current',
            step.isCompleted && 'race-location-route__step--completed',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <li
              key={`${step.order}-${step.locationId}-${index}`}
              className={className}
              aria-current={step.isCurrent ? 'step' : undefined}
            >
              <div className="race-location-route__marker" aria-hidden="true">
                <span className="race-location-route__order">{step.order}</span>
                <span className="race-location-route__seal">
                  <StepIcon size={18} strokeWidth={2.4} />
                </span>
              </div>

              <article className="race-location-route__card">
                <h3 className="race-location-route__location">{step.locationName}</h3>
                <dl className="race-location-route__facts">
                  <div className="race-location-route__fact">
                    <dt>Status</dt>
                    <dd>{statusText}</dd>
                  </div>
                  <div className="race-location-route__fact">
                    <dt>Recommended</dt>
                    <dd>Level {step.recommendedLevel}</dd>
                  </div>
                </dl>
                <div className="race-location-route__badges" aria-label="Step flags">
                  <span className="race-location-route__badge">
                    {step.isCurrent ? 'Current' : 'Not current'}
                  </span>
                  <span className="race-location-route__badge">
                    {step.isCompleted ? 'Completed' : 'Not completed'}
                  </span>
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default RaceLocationRoute;
