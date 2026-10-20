import React, { useState } from 'react';
import { Flame, Sparkles, Droplet, Dice5, Skull, Compass, BookOpen, Feather } from 'lucide-react';

interface WorkbenchPropsComponentProps {
  onRollDice: () => void;
  onBrewPotion: (type: 'hp' | 'mana' | 'str') => void;
  isTransmuting?: boolean;
}

export const WorkbenchPropsComponent: React.FC<WorkbenchPropsComponentProps> = ({
  onRollDice,
  onBrewPotion,
  isTransmuting = false,
}) => {
  const [flicker, setFlicker] = useState(true);

  return (
    <div className="flex flex-col gap-4 text-[#d8c29d] font-medieval">
      {/* Ancient Grimoire & Potion Rack */}
      <div className="bg-[#181109]/90 border-2 border-amber-800/70 rounded-2xl p-4 shadow-2xl backdrop-blur-md relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-amber-900/60 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500 animate-flame" />
            <h4 className="font-cinzel text-sm font-bold text-amber-200 uppercase tracking-wider">
              Alchemist's Apparatus
            </h4>
          </div>
          <span className="text-[10px] text-amber-400/60 uppercase tracking-widest font-medieval">
            Transmutation Lab
          </span>
        </div>

        {/* Potion Vials Rack */}
        <div className="space-y-2 mb-4">
          <div className="text-[11px] text-amber-400/80 uppercase tracking-wider font-semibold">
            Essence Philters (Click to Infuse)
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Health Potion */}
            <button
              type="button"
              onClick={() => onBrewPotion('hp')}
              className="group relative p-2.5 rounded-xl bg-gradient-to-b from-red-950/80 to-black/80 border border-red-700/60 hover:border-red-400 text-center transition cursor-pointer shadow-md hover:shadow-red-900/40 active:scale-95"
            >
              <div className="w-7 h-7 mx-auto mb-1 rounded-full bg-red-900/60 border border-red-500/80 flex items-center justify-center text-red-400 group-hover:scale-110 transition shadow-inner">
                <Droplet className="w-4 h-4 fill-red-500" />
              </div>
              <span className="text-[10px] text-red-200 block font-medieval">Ruby Vitriol</span>
              <span className="text-[9px] text-red-400/70 block">+HP Brew</span>
            </button>

            {/* Mana Potion */}
            <button
              type="button"
              onClick={() => onBrewPotion('mana')}
              className="group relative p-2.5 rounded-xl bg-gradient-to-b from-cyan-950/80 to-black/80 border border-cyan-700/60 hover:border-cyan-400 text-center transition cursor-pointer shadow-md hover:shadow-cyan-900/40 active:scale-95"
            >
              <div className="w-7 h-7 mx-auto mb-1 rounded-full bg-cyan-900/60 border border-cyan-500/80 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition shadow-inner">
                <Sparkles className="w-4 h-4 fill-cyan-400" />
              </div>
              <span className="text-[10px] text-cyan-200 block font-medieval">Aether Draught</span>
              <span className="text-[9px] text-cyan-400/70 block">+Mana Brew</span>
            </button>

            {/* Strength Potion */}
            <button
              type="button"
              onClick={() => onBrewPotion('str')}
              className="group relative p-2.5 rounded-xl bg-gradient-to-b from-amber-950/80 to-black/80 border border-amber-700/60 hover:border-amber-400 text-center transition cursor-pointer shadow-md hover:shadow-amber-900/40 active:scale-95"
            >
              <div className="w-7 h-7 mx-auto mb-1 rounded-full bg-amber-900/60 border border-amber-500/80 flex items-center justify-center text-amber-400 group-hover:scale-110 transition shadow-inner">
                <Flame className="w-4 h-4 fill-amber-500" />
              </div>
              <span className="text-[10px] text-amber-200 block font-medieval">Titan Elixir</span>
              <span className="text-[9px] text-amber-400/70 block">+Str Brew</span>
            </button>
          </div>
        </div>

        {/* Dice of Destiny / Re-roll Stat Mutations */}
        <div className="pt-2 border-t border-amber-900/50">
          <button
            type="button"
            onClick={onRollDice}
            disabled={isTransmuting}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-amber-900/50 hover:bg-amber-800/70 border border-amber-600/70 text-amber-200 hover:text-amber-100 text-xs font-medieval transition active:scale-98 shadow cursor-pointer disabled:opacity-50"
          >
            <Dice5 className={`w-4 h-4 text-amber-400 ${isTransmuting ? 'animate-spin' : ''}`} />
            <span>Cast Dice of Destiny (Mutate Stats)</span>
          </button>
        </div>
      </div>

      {/* Alchemical Notes Parchment */}
      <div className="parchment-bg border border-amber-800/60 rounded-2xl p-4 shadow-xl text-xs space-y-2 relative">
        <div className="flex items-center gap-2 text-amber-300 font-cinzel font-bold border-b border-amber-900/50 pb-1.5">
          <Feather className="w-3.5 h-3.5 text-amber-400" />
          <span>Alchemist's Codex</span>
        </div>
        <p className="text-amber-200/80 italic font-marcellus leading-relaxed">
          "By mingling brimstone, solar salt, and celestial quicksilver upon this ancient oak workbench, mortal souls receive divine classes and mythical traits."
        </p>
        <div className="flex items-center justify-between text-[11px] text-amber-400/60 pt-1 border-t border-amber-900/40 font-medieval">
          <span>Sigil: Aurum Vivum</span>
          <span>Element: Transmuted</span>
        </div>
      </div>
    </div>
  );
};
