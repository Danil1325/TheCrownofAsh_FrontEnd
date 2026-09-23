// Mirrors the backend character-creation DTOs
// (DnDGame.BusinessLayer.Dtos.Characters). JSON is camelCase (ASP.NET Core default).

/** RaceType enum as serialized by the backend (no JsonStringEnumConverter configured). */
export enum RaceType {
  Human = 1,
  Elf = 2,
  Orc = 3,
  Dwarf = 4,
}

/** Class ids accepted by POST /api/character/new-game (NewGameCharacterRequestDto.ClassId). */
export enum CharacterClassId {
  Healer = 1,
  Warrior = 2,
  Magician = 3,
  Bard = 4,
}

/** Request body for POST /api/character/new-game (NewGameCharacterRequestDto). */
export interface NewGameCharacterRequest {
  /** Player-chosen name, 2-40 characters. */
  name: string
  race: RaceType
  classId: CharacterClassId
}

/** Response body for POST /api/character/new-game (CharacterResponseDto). */
export interface NewGameCharacterResponse {
  /** The owning player, resolved server-side via ICurrentPlayerService. */
  playerId: number
}