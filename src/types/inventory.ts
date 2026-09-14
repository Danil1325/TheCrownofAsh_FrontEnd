export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
export type ItemCategory = 'Weapon' | 'Armor' | 'Amulet' | 'Potion' | 'Material';

export interface ItemStats {
  hp?: number;
  damage?: number;
  defense?: number;
}

export interface Item {
  id: string;
  name: string;
  category: ItemCategory;
  rarity: Rarity;
  description: string;
  stats?: ItemStats;
  effects?: string[];
  quantity?: number;
  imageUrl?: string; // Optional for now, we'll use CSS placeholders if missing
  value: number; // For sorting
}

export interface PlayerStats {
  baseHp: number;
  baseDamage: number;
  baseDefense: number;
  currentHp: number;
  currentDamage: number;
  currentDefense: number;
}

export interface Equipment {
  Weapon: Item | null;
  Armor: Item | null;
  Amulet: Item | null;
}
