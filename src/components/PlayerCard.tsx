import React from 'react';
import { Heart, Sparkles, Sword, Shield, Bookmark, BookmarkCheck, Wand2, ScrollText, RefreshCw } from 'lucide-react';
import { FantasyCharacter } from '../types/character';
import { CartoonPortrait } from './CartoonPortrait';
import { CLASS_CONFIG, ELEMENT_ICONS } from '../data/fantasyData';

interface PlayerCardProps {
  character: FantasyCharacter;
  onRegeneratePortrait: () => void;
  onGenerateBackstory: () => void;
  onSaveToDeck: () => void;
  isSaved: boolean;
  isGeneratingBackstory?: boolean;
  isRegeneratingPortrait?: boolean;
  isTransformExpanded?: boolean;
  onToggleTransform?: () => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  character,
  onRegeneratePortrait,
  onGenerateBackstory,
  onSaveToDeck,
  isSaved,
  isGeneratingBackstory = false,
  isRegeneratingPortrait = false,
  isTransformExpanded = false,
  onToggleTransform,
}) => {
  const classCfg = CLASS_CONFIG[character.className] || CLASS_CONFIG['Warrior'];
  const elementCfg = ELEMENT_ICONS[character.element] || ELEMENT_ICONS['Arcane'];

  // Stat percentage representations
  const hpPercent = Math.min(100, Math.round((character.stats.hp / 250) * 100));
  const manaPercent = Math.min(100, Math.round((character.stats.mana / 220) * 100));
  const strPercent = Math.min(100, Math.round((character.stats.strength / 160) * 100));

  return (
    <div
      data-testid="player-card"
      aria-label="Bordered Player Card"
      className={`bordered-player-card relative w-full max-w-md mx-auto transition-all duration-500 rounded-2xl p-4 sm:p-5 ${
        isTransformExpanded
          ? 'scale-102 ring-4 ring-amber-400/80 shadow-[0_0_50px_rgba(245,158,11,0.45)]'
          : 'shadow-[0_15px_35px_rgba(0,0,0,0.85)]'
      } bg-[#140f09] border-4 border-[#d4af37] text-[#f1dec1] card-foil overflow-hidden`}
    >
      {/* Corner Filigree Ornaments */}
      <div className="absolute top-1 left-1 w-6 h-6 border-t-2 border-l-2 border-amber-300 pointer-events-none" />
      <div className="absolute top-1 right-1 w-6 h-6 border-t-2 border-r-2 border-amber-300 pointer-events-none" />
      <div className="absolute bottom-1 left-1 w-6 h-6 border-b-2 border-l-2 border-amber-300 pointer-events-none" />
      <div className="absolute bottom-1 right-1 w-6 h-6 border-b-2 border-r-2 border-amber-300 pointer-events-none" />

      {/* Decorative Gold Header Bar */}
      <div className="flex items-center justify-between border-b border-amber-700/60 pb-2 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rotate-45 bg-amber-400 inline-block shadow-sm" />
          <span className="text-[11px] uppercase tracking-widest font-medieval text-amber-300/90">
            Player Card #{character.id.slice(-4)}
          </span>
        </div>

        {/* Element Badge */}
        <div
          className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-amber-500/30 text-xs font-medieval bg-gradient-to-r"
          style={{ borderColor: elementCfg.color, color: elementCfg.color }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: elementCfg.color }} />
          <span>{elementCfg.label}</span>
        </div>
      </div>

      {/* Character Name & Class */}
      <div className="text-center mb-3">
        <div className="text-[10px] uppercase tracking-widest font-medieval text-amber-400/70 mb-0.5">
          Character Name
        </div>
        <h2
          data-testid="character-name"
          className="font-cinzel text-2xl sm:text-3xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 drop-shadow-md"
        >
          {character.name}
        </h2>
        <div className="font-medieval text-sm text-amber-300/80 italic mt-0.5">
          {character.title}
        </div>
        <div className="inline-flex items-center gap-2 mt-1.5 px-3 py-1 rounded-md border border-amber-600/40 bg-black/40 text-xs font-medieval">
          <span data-testid="character-class" className="text-amber-400 font-bold uppercase tracking-wider">
            Class: {character.className}
          </span>
          <span className="text-amber-600">•</span>
          <span className="text-amber-300/80">{character.rarity} Hero</span>
        </div>
      </div>

      {/* Portrait Image container with cartoon art and Regenerate feature */}
      <div className="mb-4" data-testid="portrait-container">
        <CartoonPortrait
          characterClass={character.className}
          element={character.element}
          rarity={character.rarity}
          seed={character.avatarSeed}
          portraitUrl={character.portraitUrl}
          onRegenerate={onRegeneratePortrait}
          isRegenerating={isRegeneratingPortrait}
        />
      </div>

      {/* Stats section with labels exactly "Health", "Mana", "Strength" with progress bars */}
      <div
        data-testid="stats-section"
        aria-label="Stats"
        className="bg-[#1c150c]/90 rounded-xl p-3 border border-amber-800/60 mb-3 shadow-inner space-y-3"
      >
        <div className="flex items-center justify-between text-xs font-medieval text-amber-200 border-b border-amber-900/50 pb-1">
          <span className="flex items-center gap-1 text-amber-400 uppercase tracking-wider font-bold">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            Stats
          </span>
          <span className="text-[10px] text-amber-400/60">Power: {character.stats.hp + character.stats.mana + character.stats.strength}</span>
        </div>

        {/* Health Stat with Progress Bar - label exactly "Health" */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs font-medieval">
            <span className="flex items-center gap-1.5 text-rose-300 font-bold">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 drop-shadow" />
              <span>Health</span>
            </span>
            <span className="font-bold text-rose-200">
              {character.stats.hp} <span className="text-rose-400/60 font-normal">/ 250</span>
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="Health"
            aria-valuenow={character.stats.hp}
            aria-valuemin={0}
            aria-valuemax={250}
            className="w-full h-3 bg-black/70 rounded-full overflow-hidden border border-rose-900/50 p-0.5"
          >
            <div
              className="h-full bg-gradient-to-r from-red-700 via-rose-500 to-rose-400 rounded-full transition-all duration-500"
              style={{ width: `${hpPercent}%` }}
            />
          </div>
          <progress aria-label="Health" value={character.stats.hp} max={250} className="sr-only">
            {character.stats.hp}
          </progress>
        </div>

        {/* Mana Stat with Progress Bar - label exactly "Mana" */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs font-medieval">
            <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <Sparkles className="w-4 h-4 text-cyan-400 fill-cyan-400 drop-shadow" />
              <span>Mana</span>
            </span>
            <span className="font-bold text-cyan-200">
              {character.stats.mana} <span className="text-cyan-400/60 font-normal">/ 220</span>
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="Mana"
            aria-valuenow={character.stats.mana}
            aria-valuemin={0}
            aria-valuemax={220}
            className="w-full h-3 bg-black/70 rounded-full overflow-hidden border border-cyan-900/50 p-0.5"
          >
            <div
              className="h-full bg-gradient-to-r from-blue-700 via-cyan-500 to-sky-300 rounded-full transition-all duration-500"
              style={{ width: `${manaPercent}%` }}
            />
          </div>
          <progress aria-label="Mana" value={character.stats.mana} max={220} className="sr-only">
            {character.stats.mana}
          </progress>
        </div>

        {/* Strength Stat with Progress Bar - label exactly "Strength" */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs font-medieval">
            <span className="flex items-center gap-1.5 text-amber-300 font-bold">
              <Sword className="w-4 h-4 text-amber-400 drop-shadow" />
              <span>Strength</span>
            </span>
            <span className="font-bold text-amber-200">
              {character.stats.strength} <span className="text-amber-400/60 font-normal">/ 160</span>
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="Strength"
            aria-valuenow={character.stats.strength}
            aria-valuemin={0}
            aria-valuemax={160}
            className="w-full h-3 bg-black/70 rounded-full overflow-hidden border border-amber-900/50 p-0.5"
          >
            <div
              className="h-full bg-gradient-to-r from-amber-700 via-amber-500 to-yellow-300 rounded-full transition-all duration-500"
              style={{ width: `${strPercent}%` }}
            />
          </div>
          <progress aria-label="Strength" value={character.stats.strength} max={160} className="sr-only">
            {character.stats.strength}
          </progress>
        </div>
      </div>

      {/* Special Ability & Signature Weapon */}
      <div className="bg-[#181109] rounded-xl p-3 border border-amber-900/60 mb-3 space-y-1.5 text-xs font-marcellus">
        <div className="flex items-center justify-between text-amber-300">
          <div className="flex items-center gap-1.5 font-medieval font-bold text-amber-200">
            <Wand2 className="w-3.5 h-3.5 text-amber-400" />
            <span>{character.specialAbility.name}</span>
          </div>
          <span className="text-[11px] font-medieval px-1.5 py-0.5 rounded bg-blue-950/80 border border-blue-600/50 text-blue-300">
            {character.specialAbility.manaCost} Mana
          </span>
        </div>
        <p className="text-[12px] text-amber-200/80 italic leading-relaxed">
          {character.specialAbility.description}
        </p>
        <div className="text-[11px] text-amber-400/70 pt-1 border-t border-amber-900/40 flex items-center justify-between">
          <span className="text-amber-500/90 font-medieval">Weapon:</span>
          <span className="font-medieval text-amber-300">{character.signatureWeapon}</span>
        </div>
      </div>

      {/* Backstory Section with Generate Backstory Button (Task 4) */}
      <div
        data-testid="backstory-container"
        className="parchment-bg rounded-xl p-3.5 border border-amber-700/60 mb-4 relative shadow-md"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-1.5 text-xs font-medieval font-bold text-amber-300 uppercase tracking-wide">
            <ScrollText className="w-4 h-4 text-amber-400" />
            Origin Story
          </span>

          {/* Button with exact text "Generate Backstory" */}
          <button
            type="button"
            data-testid="generate-backstory-btn"
            aria-label="Generate Backstory"
            onClick={onGenerateBackstory}
            disabled={isGeneratingBackstory}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-amber-900 to-amber-800 hover:from-amber-800 hover:to-amber-700 border border-amber-500/70 text-amber-100 text-xs font-medieval font-semibold transition active:scale-95 cursor-pointer shadow-sm disabled:opacity-60"
            title="Generate unique 1-2 sentence origin story"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isGeneratingBackstory ? 'animate-spin' : ''}`} />
            <span>Generate Backstory</span>
          </button>
        </div>

        {/* 1-2 sentence origin story displayed on card */}
        <p
          data-testid="character-backstory"
          className="text-xs sm:text-sm font-marcellus text-amber-100/95 leading-relaxed italic relative min-h-[44px] bg-black/25 p-2 rounded border border-amber-900/30"
        >
          {isGeneratingBackstory ? (
            <span className="inline-flex items-center gap-2 text-amber-300 font-medieval text-xs">
              <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
              Transmuting origin story...
            </span>
          ) : (
            `"${character.backstory}"`
          )}
        </p>
      </div>

      {/* Primary Actions: Button exactly labeled "Save to Deck" */}
      <div className="flex items-center gap-2 pt-1">
        {/* Button EXACTLY labeled "Save to Deck" */}
        <button
          type="button"
          data-testid="save-to-deck-btn"
          aria-label="Save to Deck"
          onClick={onSaveToDeck}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medieval text-sm font-bold border transition-all duration-300 cursor-pointer shadow-lg active:scale-98 ${
            isSaved
              ? 'bg-emerald-900/90 border-emerald-400 text-emerald-100 shadow-emerald-900/30'
              : 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-amber-950 border-amber-200 shadow-amber-900/40 hover:shadow-amber-500/30'
          }`}
        >
          {isSaved ? <BookmarkCheck className="w-4 h-4 text-emerald-300" /> : <Bookmark className="w-4 h-4 fill-amber-950" />}
          <span>Save to Deck</span>
        </button>

        {/* Transform UI Mode Toggle */}
        {onToggleTransform && (
          <button
            type="button"
            onClick={onToggleTransform}
            className="p-2.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-600/60 text-amber-300 hover:text-amber-100 transition cursor-pointer"
            title={isTransformExpanded ? 'Return to Workbench' : 'Inspect Bordered Player Card'}
          >
            <Sparkles className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
