import React, { useState } from 'react';
import { Sparkles, RefreshCw, Eye, Shield, Zap, Flame, Droplets, Sun, Moon } from 'lucide-react';
import { CharacterClass, ElementalAffinity, CardRarity } from '../types/character';

interface CartoonPortraitProps {
  characterClass: CharacterClass;
  element: ElementalAffinity;
  rarity: CardRarity;
  seed: number;
  portraitUrl: string;
  onRegenerate: () => void;
  isRegenerating?: boolean;
}

export const CartoonPortrait: React.FC<CartoonPortraitProps> = ({
  characterClass,
  element,
  rarity,
  seed,
  portraitUrl,
  onRegenerate,
  isRegenerating = false,
}) => {
  const [useProceduralCartoon, setUseProceduralCartoon] = useState<boolean>(false);

  // Deterministic variants derived from seed
  const variantIndex = Math.abs(seed) % 6;
  const expressionIndex = Math.abs(seed * 7) % 4; // 0: confident, 1: fierce, 2: mystic/calm, 3: playful grin
  const auraGlowColor =
    element === 'Flame'
      ? '#f97316'
      : element === 'Frost'
      ? '#38bdf8'
      : element === 'Arcane'
      ? '#a855f7'
      : element === 'Shadow'
      ? '#10b981'
      : element === 'Radiant'
      ? '#eab308'
      : '#22c55e';

  return (
    <div className="relative group w-full aspect-square rounded-xl overflow-hidden border-2 border-amber-600/50 bg-[#16100a] shadow-inner">
      {/* Background magical aura canvas */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${auraGlowColor} 0%, transparent 75%)`,
        }}
      />

      {/* Portrait display: Generated Master Art or Procedural Cartoon Avatar */}
      {!useProceduralCartoon && portraitUrl ? (
        <div className="relative w-full h-full">
          <img
            src={portraitUrl}
            alt="Portrait Image"
            aria-label="Portrait Image"
            data-testid="portrait-image"
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              isRegenerating ? 'filter blur-sm scale-95 opacity-70' : 'filter none'
            }`}
          />
          {/* Subtle stylized cartoon vignette / comic rim lighting */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
        </div>
      ) : (
        /* Dynamic SVG Cartoon Video Game Avatar */
        <div className="w-full h-full flex items-center justify-center p-3 relative bg-gradient-to-b from-[#241910] to-[#0f0b07]">
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full drop-shadow-xl"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id={`grad-${seed}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={auraGlowColor} stopOpacity="0.8" />
                <stop offset="100%" stopColor="#1e130c" stopOpacity="0.9" />
              </linearGradient>
              <radialGradient id={`glow-${seed}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={auraGlowColor} stopOpacity="0.7" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Glowing Backdrop Runes */}
            <circle cx="100" cy="100" r="85" fill={`url(#glow-${seed})`} />
            <circle cx="100" cy="100" r="78" stroke={auraGlowColor} strokeWidth="1.5" strokeDasharray="6 4" fill="none" opacity="0.6" />

            {/* Character Base & Cloak / Armor */}
            {characterClass === 'Warrior' || characterClass === 'Paladin' ? (
              <g>
                {/* Heavy Pauldrons */}
                <path d="M 40 180 Q 100 130 160 180 L 175 200 L 25 200 Z" fill="#3a4454" stroke="#eab308" strokeWidth="2" />
                <path d="M 60 145 L 35 175 L 85 185 Z" fill="#64748b" stroke="#f59e0b" strokeWidth="2" />
                <path d="M 140 145 L 165 175 L 115 185 Z" fill="#64748b" stroke="#f59e0b" strokeWidth="2" />
                {/* Steel Neckpiece */}
                <path d="M 75 130 L 125 130 L 115 160 L 85 160 Z" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
                {/* Head / Helmet */}
                <path d="M 65 65 Q 100 40 135 65 L 140 115 Q 100 140 60 115 Z" fill="#1e293b" stroke="#d4af37" strokeWidth="3" />
                {/* Glowing Visor T-slit */}
                <path d="M 80 88 L 120 88" stroke={auraGlowColor} strokeWidth="5" strokeLinecap="round" />
                <path d="M 100 88 L 100 115" stroke={auraGlowColor} strokeWidth="5" strokeLinecap="round" />
                {/* Plume Crest */}
                <path d="M 95 45 C 90 20, 110 10, 125 25 C 115 35, 110 40, 105 45 Z" fill="#ef4444" />
              </g>
            ) : characterClass === 'Mage' || characterClass === 'Necromancer' ? (
              <g>
                {/* Flowing Arcane Robe */}
                <path d="M 45 190 Q 100 145 155 190 L 175 200 L 25 200 Z" fill="#2e1065" stroke="#a855f7" strokeWidth="2" />
                {/* Cowl / Wizard Hood */}
                <path d="M 50 85 Q 100 20 150 85 Q 160 135 100 145 Q 40 135 50 85 Z" fill="#3b0764" stroke="#d8b4fe" strokeWidth="2.5" />
                {/* Face shadow */}
                <ellipse cx="100" cy="98" rx="36" ry="32" fill="#090514" />
                {/* Glowing mystical eyes */}
                <ellipse cx="86" cy="95" rx="6" ry="4" fill="#67e8f9" filter="drop-shadow(0 0 5px #38bdf8)" />
                <ellipse cx="114" cy="95" rx="6" ry="4" fill="#67e8f9" filter="drop-shadow(0 0 5px #38bdf8)" />
                {/* Arcane Forehead Gem */}
                <polygon points="100,68 106,76 100,84 94,76" fill={auraGlowColor} stroke="#fff" strokeWidth="1" />
                {/* Floating energy sparks */}
                <circle cx="55" cy="55" r="3" fill="#38bdf8" />
                <circle cx="150" cy="65" r="4" fill="#d946ef" />
              </g>
            ) : characterClass === 'Rogue' || characterClass === 'Ranger' ? (
              <g>
                {/* Leather Collar and Strap */}
                <path d="M 50 185 Q 100 140 150 185 L 170 200 L 30 200 Z" fill="#14532d" stroke="#22c55e" strokeWidth="2" />
                <path d="M 60 145 L 140 185" stroke="#78350f" strokeWidth="6" strokeLinecap="round" />
                {/* Leather Bandit Hood */}
                <path d="M 60 70 Q 100 35 140 70 Q 150 115 100 135 Q 50 115 60 70 Z" fill="#1b2e1b" stroke="#15803d" strokeWidth="2.5" />
                {/* Mask over lower face */}
                <path d="M 72 95 Q 100 115 128 95 L 125 120 Q 100 135 75 120 Z" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
                {/* Piercing cunning eyes */}
                <ellipse cx="85" cy="85" rx="7" ry="4" fill="#22c55e" />
                <ellipse cx="115" cy="85" rx="7" ry="4" fill="#22c55e" />
                <circle cx="87" cy="85" r="2" fill="#fff" />
                <circle cx="117" cy="85" r="2" fill="#fff" />
                {/* Sleek Dagger in Foreground */}
                <path d="M 140 110 L 175 130 L 165 145 Z" fill="#cbd5e1" stroke="#22c55e" strokeWidth="1" />
              </g>
            ) : (
              /* Cleric */
              <g>
                {/* Sun Halo */}
                <circle cx="100" cy="85" r="50" stroke="#facc15" strokeWidth="3" strokeDasharray="4 6" fill="none" />
                {/* Holy Vestment */}
                <path d="M 45 185 Q 100 140 155 185 L 175 200 L 25 200 Z" fill="#fef3c7" stroke="#eab308" strokeWidth="2" />
                {/* Gold Solar Stole */}
                <path d="M 85 140 L 85 195 L 95 195 L 95 140 Z" fill="#ca8a04" />
                <path d="M 105 140 L 105 195 L 115 195 L 115 140 Z" fill="#ca8a04" />
                {/* Head & Radiant Diadem */}
                <ellipse cx="100" cy="90" rx="34" ry="38" fill="#fde68a" stroke="#ca8a04" strokeWidth="2" />
                {/* Gentle bright eyes */}
                <circle cx="88" cy="88" r="4.5" fill="#1e3a8a" />
                <circle cx="112" cy="88" r="4.5" fill="#1e3a8a" />
                <circle cx="89" cy="86" r="1.5" fill="#fff" />
                <circle cx="113" cy="86" r="1.5" fill="#fff" />
                {/* Benevolent smile */}
                <path d="M 94 105 Q 100 112 106 105" stroke="#92400e" strokeWidth="2" strokeLinecap="round" fill="none" />
                {/* Sunburst Crest */}
                <polygon points="100,48 103,58 113,60 104,67 107,77 100,71 93,77 96,67 87,60 97,58" fill="#eab308" />
              </g>
            )}
          </svg>
        </div>
      )}

      {/* Rarity & Element Ribbon in Top Corner */}
      <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-amber-500/40 text-[11px] font-medieval text-amber-200">
        <Sparkles className="w-3 h-3 text-amber-400" />
        <span>{rarity}</span>
      </div>

      {/* Switch Style Toggle (Master Art vs Dynamic Vector) */}
      <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
        <button
          type="button"
          onClick={() => setUseProceduralCartoon(!useProceduralCartoon)}
          title={useProceduralCartoon ? 'Switch to Master Art' : 'Switch to Cartoon Chibi Vector'}
          className="p-1 rounded-md bg-black/75 backdrop-blur-md border border-amber-600/50 text-amber-300 hover:text-amber-100 hover:border-amber-400 transition"
        >
          <Zap className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Floating Regenerate Portrait button in overlay bottom */}
      <div className="absolute bottom-2 inset-x-2 z-10 flex justify-between items-center bg-black/80 backdrop-blur-md p-1.5 rounded-lg border border-amber-700/60 shadow-lg">
        <div className="flex items-center gap-1 text-[11px] text-amber-300 font-medieval truncate px-1">
          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: auraGlowColor }} />
          <span className="truncate">Style: {useProceduralCartoon ? 'Vector Chibi' : 'Illustrated RPG'}</span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRegenerate();
          }}
          disabled={isRegenerating}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-amber-100 text-xs font-medieval font-semibold border border-amber-400/50 shadow-md active:scale-95 transition cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
          <span>Regenerate Portrait</span>
        </button>
      </div>

      {/* Regenerating Magic Rune Overlay */}
      {isRegenerating && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-20">
          <div className="w-12 h-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
          </div>
          <span className="font-medieval text-xs text-amber-200 tracking-wider">Transmuting Form...</span>
        </div>
      )}
    </div>
  );
};
