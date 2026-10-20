import React, { useState } from 'react';
import { X, Trash2, Eye, Shield, Heart, Sparkles, Sword, Download, BookOpen, Layers, Filter } from 'lucide-react';
import { FantasyCharacter, CharacterClass } from '../types/character';
import { ELEMENT_ICONS } from '../data/fantasyData';

interface DeckDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  deck: FantasyCharacter[];
  onSelectCharacter: (char: FantasyCharacter) => void;
  onRemoveCharacter: (id: string) => void;
  onClearDeck: () => void;
}

export const DeckDrawer: React.FC<DeckDrawerProps> = ({
  isOpen,
  onClose,
  deck,
  onSelectCharacter,
  onRemoveCharacter,
  onClearDeck,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [previewChar, setPreviewChar] = useState<FantasyCharacter | null>(null);

  if (!isOpen) return null;

  const filteredDeck = selectedFilter === 'All'
    ? deck
    : deck.filter((c) => c.className === selectedFilter);

  const classesList = ['All', 'Mage', 'Rogue', 'Warrior', 'Cleric', 'Paladin', 'Ranger', 'Necromancer'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm transition-all duration-300">
      <div className="w-full max-w-2xl h-full bg-[#120d08] border-l-2 border-amber-600/70 shadow-2xl flex flex-col text-[#ebd6b5] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-amber-800/60 bg-[#1a120b] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-cinzel text-xl font-bold text-amber-200">My Character Deck</h3>
              <p className="text-xs font-medieval text-amber-400/70">
                {deck.length} {deck.length === 1 ? 'Hero' : 'Heroes'} sealed in the Alchemical Vault
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {deck.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to release all saved heroes from your deck?')) {
                    onClearDeck();
                  }
                }}
                className="px-2.5 py-1 text-xs font-medieval text-rose-300 hover:text-rose-100 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 rounded transition cursor-pointer"
              >
                Clear Deck
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-700/60 text-amber-300 hover:text-amber-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="p-3 bg-[#160f09] border-b border-amber-900/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-medieval text-amber-500 flex items-center gap-1 px-1">
            <Filter className="w-3 h-3" /> Class:
          </span>
          {classesList.map((cls) => {
            const count = cls === 'All' ? deck.length : deck.filter(c => c.className === cls).length;
            return (
              <button
                key={cls}
                type="button"
                onClick={() => setSelectedFilter(cls)}
                className={`px-2.5 py-1 rounded-md text-xs font-medieval whitespace-nowrap transition cursor-pointer ${
                  selectedFilter === cls
                    ? 'bg-amber-600 text-amber-950 font-bold border border-amber-400'
                    : 'bg-black/40 text-amber-300/80 hover:bg-amber-950/60 border border-amber-900/50'
                }`}
              >
                {cls} {count > 0 && <span className="opacity-70 text-[10px]">({count})</span>}
              </button>
            );
          })}
        </div>

        {/* Card List / Grid */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredDeck.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-amber-900/60 rounded-xl bg-black/20">
              <BookOpen className="w-10 h-10 text-amber-700 mb-2 animate-pulse" />
              <p className="font-medieval text-sm text-amber-300">
                {deck.length === 0
                  ? 'Your deck is empty.'
                  : `No ${selectedFilter} heroes found in your deck.`}
              </p>
              <p className="text-xs text-amber-500/80 mt-1 max-w-xs font-marcellus">
                Generate fantasy characters on the workbench and click "Save to Deck" to seal them here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredDeck.map((char) => {
                const elementCfg = ELEMENT_ICONS[char.element] || ELEMENT_ICONS['Arcane'];
                return (
                  <div
                    key={char.id}
                    className="relative group rounded-xl p-3 bg-[#18110a] border-2 border-amber-700/60 hover:border-amber-400 transition-all duration-300 shadow-md hover:shadow-amber-900/40 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top mini header */}
                      <div className="flex items-center justify-between text-[11px] font-medieval mb-2">
                        <span className="text-amber-400 font-bold uppercase">{char.className}</span>
                        <span
                          className="px-1.5 py-0.2 rounded border text-[10px]"
                          style={{ borderColor: elementCfg.color, color: elementCfg.color }}
                        >
                          {char.element}
                        </span>
                      </div>

                      {/* Character image and details */}
                      <div className="flex gap-3 mb-2">
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-amber-600/60 shrink-0 bg-black/60 relative">
                          <img
                            src={char.portraitUrl}
                            alt={char.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-cinzel text-sm font-bold text-amber-100 truncate">
                            {char.name}
                          </h4>
                          <div className="font-medieval text-[11px] text-amber-400/80 truncate">
                            {char.title}
                          </div>
                          <div className="flex items-center gap-2 mt-1.5 text-[11px] font-medieval">
                            <span className="flex items-center gap-0.5 text-rose-300">
                              <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                              {char.stats.hp}
                            </span>
                            <span className="flex items-center gap-0.5 text-cyan-300">
                              <Sparkles className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                              {char.stats.mana}
                            </span>
                            <span className="flex items-center gap-0.5 text-amber-300">
                              <Sword className="w-3 h-3 text-amber-400" />
                              {char.stats.strength}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Backstory Snippet */}
                      <p className="text-[11px] font-marcellus text-amber-200/80 line-clamp-2 italic mb-3 bg-black/30 p-1.5 rounded border border-amber-900/40">
                        "{char.backstory}"
                      </p>
                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-amber-900/50 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectCharacter(char);
                          onClose();
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-amber-800/80 hover:bg-amber-700 text-amber-100 text-xs font-medieval font-semibold border border-amber-500/50 transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Equip on Bench</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onRemoveCharacter(char.id)}
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

        {/* Footer info */}
        <div className="p-3 bg-[#140e08] border-t border-amber-800/60 text-center text-xs font-medieval text-amber-400/60">
          Saved characters persist across arcane sessions.
        </div>
      </div>
    </div>
  );
};
