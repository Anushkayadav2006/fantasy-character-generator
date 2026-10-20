import { CharacterClass, ElementalAffinity, CardRarity } from '../types/character';

export const BASE_CLASS_PORTRAITS: Record<CharacterClass, string[]> = {
  Mage: [
    '/src/assets/images/portrait_mage_1792487473584.jpg',
  ],
  Warrior: [
    '/src/assets/images/portrait_warrior_1792487474029.jpg',
  ],
  Rogue: [
    '/src/assets/images/portrait_rogue_1792487474932.jpg',
  ],
  Cleric: [
    '/src/assets/images/portrait_cleric_1792487474982.jpg',
  ],
  Paladin: [
    '/src/assets/images/portrait_warrior_1792487474029.jpg',
  ],
  Ranger: [
    '/src/assets/images/portrait_rogue_1792487474932.jpg',
  ],
  Necromancer: [
    '/src/assets/images/portrait_mage_1792487473584.jpg',
  ],
};

export const FIRST_NAMES: Record<CharacterClass, string[]> = {
  Mage: ['Ignis', 'Lyra', 'Vesper', 'Althea', 'Morrigan', 'Zephyr', 'Archimedes', 'Solas', 'Kaelen', 'Morgana', 'Astraea', 'Balthazar'],
  Rogue: ['Shadow', 'Kael', 'Vespera', 'Silas', 'Corvus', 'Nyx', 'Riven', 'Jax', 'Sariel', 'Garrick', 'Whisper', 'Locke'],
  Warrior: ['Garrick', 'Thorin', 'Valkor', 'Brann', 'Astrid', 'Gideon', 'Ragnar', 'Krag', 'Valeria', 'Brogan', 'Hilda', 'Torvald'],
  Cleric: ['Aurelia', 'Seraphina', 'Ezekiel', 'Celeste', 'Lucian', 'Gabriel', 'Eliana', 'Benedict', 'Theodora', 'Amara', 'Gideon', 'Mercy'],
  Paladin: ['Arthur', 'Roland', 'Galahad', 'Elysia', 'Justiciar', 'Aric', 'Leona', 'Valerius'],
  Ranger: ['Sylas', 'Rowan', 'Artemis', 'Hawke', 'Lyanna', 'Fletcher', 'Bramble', 'Talon'],
  Necromancer: ['Malakor', 'Vespera', 'Thanatos', 'Lilith', 'Morvath', 'Osiris', 'Kaelith', 'Draven']
};

export const TITLES: string[] = [
  'the Spellweaver', 'the Nightblade', 'the Ironclad', 'the Dawnseeker',
  'the Stormcaller', 'the Unbroken', 'the Whisperer', 'the Sunstrider',
  'the Voidwalker', 'the Dragon-Heart', 'the Alchemist', 'the Astral Sage',
  'the Blade of Dawn', 'the Cinder King', 'the Frost Weaver', 'the Shadow Stalker'
];

