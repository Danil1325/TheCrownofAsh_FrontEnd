import { useEffect, useRef } from 'react';
import { Check, Lock, Swords, UserRound } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { StoryChoice } from '../../types/scenario';
import './ChoiceBox.css';

type ChoiceKind = 'race' | 'class';

/**
 * One selectable scenario choice. Extends the backend `StoryChoice` with
 * optional presentation fields; when the backend omits them the choice
 * renders without the extra UI.
 */
export interface ChoiceBoxChoice extends StoryChoice {
  /** Level requirement, shown as a badge when the backend sends one. */
  requiredLevel?: number;
  /** Marks a special race/class choice so a themed icon is displayed. */
  choiceKind?: ChoiceKind;
  /** Custom image that overrides the themed race/class icon. */
  icon?: string;
  /** Backend-marked choices render disabled but stay visible. */
  isUnavailable?: boolean;
}

interface ChoiceBoxProps {
  /** The selectable choices, in display order. Choices the backend does not send are not rendered. */
  choices: ChoiceBoxChoice[];
  /** Id of the currently selected choice, set by the parent after the API responds. */
  selectedChoiceId?: number | null;
  /** Disables every option, e.g. while the choice API request is in flight. */
  disabled?: boolean;
  /** Called once per click with the selected choice. */
  onSelectChoice: (choice: ChoiceBoxChoice) => void;
}

const CHOICE_KIND_ICONS: Partial<Record<ChoiceKind, LucideIcon>> = {
  race: UserRound,
  class: Swords,
};

const ChoiceBox = ({
  choices,
  selectedChoiceId,
  disabled = false,
  onSelectChoice,
}: ChoiceBoxProps) => {
  // Synchronous guard that prevents a second onSelectChoice call between the
  // first click and the parent disabling the box with the `disabled` prop.
  // Released when the parent re-enables the box or a new scene's choices
  // arrive, so later scenes stay clickable.
  const isPendingRef = useRef(false);

  useEffect(() => {
    isPendingRef.current = false;
  }, [disabled, choices]);

  const handleSelect = (choice: ChoiceBoxChoice) => {
    if (disabled || choice.isUnavailable || isPendingRef.current) return;
    isPendingRef.current = true;
    onSelectChoice(choice);
  };

  if (choices.length === 0) {
    return null;
  }

  const optionCountClass = `choice-box--count-${Math.min(Math.max(choices.length, 1), 4)}`;

  return (
    <div className={`choice-box ${optionCountClass}`} role="group" aria-label="Choices">
      {choices.map((choice) => {
        const isSelected = choice.id === selectedChoiceId;
        const isDisabled = disabled || choice.isUnavailable;
        const SpecialIcon = choice.choiceKind != null ? CHOICE_KIND_ICONS[choice.choiceKind] : undefined;
        const className = [
          'choice-option',
          isSelected && 'choice-option--selected',
          choice.isUnavailable && 'choice-option--unavailable',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <button
            key={choice.id}
            type="button"
            className={className}
            disabled={isDisabled}
            aria-pressed={isSelected}
            onClick={() => handleSelect(choice)}
          >
            <span className="choice-option-content">
              {choice.icon != null ? (
                <span className="choice-option-icon" aria-hidden="true">
                  <img className="choice-option-icon-image" src={choice.icon} alt="" />
                </span>
              ) : SpecialIcon != null ? (
                <SpecialIcon className="choice-option-icon" strokeWidth={2.2} aria-hidden="true" />
              ) : null}
              <span className="choice-option-text">{choice.text}</span>
              {choice.requiredLevel != null && (
                <span
                  className="choice-option-requirement"
                  title={`Requires level ${choice.requiredLevel}`}
                >
                  <Lock size={14} strokeWidth={2.4} aria-hidden="true" />
                  <span>Level {choice.requiredLevel}</span>
                </span>
              )}
              {isSelected && (
                <Check className="choice-option-check" size={18} strokeWidth={3} aria-hidden="true" />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default ChoiceBox;