import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Port MUST be 3000 in AI Studio
const port = 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Procedural fallback generators for backstory
const BACKSTORY_TEMPLATES: Record<string, string[]> = {
  Mage: [
    "Forged in the Astral Observatories of Elyria, {name} accidentally dissolved their mentor's physical form into pure starlight during their very first spell duel.",
    "Whispers say {name} bartered away their left shadow to an extra-planar djinn in exchange for absolute mastery over the primordial leylines.",
    "Exiled from the Arcane Spire for transmuting lead into living singing crystals, {name} wanders the scorched wastes pursuing forgotten chronomancy.",
    "Once an archivist in the Grand Library of Runes, {name} absorbed the contents of an ancient burning grimoire directly into their bloodstream."
  ],
  Rogue: [
    "Orphaned in the maze-like underbelly of Sunken Port, {name} earned legendary infamy by stealing the crown jewels right off the sleeping High Inquisitor.",
    "Trained by the Silent Quill guild, {name} moves like velvet mist and has never left behind a single witness—only a single black card.",
    "After breaking out of the inescapable Ironfang Prison using only a copper wire and an enchanted lockpick, {name} now works for whichever guild pays in gold.",
    "Possessing daggers quenched in venomous Wyrm tears, {name} can step between shadows as easily as crossing an open threshold."
  ],
  Warrior: [
    "The sole survivor of the catastrophic Siege of Bloodstone Keep, {name} wields a greatsword engraved with the sacred oaths of fallen shield-brothers.",
    "Crowned champion of the Pit of Titans after cleaving a mountain beast in twain, {name} seeks worthy adversaries across the shattered realms.",
    "Infused with dragonblood during an ancient blood-pact ceremony, {name}'s skin resists iron blades while battle fury burns in their veins.",
    "Born into the mountain vanguard clans, {name} learned to parry thunderbolts with heavy iron plating before mastering the art of war."
  ],
  Cleric: [
    "Blessed by the Dawn Herald when a celestial comet grazed the temple spires, {name} channels solar radiance capable of burning away the deepest curses.",
    "A former battlefield medic who witnessed miraculous divine intervention, {name} commands holy light to mend mortal wounds and smite abominations.",
    "Bearing a sanctified crystal mace handed down through twelve generations of holy arbiters, {name} purges demonic blight with solemn righteous wrath.",
    "After surviving three days inside an abyss rift through sheer faith and celestial chant, {name} returned with eyes illuminated by eternal divine grace."
  ],
  Paladin: [
    "Sworn to the Oath of the Sacred Aegis, {name} stands as an unyielding bulwark between innocent villagers and the creeping horrors of the Void.",
    "Their armor was hammered from celestial meteor iron, glowing with righteous judgment whenever malevolent creatures draw near."
  ],
  Necromancer: [
    "Delving into moss-covered catacombs forbidden for a millennium, {name} learned that the dead speak candidly when coaxed with soul-salt.",
    "Carrying bone runes harvested from ancestral crypts, {name} weaves necrotic threads to command restless spirits to do their bidding."
  ]
};

// API: Generate unique 1-2 sentence Backstory
app.post('/api/generate-backstory', async (req, res) => {
  try {
    const { name, className, stats, title, element } = req.body;
    const charName = name || 'The Wanderer';
    const charClass = className || 'Warrior';
    const charTitle = title || 'the Renowned';
    const charElement = element || 'Arcane';

    if (ai) {
      try {
        const prompt = `You are an ancient alchemist and chronicler of mythical heroes.
Create a captivating, unique 1-2 sentence origin story for this fantasy character:
Name: ${charName} ${charTitle}
Class: ${charClass}
Affinity: ${charElement}
Stats: HP ${stats?.hp || 100}, Mana ${stats?.mana || 50}, Strength ${stats?.strength || 60}

Requirements:
- EXACTLY 1 or 2 dramatic sentences.
- High fantasy tone fitting an ancient alchemist's tome.
- Specific, evocative details (e.g., guilds, ancient relics, mythical creatures, cataclysms).
- Return ONLY the backstory text with no quotes, commentary, or markdown formatting.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            temperature: 0.9,
          },
        });

        const generatedText = response.text?.trim();
        if (generatedText && generatedText.length > 10) {
          return res.json({ backstory: generatedText, source: 'gemini' });
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, using procedural lore generator:', geminiError);
      }
    }

    // Fallback procedural generation
    const templates = BACKSTORY_TEMPLATES[charClass] || BACKSTORY_TEMPLATES['Warrior'];
    const chosen = templates[Math.floor(Math.random() * templates.length)];
    const backstory = chosen.replace(/{name}/g, `${charName} ${charTitle}`);
    return res.json({ backstory, source: 'procedural' });
  } catch (err) {
    console.error('Error generating backstory:', err);
    res.status(500).json({ error: 'Failed to generate backstory' });
  }
});

// Dev vs Production static handling
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    try {
      let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      if (vite.ssrFixStacktrace) {
        vite.ssrFixStacktrace(e as Error);
      }
      next(e);
    }
  });
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Fantasy Character Generator server listening at http://0.0.0.0:${port}`);
});
