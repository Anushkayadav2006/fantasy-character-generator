import { CharacterClass, ElementalAffinity, CardRarity, FantasyCharacter } from '../types/character';
import { FIRST_NAMES, TITLES, CLASS_CONFIG, BASE_CLASS_PORTRAITS, RARITIES } from '../data/fantasyData';

const CLASSES: CharacterClass[] = ['Mage', 'Rogue', 'Warrior', 'Cleric', 'Paladin', 'Ranger', 'Necromancer'];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateRandomCharacter(preferredClass?: CharacterClass): FantasyCharacter {
  const chosenClass: CharacterClass = preferredClass || getRandomElement(['Mage', 'Rogue', 'Warrior', 'Cleric']);
  const nameList = FIRST_NAMES[chosenClass] || FIRST_NAMES['Warrior'];
  const name = getRandomElement(nameList);
  const title = getRandomElement(TITLES);

  const classCfg = CLASS_CONFIG[chosenClass];
  const element = getRandomElement(classCfg.preferredElements);

  // Rarity roll based on weights
  const randWeight = Math.random() * 100;
  let cumulative = 0;
  let chosenRarity: CardRarity = 'Common';
  for (const r of RARITIES) {
    cumulative += r.weight;
    if (randWeight <= cumulative) {
      chosenRarity = r.rarity;
      break;
    }
  }

  // Rarity stat multiplier bonus
  const rarityMultiplier =
    chosenRarity === 'Mythic' ? 1.35 :
    chosenRarity === 'Legendary' ? 1.2 :
    chosenRarity === 'Epic' ? 1.1 :
    chosenRarity === 'Rare' ? 1.05 : 1.0;

  const baseHp = getRandomNumber(classCfg.baseHp[0], classCfg.baseHp[1]);
  const baseMana = getRandomNumber(classCfg.baseMana[0], classCfg.baseMana[1]);
  const baseStr = getRandomNumber(classCfg.baseStr[0], classCfg.baseStr[1]);

  const stats = {
    hp: Math.round(baseHp * rarityMultiplier),
    mana: Math.round(baseMana * rarityMultiplier),
    strength: Math.round(baseStr * rarityMultiplier),
  };

  const ability = getRandomElement(classCfg.abilities);
  const signatureWeapon = getRandomElement(classCfg.weapons);

  // Default portrait from master generation assets
  const portraitList = BASE_CLASS_PORTRAITS[chosenClass] || BASE_CLASS_PORTRAITS['Warrior'];
  const portraitUrl = portraitList[0];

  const defaultBackstory = getProceduralBackstory(name, title, chosenClass, element);

  return {
    id: `char-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name,
    title,
    className: chosenClass,
    rarity: chosenRarity,
    element,
    portraitUrl,
    portraitStyle: 'master_art',
    avatarSeed: Math.floor(Math.random() * 10000),
    stats,
    backstory: defaultBackstory,
    specialAbility: ability,
    signatureWeapon,
    createdAt: Date.now(),
  };
}

export function getProceduralBackstory(
  name: string,
  title: string,
  className: CharacterClass,
  element: ElementalAffinity
): string {
  const stories: Record<CharacterClass, string[]> = {
    Mage: [
      `Bound by the ancient leylines of ${element} flame and starlight, ${name} ${title} unlocked forbidden celestial cantrips after gazing into the astral vortex.`,
      `Exiled from the high spire for transmuting lead into living singing crystal, ${name} ${title} wanders the scarred realms seeking forgotten chronomancy.`,
      `Whispers claim ${name} ${title} bartered away their left shadow to a primeval djinn in exchange for total mastery over reality's woven seams.`
    ],
    Rogue: [
      `Orphaned in the subterranean canals of Sunken Port, ${name} ${title} achieved infamy by stealing the High Inquisitor's signet ring in broad daylight.`,
      `Cloaked in the velvet shroud of ${element} shadows, ${name} ${title} never leaves behind a footprint—only an obsidian tarot card upon their mark's chest.`,
      `Escaped from the iron gulag using only a rusted needle and quick wits, ${name} ${title} sells their lethal edge strictly to the highest bidder.`
    ],
    Warrior: [
      `Sole survivor of the cataclysmic Battle of Bloodstone Ridge, ${name} ${title} cleaves through enemy vanguard with a greatblade bathed in ancestral fury.`,
      `Forged in the merciless volcanic depths of Mount Cinder, ${name} ${title} bears armor tempered in dragon flame that deflects bolts of thunder.`,
      `Crowned champion of the Pit of Titans, ${name} ${title} seeks an adversary whose blade can match their terrifying raw physical might.`
    ],
    Cleric: [
      `Anointed by the sacred Dawn Herald during the Great Eclipse, ${name} ${title} channels radiant luminescence to purge necrotic blights from the land.`,
      `Bearing a consecrated crystal scepter handed down through twelve generations, ${name} ${title} shields the innocent and smites unholy abominations without hesitation.`,
      `Surviving three days in an abyssal rift through resolute faith, ${name} ${title} returned with eyes gleaming with divine prophecy.`
    ],
    Paladin: [
      `Sworn to the unbreakable Oath of the Solar Aegis, ${name} ${title} stands as an impenetrable shield between mortal villages and the ravenous Void.`,
      `Bearing a shield inscribed with forgotten holy canticles, ${name} ${title} marches into battle where evil is densest.`
    ],
    Ranger: [
      `Raised by dire beasts in the Whispering Brambles, ${name} ${title} can put an arrow through a sovereign coin from three hundred paces away.`,
      `Communing with primal spirits of nature, ${name} ${title} hunts monstrous predators threatening the woodland sanctuaries.`
    ],
    Necromancer: [
      `Disturbing crypts sealed since the First Dynasty, ${name} ${title} commands ancestral phantoms and soul-threads with unyielding chill composure.`,
      `Drawn to the twilight threshold between flesh and eternity, ${name} ${title} preserves forbidden secrets that kingdoms burned libraries to erase.`
    ]
  };

  const list = stories[className] || stories['Warrior'];
  return getRandomElement(list);
}
