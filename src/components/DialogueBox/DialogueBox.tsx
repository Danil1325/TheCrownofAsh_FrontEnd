import { useEffect, useState } from 'react';
import type { DialogueType } from '../../types/scenario';
import './DialogueBox.css';

interface DialogueBoxProps {
  /** Character name. For `Player` this is the player's nickname. */
  speaker: string;
  text: string;
  dialogueType: DialogueType;
  /** Called when advancing to the next dialogue line. */
  onNext: () => void;
  isLastDialogue: boolean;
  /** Enables the typewriter effect. Defaults to true. */
  typewriter?: boolean;
  /** Milliseconds per revealed character. Defaults to 28. */
  typewriterSpeed?: number;
}

const SPEAKER_LABELS: Partial<Record<DialogueType, string>> = {
  Narration: 'Author',
  System: 'System',
};

/** Holds the per-line typewriter state; remounted by `key={text}` on new lines. */
const DialogueLine = ({
  speaker,
  text,
  dialogueType,
  onNext,
  isLastDialogue,
  typewriter,
  typewriterSpeed,
}: DialogueBoxProps) => {
  const [visibleChars, setVisibleChars] = useState(0);
  const [skipped, setSkipped] = useState(false);

  const isDone = skipped || !typewriter || visibleChars >= text.length;

  useEffect(() => {
    if (!typewriter || skipped || visibleChars >= text.length) return;
    const timer = setTimeout(
      () => setVisibleChars((count) => Math.min(count + 1, text.length)),
      typewriterSpeed,
    );
    return () => clearTimeout(timer);
  }, [visibleChars, skipped, typewriter, text, typewriterSpeed]);

  const displayText = skipped || !typewriter ? text : text.slice(0, visibleChars);
  const displaySpeaker = SPEAKER_LABELS[dialogueType] ?? speaker;
  const isTyping = typewriter && !isDone;

  const handleInteraction = () => {
    if (isTyping) {
      setSkipped(true);
      return;
    }
    onNext();
  };

  const buttonLabel = isTyping
    ? 'Skip'
    : isLastDialogue
      ? 'Finish'
      : 'Continue';

  return (
    <>
      <div className="dialogue-content" onClick={handleInteraction}>
        <span className={`dialogue-speaker dialogue-speaker-${dialogueType.toLowerCase()}`}>
          {displaySpeaker}
        </span>
        <p className="dialogue-text">{displayText}</p>
      </div>
      <button
        type="button"
        className="dialogue-continue"
        onClick={(event) => {
          event.stopPropagation();
          handleInteraction();
        }}
      >
        {buttonLabel}
      </button>
    </>
  );
};

const DialogueBox = ({
  speaker,
  text,
  dialogueType,
  onNext,
  isLastDialogue,
  typewriter = true,
  typewriterSpeed = 28,
}: DialogueBoxProps) => (
  <div className="dialogue-box">
    <DialogueLine
      key={text}
      speaker={speaker}
      text={text}
      dialogueType={dialogueType}
      onNext={onNext}
      isLastDialogue={isLastDialogue}
      typewriter={typewriter}
      typewriterSpeed={typewriterSpeed}
    />
  </div>
);

export default DialogueBox;