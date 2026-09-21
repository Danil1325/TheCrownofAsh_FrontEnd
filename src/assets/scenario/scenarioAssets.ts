import ashtonia from './backgrounds/Ashtonia.png';
import darkstormKeep from './backgrounds/Darkstorm_Keep.png';
import herosOverlook from './backgrounds/Heros_Overlook.png';
import misthavenPort from './backgrounds/Misthaven_Port.png';
import oakheaven from './backgrounds/Oakheaven.png';
import theBonePeaks from './backgrounds/The_Bone_Peaks.png';
import whisperingWoods from './backgrounds/Whispering_Woods.png';

export { default as dialogueBoxImage } from './ui/dialogue_box.png';
export { default as choiceBoxImage } from './ui/choice_box.png';

// Numeric LocationId values from the backend's LocationSeedData.
// Usage: backgroundByLocation[scene.locationId]. Unknown IDs return undefined.
export const backgroundByLocation: Readonly<Record<number, string | undefined>> = {
  1: ashtonia,
  2: darkstormKeep,
  3: herosOverlook,
  4: misthavenPort,
  5: oakheaven,
  6: theBonePeaks,
  7: whisperingWoods,
};
