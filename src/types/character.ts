export type CharacterClass = 'Mage' | 'Rogue' | 'Warrior' | 'Cleric' | 'Paladin' | 'Ranger' | 'Necromancer';

export type ElementalAffinity = 'Arcane' | 'Shadow' | 'Flame' | 'Frost' | 'Radiant' | 'Nature' | 'Thunder';

export type CardRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';

export interface CharacterStats {
  hp: number;        // Health: 50 - 250
  mana: number;      // Mana: 20 - 200
  strength: number;  // Strength: 30 - 150
}

export interface FantasyCharacter {
  id: string;
  name: string;
  title: string;
  className: CharacterClass;
  rarity: CardRarity;
  element: ElementalAffinity;
  portraitUrl: string;
  portraitStyle: string; // 'game_art_1', 'game_art_2', 'procedural_avatar', etc.
  avatarSeed: number;
  stats: CharacterStats;
  backstory: string;
  specialAbility: {
    name: string;
    description: string;
    manaCost: number;
  };
  signatureWeapon: string;
  createdAt: number;
}
