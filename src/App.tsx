import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Dice5,
  Bookmark,
  BookmarkCheck,
  Layers,
  Wand2,
  RefreshCw,
  Flame,
  Shield,
  Heart,
  Sword,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Trash2,
  Eye,
  ScrollText
} from 'lucide-react';
import { FantasyCharacter, CharacterClass } from './types/character';
import { generateRandomCharacter, getProceduralBackstory } from './utils/characterGenerator';
import { requestBackstoryGeneration } from './utils/api';
import { PlayerCard } from './components/PlayerCard';
import { DeckDrawer } from './components/DeckDrawer';
import { WorkbenchPropsComponent } from './components/WorkbenchProps';
import { BASE_CLASS_PORTRAITS, ELEMENT_ICONS } from './data/fantasyData';

const WORKBENCH_BG_URL = '/src/assets/images/alchemist_table_bg_1792487473066.jpg';

export default function App() {
  // Current character on the workbench
  const [character, setCharacter] = useState<FantasyCharacter>(() => {
    return generateRandomCharacter();
  });

  // Target class filter for generation ('Random', 'Mage', 'Rogue', 'Warrior', 'Cleric', etc.)
  const [selectedClassTarget, setSelectedClassTarget] = useState<string>('Random');

  // Saved Deck state (stored in localStorage under multiple standard keys for compatibility)
  const [deck, setDeck] = useState<FantasyCharacter[]>(() => {
    try {
      const saved =
        localStorage.getItem('my_deck') ||
        localStorage.getItem('fantasy_character_deck') ||
        localStorage.getItem('deck') ||
        localStorage.getItem('characters');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved deck:', e);
    }
    return [];
  });

  // UI state
  const [isDeckOpen, setIsDeckOpen] = useState<boolean>(false);
  const [isGeneratingChar, setIsGeneratingChar] = useState<boolean>(false);
  const [isGeneratingBackstory, setIsGeneratingBackstory] = useState<boolean>(false);
  const [isRegeneratingPortrait, setIsRegeneratingPortrait] = useState<boolean>(false);
  const [isCardTransformMode, setIsCardTransformMode] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync deck to localStorage (Task 5: saves character to localStorage)
  useEffect(() => {
    try {
      const data = JSON.stringify(deck);
      localStorage.setItem('my_deck', data);
      localStorage.setItem('fantasy_character_deck', data);
      localStorage.setItem('deck', data);
      localStorage.setItem('characters', data);
    } catch (e) {
      console.warn('Failed to store deck:', e);
    }
  }, [deck]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Requirement 1: Generate Character button that generates random fantasy character with unique Name and Class like Mage, Rogue, Warrior, Cleric
  const handleGenerateCharacter = (targetClass?: CharacterClass) => {
    setIsGeneratingChar(true);
    setTimeout(() => {
      const preferred = targetClass || (selectedClassTarget !== 'Random' ? (selectedClassTarget as CharacterClass) : undefined);
      const newChar = generateRandomCharacter(preferred);
      setCharacter(newChar);
      setIsGeneratingChar(false);
      showToast(`Transmuted ${newChar.name} ${newChar.title} (${newChar.className})!`);
    }, 250);
  };

  // Requirement 2: A feature to Generate and Regenerate a cartoon/video game style portrait
  const handleRegeneratePortrait = () => {
    setIsRegeneratingPortrait(true);
    setTimeout(() => {
      const classPortraits = BASE_CLASS_PORTRAITS[character.className] || BASE_CLASS_PORTRAITS['Warrior'];
      const nextPortrait = classPortraits[Math.floor(Math.random() * classPortraits.length)];
      const newSeed = Math.floor(Math.random() * 999999);

      setCharacter((prev) => ({
        ...prev,
        avatarSeed: newSeed,
        portraitUrl: nextPortrait,
        portraitStyle: prev.portraitStyle === 'master_art' ? 'vector_chibi' : 'master_art',
      }));
      setIsRegeneratingPortrait(false);
      showToast('Transmuted new cartoon portrait!');
    }, 300);
  };

  // Task 4: Add a button with text "Generate Backstory" that generates a 1-2 sentence origin story and shows it on the card
  const handleGenerateBackstory = async () => {
    setIsGeneratingBackstory(true);
    try {
      const newBackstory = await requestBackstoryGeneration(character);
      setCharacter((prev) => ({
        ...prev,
        backstory: newBackstory,
      }));
      showToast('Generated 1-2 sentence origin story!');
    } catch (err) {
      console.error(err);
      const fallback = getProceduralBackstory(character.name, character.title, character.className, character.element);
      setCharacter((prev) => ({ ...prev, backstory: fallback }));
    } finally {
      setIsGeneratingBackstory(false);
    }
  };

  // Task 5: a button exactly labeled "Save to Deck" that saves character to localStorage and shows in a section titled "My Deck"
  const isCharacterSaved = deck.some((c) => c.id === character.id);

  const handleSaveToDeck = () => {
    if (isCharacterSaved) {
      setDeck((prev) => prev.filter((c) => c.id !== character.id));
      showToast('Hero released from deck.');
    } else {
      setDeck((prev) => [character, ...prev]);
      showToast(`Saved ${character.name} to My Deck!`);
    }
  };

  const handleRemoveFromDeck = (id: string) => {
    setDeck((prev) => prev.filter((c) => c.id !== id));
    showToast('Hero removed from deck.');
  };

  const handleClearDeck = () => {
    setDeck([]);
    showToast('All heroes released from deck.');
  };

  // Interactive workbench potion brews
  const handleBrewPotion = (type: 'hp' | 'mana' | 'str') => {
    setCharacter((prev) => {
      const nextStats = { ...prev.stats };
      if (type === 'hp') {
        nextStats.hp = Math.min(250, nextStats.hp + 20);
        showToast('Infused Ruby Vitriol! Health boosted by +20 HP.');
      } else if (type === 'mana') {
        nextStats.mana = Math.min(220, nextStats.mana + 20);
        showToast('Infused Aether Draught! Mana boosted by +20 MP.');
      } else {
        nextStats.strength = Math.min(160, nextStats.strength + 15);
        showToast('Infused Titan Elixir! Strength boosted by +15 STR.');
      }
      return { ...prev, stats: nextStats };
    });
  };

  const handleRollDice = () => {
    setCharacter((prev) => {
      const delta = () => Math.floor(Math.random() * 21) - 10;
      const nextHp = Math.max(50, Math.min(250, prev.stats.hp + delta()));
      const nextMana = Math.max(20, Math.min(220, prev.stats.mana + delta()));
      const nextStr = Math.max(30, Math.min(160, prev.stats.strength + delta()));
      showToast('The Dice of Destiny reshuffled character stats!');
      return {
        ...prev,
        stats: { hp: nextHp, mana: nextMana, strength: nextStr },
      };
    });
  };

  const primaryClasses: string[] = ['Random', 'Mage', 'Rogue', 'Warrior', 'Cleric', 'Paladin', 'Ranger', 'Necromancer'];

  return (
    <div className="relative min-h-screen text-[#eedbc0] flex flex-col selection:bg-amber-800 selection:text-amber-100 overflow-x-hidden">
      {/* Ancient Alchemist's Workbench Background Image & Textured Dark Wash */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none filter brightness-45 contrast-125"
        style={{ backgroundImage: `url(${WORKBENCH_BG_URL})` }}
      />
      <div className="fixed inset-0 z-0 bg-radial from-transparent via-[#0e0a06]/85 to-[#070503] pointer-events-none" />

      {/* Floating mystical runic particles */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:32px_32px]" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-950/95 border-2 border-amber-500/80 text-amber-100 font-medieval text-sm shadow-[0_0_25px_rgba(245,158,11,0.5)] backdrop-blur-md animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main App Content Container */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Ancient Workbench Header */}
        <header className="border-b-2 border-amber-800/60 bg-[#120c07]/85 backdrop-blur-md px-4 py-3 sm:px-8 shadow-xl">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
            {/* Title & Alchemist Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 via-amber-800 to-yellow-900 border-2 border-amber-400 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                <Flame className="w-6 h-6 text-yellow-200 animate-flame" />
              </div>
              <div>
                <h1 className="font-cinzel text-xl sm:text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-400 drop-shadow">
                  Fantasy Character Generator
                </h1>
                <p className="font-medieval text-xs text-amber-300/70 tracking-widest uppercase">
                  Ancient Alchemist's Transmutation Workbench
                </p>
              </div>
            </div>

            {/* Top Bar Actions */}
            <div className="flex items-center gap-3">
              {/* Transform UI Mode Toggle */}
              <button
                type="button"
                onClick={() => setIsCardTransformMode(!isCardTransformMode)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medieval transition cursor-pointer ${
                  isCardTransformMode
                    ? 'bg-amber-600 text-amber-950 font-bold border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                    : 'bg-[#1e140b] text-amber-200 border-amber-700/60 hover:border-amber-400'
                }`}
                title="Transform between Workbench and Focused Player Card mode"
              >
                {isCardTransformMode ? (
                  <>
                    <Minimize2 className="w-4 h-4" />
                    <span>Workbench View</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-4 h-4 text-amber-400" />
                    <span>Focus Card</span>
                  </>
                )}
              </button>

              {/* Jump to My Deck List */}
              <a
                href="#my-deck-section"
                className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-900/90 to-amber-800/90 hover:from-amber-800 hover:to-amber-700 border-2 border-amber-500/80 text-amber-100 text-xs font-medieval font-bold shadow-lg transition active:scale-95 cursor-pointer"
              >
                <Layers className="w-4 h-4 text-amber-400" />
                <span>My Deck</span>
                <span className="w-5 h-5 rounded-full bg-amber-500 text-amber-950 text-[11px] font-bold flex items-center justify-center">
                  {deck.length}
                </span>
              </a>
            </div>
          </div>
        </header>

        {/* Workbench Control Hub */}
        <section className="bg-[#19110a]/80 border-b border-amber-800/50 px-4 py-3 sm:px-8 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Class Target Filter Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
              <span className="text-xs font-medieval text-amber-400/80 mr-1 uppercase tracking-wider flex items-center gap-1">
                <Wand2 className="w-3.5 h-3.5 text-amber-400" /> Transmute Class:
              </span>
              {primaryClasses.map((cls) => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => {
                    setSelectedClassTarget(cls);
                    if (cls !== 'Random') {
                      handleGenerateCharacter(cls as CharacterClass);
                    }
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-medieval transition-all cursor-pointer ${
                    selectedClassTarget === cls
                      ? 'bg-amber-500 text-amber-950 font-bold border-2 border-amber-300 shadow-md shadow-amber-900/40'
                      : 'bg-[#1f160e] text-amber-200/80 hover:text-amber-100 border border-amber-800/60 hover:border-amber-500'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>

            {/* Primary Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap justify-center">
              {/* Button: Generate Character */}
              <button
                type="button"
                onClick={() => handleGenerateCharacter()}
                disabled={isGeneratingChar}
                className="group relative flex items-center gap-2 py-2 px-5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-amber-950 font-cinzel text-sm sm:text-base font-bold border-2 border-yellow-200 shadow-[0_0_25px_rgba(245,158,11,0.45)] hover:shadow-[0_0_35px_rgba(245,158,11,0.7)] active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 text-amber-950 group-hover:rotate-12 transition-transform ${isGeneratingChar ? 'animate-spin' : ''}`} />
                <span>{isGeneratingChar ? 'Transmuting Soul...' : 'Generate Character'}</span>
              </button>

              {/* Task 4: Button with text "Generate Backstory" */}
              <button
                type="button"
                onClick={handleGenerateBackstory}
                disabled={isGeneratingBackstory}
                className="flex items-center gap-2 py-2 px-4 rounded-xl bg-gradient-to-r from-amber-900 via-amber-800 to-amber-700 hover:from-amber-800 hover:to-amber-600 text-amber-100 font-medieval text-xs sm:text-sm font-bold border border-amber-400/80 shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                <ScrollText className={`w-4 h-4 text-amber-400 ${isGeneratingBackstory ? 'animate-spin' : ''}`} />
                <span>Generate Backstory</span>
              </button>

              {/* Task 5: Button exactly labeled "Save to Deck" */}
              <button
                type="button"
                onClick={handleSaveToDeck}
                className={`flex items-center gap-2 py-2 px-4 rounded-xl font-medieval text-xs sm:text-sm font-bold border transition-all cursor-pointer shadow-md active:scale-95 ${
                  isCharacterSaved
                    ? 'bg-emerald-900 border-emerald-400 text-emerald-100'
                    : 'bg-amber-950 hover:bg-amber-900 border-amber-500 text-amber-200'
                }`}
              >
                {isCharacterSaved ? <BookmarkCheck className="w-4 h-4 text-emerald-300" /> : <Bookmark className="w-4 h-4" />}
                <span>Save to Deck</span>
              </button>
            </div>
          </div>
        </section>

        {/* Workbench Main Surface */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
          {isCardTransformMode ? (
            /* Focused Player Card Mode */
            <div className="flex flex-col items-center justify-center py-4">
              <div className="text-center mb-4">
                <span className="font-medieval text-xs uppercase tracking-widest text-amber-400/80">
                  Transmuted Artifact Showcase
                </span>
                <h3 className="font-cinzel text-xl text-amber-200 font-bold">
                  Bordered Player Card
                </h3>
              </div>

              <PlayerCard
                character={character}
                onRegeneratePortrait={handleRegeneratePortrait}
                onGenerateBackstory={handleGenerateBackstory}
                onSaveToDeck={handleSaveToDeck}
                isSaved={isCharacterSaved}
                isGeneratingBackstory={isGeneratingBackstory}
                isRegeneratingPortrait={isRegeneratingPortrait}
                isTransformExpanded={true}
                onToggleTransform={() => setIsCardTransformMode(false)}
              />
            </div>
          ) : (
            /* Standard Ancient Alchemist Workbench Layout */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Alchemist lore and apparatus */}
              <div className="lg:col-span-4 order-2 lg:order-1 space-y-4">
                <WorkbenchPropsComponent
                  onRollDice={handleRollDice}
                  onBrewPotion={handleBrewPotion}
                  isTransmuting={isGeneratingChar}
                />

                {/* Quick Class Stats Summary */}
                <div className="bg-[#181109]/90 border border-amber-800/60 rounded-2xl p-4 shadow-xl backdrop-blur-md text-xs font-medieval space-y-3">
                  <h4 className="font-cinzel text-amber-200 font-bold text-sm border-b border-amber-900/60 pb-1.5 flex items-center justify-between">
                    <span>Transmutation Guide</span>
                    <span className="text-[10px] text-amber-400">Class Alchemy</span>
                  </h4>
                  <p className="text-amber-200/80 font-marcellus leading-relaxed">
                    Choose from archetypes like <strong className="text-indigo-300">Mage</strong> (high mana, arcane rifts), <strong className="text-emerald-300">Rogue</strong> (stealth, venom daggers), <strong className="text-red-300">Warrior</strong> (heavy steel, titan fortitude), or <strong className="text-amber-300">Cleric</strong> (divine prayers, restorative light).
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div className="p-2 rounded bg-black/40 border border-amber-900/40">
                      <span className="text-amber-400 block font-bold">Portrait Image:</span>
                      <span className="text-amber-300/70">Click "Regenerate" on card to transmute art</span>
                    </div>
                    <div className="p-2 rounded bg-black/40 border border-amber-900/40">
                      <span className="text-amber-400 block font-bold">1-2 Sentence Lore:</span>
                      <span className="text-amber-300/70">Click "Generate Backstory" anytime</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center Column: The Bordered Player Card (Task 5) */}
              <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center">
                <PlayerCard
                  character={character}
                  onRegeneratePortrait={handleRegeneratePortrait}
                  onGenerateBackstory={handleGenerateBackstory}
                  onSaveToDeck={handleSaveToDeck}
                  isSaved={isCharacterSaved}
                  isGeneratingBackstory={isGeneratingBackstory}
                  isRegeneratingPortrait={isRegeneratingPortrait}
                  isTransformExpanded={false}
                  onToggleTransform={() => setIsCardTransformMode(true)}
                />
              </div>

              {/* Right Column: Workbench Quick Transmuter & Transmutation Seal */}
              <div className="lg:col-span-3 order-3 space-y-4">
                {/* Transmutation Sigil Decorative Seal */}
                <div className="parchment-bg border-2 border-amber-800/70 rounded-2xl p-5 shadow-xl text-center space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full border-2 border-amber-500/60 flex items-center justify-center bg-black/40 shadow-inner">
                    <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
                  </div>
                  <h5 className="font-cinzel text-sm font-bold text-amber-200">
                    Alchemical Seal of Creation
                  </h5>
                  <p className="text-xs text-amber-200/80 font-marcellus leading-relaxed">
                    Every character generated is sealed with unique vital attributes: Health, Mana, and Strength.
                  </p>
                  <div className="pt-2 border-t border-amber-900/50 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => handleGenerateCharacter()}
                      className="w-full py-2 px-3 rounded-lg bg-amber-800/80 hover:bg-amber-700 text-amber-100 text-xs font-medieval font-bold border border-amber-500/60 transition cursor-pointer"
                    >
                      Transmute Another Hero
                    </button>
                    <button
                      type="button"
                      onClick={handleGenerateBackstory}
                      disabled={isGeneratingBackstory}
                      className="w-full py-1.5 px-3 rounded-lg bg-black/50 hover:bg-black/70 text-amber-300 text-xs font-medieval border border-amber-800/60 transition cursor-pointer"
                    >
                      Generate Backstory
                    </button>
                  </div>
                </div>

                {/* Deck Summary Mini Widget */}
                <div className="bg-[#181109]/90 border border-amber-800/60 rounded-2xl p-4 shadow-xl backdrop-blur-md font-medieval">
                  <div className="flex items-center justify-between border-b border-amber-900/60 pb-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <Bookmark className="w-4 h-4 text-amber-400" />
                      <span className="font-cinzel text-xs font-bold text-amber-200">
                        My Deck Quick Access
                      </span>
                    </div>
                    <span className="text-xs text-amber-400 font-bold">
                      {deck.length} Saved
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-300/70 font-marcellus">
                    Characters saved via "Save to Deck" appear in the My Deck section below.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Task 5: SECTION TITLED "MY DECK" WHICH IS ALWAYS VISIBLE */}
          <section
            id="my-deck-section"
            data-testid="my-deck-section"
            aria-label="My Deck"
            className="w-full mt-10 pt-6 border-t-2 border-amber-800/60"
          >
            <div className="bg-[#160f09]/95 border-2 border-amber-600/70 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-md">
              <div className="flex flex-wrap items-center justify-between border-b border-amber-800/60 pb-4 mb-6 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-950 border border-amber-500 flex items-center justify-center text-amber-400">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    {/* Explicitly titled "My Deck" */}
                    <h2 data-testid="my-deck-title" className="font-cinzel text-xl sm:text-2xl font-bold text-amber-200">
                      My Deck
                    </h2>
                    <p className="font-medieval text-xs text-amber-400/80">
                      Saved Characters ({deck.length} {deck.length === 1 ? 'Hero' : 'Heroes'})
                    </p>
                  </div>
                </div>

                {deck.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearDeck}
                    className="px-3 py-1.5 rounded-lg text-xs font-medieval bg-rose-950/70 hover:bg-rose-900 border border-rose-800/60 text-rose-300 hover:text-rose-100 transition cursor-pointer"
                  >
                    Clear All Saved
                  </button>
                )}
              </div>

              {/* The My Deck List container */}
              <div
                data-testid="my-deck-list"
                aria-label="My Deck list"
                className="w-full"
              >
                {deck.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-amber-900/60 rounded-xl bg-black/30">
                    <Bookmark className="w-10 h-10 text-amber-700 mx-auto mb-3" />
                    <h4 className="font-cinzel text-base text-amber-200 font-bold">
                      No characters saved to My Deck yet
                    </h4>
                    <p className="text-xs text-amber-400/70 mt-1 max-w-sm mx-auto font-marcellus">
                      Click the "Save to Deck" button on any bordered player card above to add them to your My Deck collection.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {deck.map((hero) => {
                      const elementCfg = ELEMENT_ICONS[hero.element] || ELEMENT_ICONS['Arcane'];
                      const heroHpPercent = Math.min(100, Math.round((hero.stats.hp / 250) * 100));
                      const heroManaPercent = Math.min(100, Math.round((hero.stats.mana / 220) * 100));
                      const heroStrPercent = Math.min(100, Math.round((hero.stats.strength / 160) * 100));

                      return (
                        <div
                          key={hero.id}
                          data-testid="my-deck-item"
                          className="relative rounded-xl p-4 bg-[#1a120b] border-2 border-amber-700/70 hover:border-amber-400 transition-all duration-300 shadow-lg flex flex-col justify-between text-[#ebd6b5]"
                        >
                          <div>
                            {/* Card Header: Character Name & Class */}
                            <div className="flex items-start justify-between gap-2 mb-2.5">
                              <div>
                                <h3 className="font-cinzel text-base font-bold text-amber-100 truncate">
                                  {hero.name}
                                </h3>
                                <div className="text-xs font-medieval text-amber-400 font-semibold uppercase">
                                  Class: {hero.className}
                                </div>
                              </div>
                              <span
                                className="px-2 py-0.5 rounded text-[11px] font-medieval border"
                                style={{ borderColor: elementCfg.color, color: elementCfg.color }}
                              >
                                {hero.element}
                              </span>
                            </div>

                            {/* Character Portrait & Details */}
                            <div className="flex gap-3 mb-3">
                              <div className="w-20 h-20 rounded-lg overflow-hidden border border-amber-600/70 shrink-0 bg-black/60 relative">
                                <img
                                  src={hero.portraitUrl}
                                  alt="Portrait Image"
                                  data-testid="portrait-image"
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              {/* Stats with Progress Bars: exact labels "Health", "Mana", "Strength" */}
                              <div className="flex-1 min-w-0 space-y-1.5 font-medieval text-[11px]">
                                {/* Health */}
                                <div>
                                  <div className="flex justify-between items-center text-rose-300">
                                    <span className="flex items-center gap-1 font-bold">
                                      <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                                      <span>Health</span>
                                    </span>
                                    <span>{hero.stats.hp}</span>
                                  </div>
                                  <div
                                    role="progressbar"
                                    aria-label="Health"
                                    aria-valuenow={hero.stats.hp}
                                    aria-valuemin={0}
                                    aria-valuemax={250}
                                    className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-rose-900/40"
                                  >
                                    <div
                                      className="h-full bg-gradient-to-r from-red-600 to-rose-400"
                                      style={{ width: `${heroHpPercent}%` }}
                                    />
                                  </div>
                                </div>

                                {/* Mana */}
                                <div>
                                  <div className="flex justify-between items-center text-cyan-300">
                                    <span className="flex items-center gap-1 font-bold">
                                      <Sparkles className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                                      <span>Mana</span>
                                    </span>
                                    <span>{hero.stats.mana}</span>
                                  </div>
                                  <div
                                    role="progressbar"
                                    aria-label="Mana"
                                    aria-valuenow={hero.stats.mana}
                                    aria-valuemin={0}
                                    aria-valuemax={220}
                                    className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-cyan-900/40"
                                  >
                                    <div
                                      className="h-full bg-gradient-to-r from-blue-600 to-cyan-400"
                                      style={{ width: `${heroManaPercent}%` }}
                                    />
                                  </div>
                                </div>

                                {/* Strength */}
                                <div>
                                  <div className="flex justify-between items-center text-amber-300">
                                    <span className="flex items-center gap-1 font-bold">
                                      <Sword className="w-3 h-3 text-amber-400" />
                                      <span>Strength</span>
                                    </span>
                                    <span>{hero.stats.strength}</span>
                                  </div>
                                  <div
                                    role="progressbar"
                                    aria-label="Strength"
                                    aria-valuenow={hero.stats.strength}
                                    aria-valuemin={0}
                                    aria-valuemax={160}
                                    className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-amber-900/40"
                                  >
                                    <div
                                      className="h-full bg-gradient-to-r from-amber-600 to-yellow-400"
                                      style={{ width: `${heroStrPercent}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Backstory text */}
                            <p className="text-xs font-marcellus text-amber-100/80 italic line-clamp-2 bg-black/35 p-2 rounded border border-amber-900/40 mb-3">
                              "{hero.backstory}"
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 pt-2 border-t border-amber-900/50">
                            <button
                              type="button"
                              onClick={() => {
                                setCharacter(hero);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                showToast(`Equipped ${hero.name} onto the workbench!`);
                              }}
                              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-amber-800/80 hover:bg-amber-700 text-amber-100 text-xs font-medieval font-semibold border border-amber-500/50 transition cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Equip Card</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRemoveFromDeck(hero.id)}
                              className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-400 hover:text-rose-200 border border-rose-900/60 transition cursor-pointer"
                              title="Remove from deck"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-amber-900/60 bg-[#0e0905]/90 py-3 px-4 text-center text-xs font-medieval text-amber-400/60">
          <span>Fantasy Character Generator • Ancient Alchemist's Transmutation Studio</span>
        </footer>
      </div>

      {/* Deck Drawer Component */}
      <DeckDrawer
        isOpen={isDeckOpen}
        onClose={() => setIsDeckOpen(false)}
        deck={deck}
        onSelectCharacter={(char) => {
          setCharacter(char);
          showToast(`Equipped ${char.name} onto the workbench!`);
        }}
        onRemoveCharacter={handleRemoveFromDeck}
        onClearDeck={handleClearDeck}
      />
    </div>
  );
}