export const CLASS_CONFIG: Record<CharacterClass, {
  color: string;
  badgeBg: string;
  borderColor: string;
  baseHp: [number, number];
  baseMana: [number, number];
  baseStr: [number, number];
  preferredElements: ElementalAffinity[];
  weapons: string[];
  abilities: { name: string; description: string; manaCost: number }[];
}> = {
  Mage: {
    color: '#818cf8',
    badgeBg: 'bg-indigo-950/80 border-indigo-500 text-indigo-300',
    borderColor: 'border-indigo-500',
    baseHp: [65, 110],
    baseMana: [140, 220],
    baseStr: [30, 55],
    preferredElements: ['Arcane', 'Flame', 'Frost', 'Thunder'],
    weapons: ['Starlight Spellstaff', 'Prismatic Crystal Orb', 'Tome of Celestial Invocations', 'Aether Wand'],
    abilities: [
      { name: 'Supernova Burst', description: 'Unleashes a cascade of pure astral flame dealing catastrophic area damage.', manaCost: 65 },
      { name: 'Chrono Rift', description: 'Distorts temporal flow around foes, reducing their haste to a standstill.', manaCost: 50 },
      { name: 'Arcane Ward', description: 'Encases the caster in an impregnable matrix of crystalline force.', manaCost: 40 }
    ]
  },
  Rogue: {
    color: '#34d399',
    badgeBg: 'bg-emerald-950/80 border-emerald-500 text-emerald-300',
    borderColor: 'border-emerald-500',
    baseHp: [80, 130],
    baseMana: [60, 110],
    baseStr: [65, 105],
    preferredElements: ['Shadow', 'Nature', 'Thunder'],
    weapons: ['Venom-Dipped Daggers', 'Recurve Shadow Bow', 'Parrying Main-Gauche', 'Hidden Spring Blades'],
    abilities: [
      { name: 'Shadow Step', description: 'Dissolves into darkness and instantly strikes from the enemy blind spot.', manaCost: 35 },
      { name: 'Viper Strike', description: 'Coats blades in virulent basilisk venom dealing severe damage over time.', manaCost: 30 },
      { name: 'Smoke Bomb', description: 'Creates an impenetrable cloud of obscuring ash, evading all incoming blows.', manaCost: 25 }
    ]
  },
  Warrior: {
    color: '#f87171',
    badgeBg: 'bg-red-950/80 border-red-500 text-red-300',
    borderColor: 'border-red-500',
    baseHp: [150, 240],
    baseMana: [30, 65],
    baseStr: [110, 160],
    preferredElements: ['Flame', 'Thunder', 'Shadow'],
    weapons: ['Runic Battleaxe', 'Sunforged Broadsword', 'Obsidian Halberd', 'Tower Aegis & Spiked Mace'],
    abilities: [
      { name: 'Titan Slam', description: 'Strikes the earth with titanic fury, sending shockwaves through enemy ranks.', manaCost: 25 },
      { name: 'Berserker Roar', description: 'Unleashes an primal battlecry that increases attack power and armor.', manaCost: 20 },
      { name: 'Iron Bastion', description: 'Plants feet and braces shield, deflecting all fatal blows for 3 turns.', manaCost: 30 }
    ]
  },
  Cleric: {
    color: '#fbbf24',
    badgeBg: 'bg-amber-950/80 border-amber-500 text-amber-300',
    borderColor: 'border-amber-500',
    baseHp: [110, 175],
    baseMana: [110, 180],
    baseStr: [60, 95],
    preferredElements: ['Radiant', 'Arcane', 'Frost'],
    weapons: ['Sunlit Morningstar', 'Sanctified Relic Scepter', 'Silver Censer Flail', 'Gilded Holy Scripture'],
    abilities: [
      { name: 'Solar Cleansing', description: 'Bathes allies in celestial luminescence, restoring substantial health and dispelling debuffs.', manaCost: 55 },
      { name: 'Divine Judgment', description: 'Calls down a column of burning radiant light upon the wicked.', manaCost: 60 },
      { name: 'Aegis of Faith', description: 'Grants all companions a glowing holy barrier absorbing damage.', manaCost: 45 }
    ]
  },
  Paladin: {
    color: '#eab308',
    badgeBg: 'bg-yellow-950/80 border-yellow-500 text-yellow-300',
    borderColor: 'border-yellow-500',
    baseHp: [140, 220],
    baseMana: [70, 130],
    baseStr: [95, 140],
    preferredElements: ['Radiant', 'Flame'],
    weapons: ['Holy Avenger Blade', 'Lumin Vanguard Greatshield'],
    abilities: [
      { name: 'Lay on Hands', description: 'Restores a massive burst of health through direct divine touch.', manaCost: 45 },
      { name: 'Wrath of Justice', description: 'Imbues weapon with righteous fire to execute evil foes.', manaCost: 40 }
    ]
  },
  Ranger: {
    color: '#4ade80',
    badgeBg: 'bg-green-950/80 border-green-500 text-green-300',
    borderColor: 'border-green-500',
    baseHp: [95, 150],
    baseMana: [60, 110],
    baseStr: [80, 120],
    preferredElements: ['Nature', 'Frost'],
    weapons: ['Elven Longbow', 'Twin Woodcutter Hatchets'],
    abilities: [
      { name: 'Hail of Arrows', description: 'Rains a dense barrage of feathered arrows upon the target area.', manaCost: 40 },
      { name: 'Beast Mastery', description: 'Summons a spectral wolf companion to flank and tear down enemies.', manaCost: 35 }
    ]
  },
  Necromancer: {
    color: '#c084fc',
    badgeBg: 'bg-purple-950/80 border-purple-500 text-purple-300',
    borderColor: 'border-purple-500',
    baseHp: [70, 120],
    baseMana: [130, 210],
    baseStr: [35, 60],
    preferredElements: ['Shadow', 'Frost'],
    weapons: ['Skull-Tipped Scythe', 'Bone Reliquary'],
    abilities: [
      { name: 'Raise Undead', description: 'Awakens ancient skeletal guardians from subterranean tombs to fight for you.', manaCost: 60 },
      { name: 'Soul Siphon', description: 'Drains life essence directly from foes to restore health and mana.', manaCost: 40 }
    ]
  }
};

export const ELEMENT_ICONS: Record<ElementalAffinity, { label: string; color: string; bg: string }> = {
  Arcane: { label: 'Arcane', color: '#a855f7', bg: 'from-purple-900/60 to-indigo-950/80' },
  Shadow: { label: 'Shadow', color: '#10b981', bg: 'from-emerald-950/60 to-zinc-950/80' },
  Flame: { label: 'Flame', color: '#ef4444', bg: 'from-red-950/60 to-amber-950/80' },
  Frost: { label: 'Frost', color: '#38bdf8', bg: 'from-sky-950/60 to-cyan-950/80' },
  Radiant: { label: 'Radiant', color: '#fbbf24', bg: 'from-amber-950/60 to-yellow-950/80' },
  Nature: { label: 'Nature', color: '#22c55e', bg: 'from-green-950/60 to-emerald-950/80' },
  Thunder: { label: 'Thunder', color: '#f59e0b', bg: 'from-yellow-900/60 to-amber-950/80' },
};

export const RARITIES: { rarity: CardRarity; border: string; glow: string; weight: number }[] = [
  { rarity: 'Common', border: 'border-amber-900/60', glow: 'shadow-amber-900/20', weight: 40 },
  { rarity: 'Rare', border: 'border-blue-500/80', glow: 'shadow-blue-500/40', weight: 30 },
  { rarity: 'Epic', border: 'border-purple-500/80', glow: 'shadow-purple-500/50', weight: 20 },
  { rarity: 'Legendary', border: 'border-amber-400', glow: 'shadow-amber-400/60', weight: 8 },
  { rarity: 'Mythic', border: 'border-rose-500', glow: 'shadow-rose-500/80', weight: 2 },
];
