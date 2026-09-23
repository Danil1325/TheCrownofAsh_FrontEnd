// Mirrors the backend DTO models for scenarios, quests and progression
// (DnDGame.BusinessLayer.Dtos.Scenarios, .Dtos.Progression and
// DnDGame.BusinessLayer.Models). JSON is camelCase (ASP.NET Core default).

/** One line of dialogue inside a scenario scene. `type` is the C# DialogueType enum as string. */
export type DialogueType = 'Narration' | 'Player' | 'NPC' | 'System';

export interface StoryDialogue {
  id: number;
  speaker: string;
  text: string;
  order: number;
  type: DialogueType;
}

/** One selectable choice. `nextSceneId` is null when choosing it ends the scenario. */
export interface StoryChoice {
  id: number;
  text: string;
  nextSceneId: number | null;
}

/** Response shape for GET /api/scenario/current/{playerId} (StorySceneDto). */
export interface StoryScene {
  id: number;
  act: number;
  chapter: number;
  title: string;
  locationId: number;
  backgroundImage: string;
  isFinalScene: boolean;
  dialogues: StoryDialogue[];
  choices: StoryChoice[];
}

/** Persistent scenario run state (ScenarioProgressDto). */
export interface ScenarioProgress {
  gameSessionId: number;
  currentSceneId: number;
  isCompleted: boolean;
  ashClock: number;
  corruption: number;
  warScore: number;
  companionLoyalty: Record<number, number>;
  questProgress: Record<number, number>;
  storyFlags: Record<string, boolean>;
  /** Present on choice responses when the player crossed a level threshold. */
  DidLevelUp?: boolean;
  didLevelUp?: boolean;
  Level?: number;
  level?: number;
  newLocationIds?: number[];
}

/** Serialized as int by the backend (no JsonStringEnumConverter configured). */
export enum QuestType {
  Main = 0,
  Side = 1,
}

/** Serialized as int by the backend (no JsonStringEnumConverter configured). */
export enum QuestStatus {
  Locked = 0,
  Available = 1,
  Active = 2,
  Completed = 3,
  Failed = 4,
}

/** Public description of a quest from the catalog (QuestView). */
export interface QuestSummary {
  id: number;
  code: string;
  title: string;
  description: string;
  questType: QuestType;
  questGiver: string;
  recommendedLevel: number;
  recommendedMaximumLevel: number | null;
  locationId: number | null;
  possibleLocationIds: number[];
  isOptional: boolean;
  experienceReward: number;
}

/** One player's progress on one quest within a game session (QuestProgressView). */
export interface PlayerQuest {
  questId: number;
  code: string;
  title: string;
  status: QuestStatus;
  currentObjectiveIndex: number;
  currentObjectiveId: number | null;
  currentObjectiveDescription: string | null;
  objectiveProgress: Record<number, number>;
  startedAt: string | null;
  completedAt: string | null;
}

/** Character level/experience state (CharacterProgressionDto). */
export interface LevelProgress {
  level: number;
  currentExperience: number;
  experienceForCurrentLevel: number;
  experienceForNextLevel: number | null;
  experienceProgressPercentage: number;
  availableSkillPoints: number;
}
