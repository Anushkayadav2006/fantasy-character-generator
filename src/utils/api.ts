import { FantasyCharacter } from '../types/character';

export async function requestBackstoryGeneration(character: FantasyCharacter): Promise<string> {
  try {
    const res = await fetch('/api/generate-backstory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: character.name,
        title: character.title,
        className: character.className,
        element: character.element,
        stats: character.stats,
      }),
    });

    if (!res.ok) {
      throw new Error(`Server responded with ${res.status}`);
    }

    const data = await res.json();
    if (data.backstory) {
      return data.backstory;
    }
    throw new Error('No backstory received');
  } catch (error) {
    console.warn('Backend backstory request failed, falling back to local divination:', error);
    // Return a procedurally varied backstory
    const prefixes = [
      'Inscribed in the burnt scrolls of Eldoria,',
      'According to whispers in the tavern cellars,',
      'The ancient constellations reveal that',
      'Forged in the heart of arcane turmoil,'
    ];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    return `${prefix} ${character.name} ${character.title} vowed to master the mysteries of the ${character.element} after their ancestral village was swept away by a dimensional rift. Now, armed with their ${character.signatureWeapon}, they wander the frontier in search of destiny.`;
  }
}
