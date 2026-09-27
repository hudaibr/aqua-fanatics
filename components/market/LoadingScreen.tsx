'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { easeOutCubic } from '@/lib/animations';

interface LoadingScreenProps {
  progress: number;
  isReady: boolean;
  onEnter: () => void;
}

export function LoadingScreen({ progress, isReady, onEnter }: LoadingScreenProps) {
  return (
    <AnimatePresence mode="wait">
      {!isReady ? (
        <motion.div
          key="loading"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: easeOutCubic }}
        >
          <OceanScene />
          <div className="relative z-10 flex flex-col items-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: easeOutCubic }}
              className="text-xs font-medium uppercase tracking-[0.4em] text-[#F0C896]"
            >
              The Morning Catch
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: easeOutCubic }}
              className="mt-6 text-4xl font-light tracking-tight text-[#F5F2EA] drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] sm:text-5xl"
            >
              Fresh from the sea.
            </motion.h1>

            <div className="mt-12 w-64">
              <div className="mb-3 flex justify-between text-[10px] uppercase tracking-[0.2em] text-[#F5F2EA]/40">
                <span>Preparing today&apos;s market</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-[2px] w-full overflow-hidden bg-[#F5F2EA]/10">
                <motion.div
                  className="h-full bg-[#527C78]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="ready"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: easeOutCubic }}
        >
          <OceanScene />
          <div className="relative z-10 flex flex-col items-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: easeOutCubic }}
              className="text-xs font-medium uppercase tracking-[0.4em] text-[#F0C896]"
            >
              The Morning Catch
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: easeOutCubic }}
              className="mt-6 text-center text-4xl font-light tracking-tight text-[#F5F2EA] drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] sm:text-6xl"
            >
              Fresh from the sea.
              <br />
              Prepared for your table.
            </motion.h1>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: easeOutCubic }}
              onClick={onEnter}
              className="mt-12 border border-[#F5F2EA]/30 px-10 py-4 text-xs font-medium uppercase tracking-[0.3em] text-[#F5F2EA] transition-colors hover:border-[#F5F2EA] hover:bg-[#F5F2EA]/5"
            >
              Enter the Market
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function OceanScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Sky gradient — dawn over the ocean */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #0D1B2A 0%, #1B3A4B 25%, #2A5F6E 45%, #3A8B9A 55%, #4FA8B8 62%, #5FC4D0 68%, #7DD5DC 72%, #A8E2E0 76%)',
        }}
      />

      {/* Sun glow — top right corner */}
      <div
        className="absolute right-[5%] top-[5%] h-[280px] w-[280px] rounded-full"
        style={{
          background:
            'radial-gradient(circle at center, rgba(255,225,170,0.45) 0%, rgba(255,210,140,0.15) 40%, transparent 70%)',
        }}
      />

      {/* Light rays — from top right corner */}
      <div
        className="absolute right-0 top-0 h-[80%] w-[70%] opacity-25"
        style={{
          background:
            'conic-gradient(from 180deg at 100% 0%, transparent 0deg, rgba(255,230,180,0.3) 8deg, transparent 14deg, transparent 22deg, rgba(255,230,180,0.2) 28deg, transparent 34deg, transparent 45deg, rgba(255,230,180,0.25) 52deg, transparent 58deg, transparent 70deg, rgba(255,230,180,0.15) 78deg, transparent 84deg, transparent 360deg)',
        }}
      />

      {/* Distant ocean layer — far horizon with depth gradient */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '45%',
          background:
            'linear-gradient(180deg, #2E7A88 0%, #3A8B9A 8%, #4FA8B8 18%, #5FBFC8 30%, #6FCDD0 45%, #8AD5D8 65%, #A8E2E0 100%)',
        }}
      />

      {/* Wave layer 1 — far, gentle swell with surface ripples */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '38%' }}>
        <svg
          viewBox="0 0 2880 200"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 w-[200%] h-full"
          style={{ animation: 'wave-drift-slow 25s linear infinite' }}
        >
          {/* Deep water body */}
          <path
            d="M0,60 C200,80 400,40 720,60 C1000,80 1200,50 1440,70 C1640,80 1840,40 2160,60 C2440,80 2640,50 2880,70 L2880,200 L0,200 Z"
            fill="rgba(70,160,175,0.55)"
          />
          {/* Surface highlight — lighter crest line */}
          <path
            d="M0,62 C200,82 400,42 720,62 C1000,82 1200,52 1440,72 C1640,82 1840,42 2160,62 C2440,82 2640,52 2880,72"
            fill="none"
            stroke="rgba(180,230,235,0.35)"
            strokeWidth="1.5"
          />
          {/* Secondary ripple line */}
          <path
            d="M0,75 C180,90 380,55 720,75 C1000,90 1200,65 1440,82 C1620,90 1820,55 2160,75 C2440,90 2640,65 2880,82"
            fill="none"
            stroke="rgba(150,210,220,0.2)"
            strokeWidth="1"
          />
          {/* Tiny surface ripples */}
          <path d="M120,68 Q140,64 160,68 Q180,72 200,68" fill="none" stroke="rgba(200,240,245,0.25)" strokeWidth="0.8" />
          <path d="M520,65 Q545,60 570,65 Q595,70 620,65" fill="none" stroke="rgba(200,240,245,0.2)" strokeWidth="0.8" />
          <path d="M980,72 Q1005,67 1030,72 Q1055,77 1080,72" fill="none" stroke="rgba(200,240,245,0.2)" strokeWidth="0.8" />
          <path d="M1500,68 Q1525,63 1550,68 Q1575,73 1600,68" fill="none" stroke="rgba(200,240,245,0.25)" strokeWidth="0.8" />
          <path d="M2100,65 Q2125,60 2150,65 Q2175,70 2200,65" fill="none" stroke="rgba(200,240,245,0.2)" strokeWidth="0.8" />
          <path d="M2500,70 Q2525,65 2550,70 Q2575,75 2600,70" fill="none" stroke="rgba(200,240,245,0.2)" strokeWidth="0.8" />
        </svg>
      </div>

      {/* Wave layer 2 — mid, with crest highlights and foam */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '30%' }}>
        <svg
          viewBox="0 0 2880 200"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 w-[200%] h-full"
          style={{ animation: 'wave-drift-medium 18s linear infinite' }}
        >
          {/* Water body */}
          <path
            d="M0,80 C150,50 350,100 500,70 C650,40 850,90 1000,60 C1150,30 1300,80 1440,50 C1590,50 1790,100 1940,70 C2090,40 2290,90 2440,60 C2590,30 2740,80 2880,50 L2880,200 L0,200 Z"
            fill="rgba(100,200,210,0.6)"
          />
          {/* Crest highlight */}
          <path
            d="M0,82 C150,52 350,102 500,72 C650,42 850,92 1000,62 C1150,32 1300,82 1440,52 C1590,52 1790,102 1940,72 C2090,42 2290,92 2440,62 C2590,32 2740,82 2880,52"
            fill="none"
            stroke="rgba(200,245,248,0.4)"
            strokeWidth="2"
          />
          {/* Foam dots on crests */}
          <circle cx="250" cy="55" r="2" fill="rgba(240,250,250,0.6)" />
          <circle cx="480" cy="68" r="1.5" fill="rgba(240,250,250,0.5)" />
          <circle cx="920" cy="58" r="2" fill="rgba(240,250,250,0.6)" />
          <circle cx="1180" cy="35" r="1.5" fill="rgba(240,250,250,0.5)" />
          <circle cx="1750" cy="55" r="2" fill="rgba(240,250,250,0.6)" />
          <circle cx="2200" cy="45" r="1.5" fill="rgba(240,250,250,0.5)" />
          <circle cx="2650" cy="35" r="2" fill="rgba(240,250,250,0.6)" />
          {/* Underwater shadow line */}
          <path
            d="M0,95 C150,65 350,115 500,85 C650,55 850,105 1000,75 C1150,45 1300,95 1440,65 C1590,65 1790,115 1940,85 C2090,55 2290,105 2440,75 C2590,45 2740,95 2880,65"
            fill="none"
            stroke="rgba(60,140,155,0.25)"
            strokeWidth="1.5"
          />
          {/* Surface ripples */}
          <path d="M80,90 Q100,86 120,90 Q140,94 160,90" fill="none" stroke="rgba(210,245,248,0.3)" strokeWidth="0.8" />
          <path d="M580,85 Q605,80 630,85 Q655,90 680,85" fill="none" stroke="rgba(210,245,248,0.25)" strokeWidth="0.8" />
          <path d="M1080,80 Q1105,75 1130,80 Q1155,85 1180,80" fill="none" stroke="rgba(210,245,248,0.25)" strokeWidth="0.8" />
          <path d="M1600,88 Q1625,83 1650,88 Q1675,93 1700,88" fill="none" stroke="rgba(210,245,248,0.3)" strokeWidth="0.8" />
          <path d="M2250,82 Q2275,77 2300,82 Q2325,87 2350,82" fill="none" stroke="rgba(210,245,248,0.25)" strokeWidth="0.8" />
        </svg>
      </div>

      {/* Wave layer 3 — mid-foreground, rolling with foam crests */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '26%' }}>
        <svg
          viewBox="0 0 2880 200"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 w-[200%] h-full"
          style={{ animation: 'wave-drift-medium-rev 15s linear infinite' }}
        >
          <path
            d="M0,90 C120,60 280,110 400,75 C520,40 680,95 800,55 C920,25 1080,80 1200,45 C1320,20 1480,75 1600,40 C1720,15 1880,70 2000,35 C2120,10 2280,65 2400,30 C2520,10 2680,60 2880,30 L2880,200 L0,200 Z"
            fill="rgba(130,220,228,0.55)"
          />
          {/* Foam crest line */}
          <path
            d="M0,92 C120,62 280,112 400,77 C520,42 680,97 800,57 C920,27 1080,82 1200,47 C1320,22 1480,77 1600,42 C1720,17 1880,72 2000,37 C2120,12 2280,67 2400,32 C2520,12 2680,62 2880,32"
            fill="none"
            stroke="rgba(240,252,252,0.5)"
            strokeWidth="2.5"
          />
          {/* Foam patches */}
          <ellipse cx="200" cy="70" rx="15" ry="3" fill="rgba(245,252,252,0.4)" />
          <ellipse cx="600" cy="60" rx="12" ry="2.5" fill="rgba(245,252,252,0.35)" />
          <ellipse cx="1050" cy="55" rx="18" ry="3" fill="rgba(245,252,252,0.4)" />
          <ellipse cx="1500" cy="50" rx="14" ry="2.5" fill="rgba(245,252,252,0.35)" />
          <ellipse cx="1950" cy="45" rx="16" ry="3" fill="rgba(245,252,252,0.4)" />
          <ellipse cx="2400" cy="40" rx="13" ry="2.5" fill="rgba(245,252,252,0.35)" />
          <ellipse cx="2750" cy="38" rx="15" ry="3" fill="rgba(245,252,252,0.4)" />
        </svg>
      </div>

      {/* Foam line — where waves meet sand, with detailed foam texture */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '22%' }}>
        <svg
          viewBox="0 0 2880 120"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 w-[200%] h-full"
          style={{ animation: 'wave-drift-fast 12s linear infinite' }}
        >
          {/* Main foam body */}
          <path
            d="M0,40 C100,20 200,50 300,30 C400,10 500,45 600,25 C700,5 800,40 900,20 C1000,0 1100,35 1200,15 C1300,-5 1400,30 1500,10 C1600,-5 1700,35 1800,15 C1900,0 2000,40 2100,20 C2200,5 2300,35 2400,15 C2500,0 2600,30 2700,10 C2800,0 2880,25 L2880,120 L0,120 Z"
            fill="rgba(225,248,248,0.75)"
          />
          {/* Foam crest highlight */}
          <path
            d="M0,42 C100,22 200,52 300,32 C400,12 500,47 600,27 C700,7 800,42 900,22 C1000,2 1100,37 1200,17 C1300,-3 1400,32 1500,12 C1600,-3 1700,37 1800,17 C1900,2 2000,42 2100,22 C2200,7 2300,37 2400,17 C2500,2 2600,32 2700,12 C2800,2 2880,27"
            fill="none"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="2"
          />
          {/* Foam bubbles and texture */}
          <circle cx="150" cy="28" r="3" fill="rgba(255,255,255,0.5)" />
          <circle cx="165" cy="35" r="2" fill="rgba(255,255,255,0.4)" />
          <circle cx="450" cy="22" r="2.5" fill="rgba(255,255,255,0.5)" />
          <circle cx="465" cy="30" r="1.5" fill="rgba(255,255,255,0.4)" />
          <circle cx="750" cy="18" r="3" fill="rgba(255,255,255,0.5)" />
          <circle cx="765" cy="25" r="2" fill="rgba(255,255,255,0.4)" />
          <circle cx="1050" cy="15" r="2.5" fill="rgba(255,255,255,0.5)" />
          <circle cx="1065" cy="22" r="1.5" fill="rgba(255,255,255,0.4)" />
          <circle cx="1350" cy="18" r="3" fill="rgba(255,255,255,0.5)" />
          <circle cx="1365" cy="25" r="2" fill="rgba(255,255,255,0.4)" />
          <circle cx="1650" cy="12" r="2.5" fill="rgba(255,255,255,0.5)" />
          <circle cx="1950" cy="18" r="3" fill="rgba(255,255,255,0.5)" />
          <circle cx="1965" cy="25" r="2" fill="rgba(255,255,255,0.4)" />
          <circle cx="2250" cy="15" r="2.5" fill="rgba(255,255,255,0.5)" />
          <circle cx="2550" cy="18" r="3" fill="rgba(255,255,255,0.5)" />
          <circle cx="2565" cy="25" r="2" fill="rgba(255,255,255,0.4)" />
          <circle cx="2750" cy="12" r="2.5" fill="rgba(255,255,255,0.5)" />
          {/* Trailing foam wash — thinner retreating foam */}
          <path
            d="M0,55 C100,40 200,60 300,45 C400,30 500,55 600,40 C700,25 800,50 900,35 C1000,20 1100,50 1200,35 C1300,20 1400,45 1500,30 C1600,20 1700,50 1800,35 C1900,25 2000,50 2100,35 C2200,25 2300,50 2400,35 C2500,25 2600,45 2700,30 C2800,20 2880,40 L2880,120 L0,120 Z"
            fill="rgba(210,240,240,0.3)"
          />
        </svg>
      </div>

      {/* Wet sand foreground with texture */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '14%',
          background: 'linear-gradient(180deg, #C4B8A0 0%, #B8AC94 30%, #A89C84 60%, #9A8E78 100%)',
        }}
      />
      {/* Sand grain texture overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 opacity-20"
        style={{
          height: '14%',
          background:
            'repeating-linear-gradient(95deg, transparent 0px, rgba(180,160,130,0.3) 1px, transparent 2px, transparent 4px)',
        }}
      />

      {/* Sand water shimmer — wider, more visible */}
      <div
        className="absolute bottom-[14%] left-0 right-0 h-[4%]"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.08) 80%, transparent 100%)',
          animation: 'shimmer 4s ease-in-out infinite',
        }}
      />
      {/* Second shimmer line */}
      <div
        className="absolute bottom-[13%] left-0 right-0 h-[2%]"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(200,240,245,0.1) 30%, rgba(200,240,245,0.15) 50%, rgba(200,240,245,0.1) 70%, transparent 100%)',
          animation: 'shimmer 6s ease-in-out infinite 1s',
        }}
      />

      {/* Sparkles on water — more, varied sizes */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${1 + Math.random() * 2.5}px`,
              height: `${1 + Math.random() * 2.5}px`,
              left: `${Math.random() * 100}%`,
              top: `${38 + Math.random() * 38}%`,
              opacity: 0,
              animation: `sparkle ${1.5 + Math.random() * 3}s ease-in-out ${Math.random() * 5}s infinite`,
              boxShadow: i % 3 === 0 ? '0 0 4px rgba(255,255,255,0.5)' : 'none',
            }}
          />
        ))}
      </div>
      {/* Glint streaks on water */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`glint-${i}`}
            className="absolute"
            style={{
              left: `${10 + i * 11}%`,
              top: `${42 + Math.random() * 30}%`,
              width: `${20 + Math.random() * 30}px`,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              opacity: 0,
              animation: `sparkle ${3 + Math.random() * 2}s ease-in-out ${Math.random() * 4}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Fishing boats on the horizon */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Distant boats */}
        <div className="absolute" style={{ top: '42%', left: '12%', animation: 'boat-bob-1 6s ease-in-out infinite' }}>
          <FishingBoat />
        </div>
        <div className="absolute" style={{ top: '44%', left: '65%', animation: 'boat-bob-2 8s ease-in-out infinite 1s' }}>
          <FishingBoat size={0.7} />
        </div>
        <div className="absolute" style={{ top: '46%', left: '38%', animation: 'boat-bob-1 7s ease-in-out infinite 2s' }}>
          <FishingBoat size={0.55} />
        </div>
        <div className="absolute" style={{ top: '43%', left: '82%', animation: 'boat-bob-2 9s ease-in-out infinite 3s' }}>
          <FishingBoat size={0.5} />
        </div>
        <div className="absolute" style={{ top: '47%', left: '5%', animation: 'boat-bob-1 8s ease-in-out infinite 1.5s' }}>
          <FishingBoat size={0.45} />
        </div>
        {/* Boat actively fishing with net — mid water */}
        <div className="absolute" style={{ top: '52%', left: '28%', animation: 'boat-bob-1 5s ease-in-out infinite' }}>
          <FishingBoatWithNet />
        </div>
        {/* Second netting boat */}
        <div className="absolute" style={{ top: '54%', left: '72%', animation: 'boat-bob-2 6s ease-in-out infinite 0.5s' }}>
          <FishingBoatWithNet size={0.75} />
        </div>
      </div>

      {/* Fish jumping near the fishing boats */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute" style={{ left: '30%', top: '55%', animation: 'fish-jump-1 4s ease-in-out infinite' }}>
          <JumpingFish />
        </div>
        <div className="absolute" style={{ left: '33%', top: '57%', animation: 'fish-jump-2 5s ease-in-out infinite 1.5s' }}>
          <JumpingFish size={0.7} color="#7AADAE" />
        </div>
        <div className="absolute" style={{ left: '74%', top: '56%', animation: 'fish-jump-1 4.5s ease-in-out infinite 2s' }}>
          <JumpingFish size={0.8} color="#C8503C" />
        </div>
        <div className="absolute" style={{ left: '77%', top: '58%', animation: 'fish-jump-2 3.5s ease-in-out infinite 0.8s' }}>
          <JumpingFish size={0.6} color="#7AADAE" />
        </div>
      </div>

      {/* Fish swimming under the surface — silhouettes */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`swim-${i}`}
            className="absolute"
            style={{
              top: `${48 + i * 4}%`,
              left: '0%',
              animation: `fish-swim ${15 + i * 4}s linear infinite ${i * 2.5}s`,
            }}
          >
            <SwimmingFish size={0.5 + i * 0.08} />
          </div>
        ))}
      </div>

      {/* Birds gliding */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute"
          style={{
            top: '15%',
            left: '0%',
            animation: 'bird-glide-1 30s linear infinite',
          }}
        >
          <BirdSilhouette />
        </div>
        <div
          className="absolute"
          style={{
            top: '22%',
            left: '0%',
            animation: 'bird-glide-2 40s linear infinite 5s',
          }}
        >
          <BirdSilhouette size={0.7} />
        </div>
      </div>

      {/* Sea shells on the shore */}
      <SeaShells />

      {/* Atmospheric haze near horizon */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: '35%',
          height: '15%',
          background:
            'linear-gradient(180deg, transparent 0%, rgba(200,230,230,0.15) 50%, transparent 100%)',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(10,20,30,0.4) 100%)',
        }}
      />
    </div>
  );
}

function FishingBoatWithNet({ size = 1 }: { size?: number }) {
  return (
    <svg width={56 * size} height={40 * size} viewBox="0 0 56 40" fill="none">
      {/* Hull */}
      <path d="M6 26 Q28 34 50 26 L46 32 Q28 38 10 32 Z" fill="#3A4A52" stroke="#2A3A42" strokeWidth="0.5" />
      {/* Deck */}
      <rect x="18" y="18" width="12" height="8" rx="1" fill="#4A5A62" />
      {/* Mast */}
      <line x1="28" y1="18" x2="28" y2="4" stroke="#2A3A42" strokeWidth="0.8" />
      {/* Sail */}
      <path d="M28 5 L28 16 L38 15 Z" fill="rgba(245,242,234,0.7)" stroke="rgba(200,200,190,0.4)" strokeWidth="0.3" />
      {/* Flag */}
      <line x1="28" y1="4" x2="33" y2="7" stroke="#C8503C" strokeWidth="0.8" />
      <path d="M33 7 L30 8 L33 10 Z" fill="#C8503C" />
      {/* Net boom arm extending right */}
      <line x1="40" y1="20" x2="54" y2="14" stroke="#4A3B2E" strokeWidth="1" />
      {/* Net — hanging from boom */}
      <path d="M48 16 Q50 22 52 28 Q53 32 51 34 Q49 35 47 33 Q46 28 46 22 Q47 18 48 16 Z" fill="rgba(220,240,240,0.15)" stroke="rgba(200,220,220,0.3)" strokeWidth="0.4" />
      {/* Net mesh lines */}
      <path d="M48 18 L50 24 M49 16 L51 22 M50 18 L52 24 M47 20 L49 26 M48 22 L50 28" stroke="rgba(200,220,220,0.2)" strokeWidth="0.3" />
      {/* Fish caught in net */}
      <ellipse cx="49" cy="25" rx="2" ry="0.8" fill="#7AADAE" opacity="0.7" />
      <ellipse cx="50" cy="29" rx="1.5" ry="0.6" fill="#8BAEB0" opacity="0.6" />
      {/* Splash near net */}
      <circle cx="51" cy="33" r="1" fill="rgba(255,255,255,0.5)" />
      <circle cx="53" cy="31" r="0.8" fill="rgba(255,255,255,0.4)" />
      <circle cx="48" cy="34" r="0.7" fill="rgba(255,255,255,0.3)" />
    </svg>
  );
}

function JumpingFish({ size = 1, color = '#8BAEB0' }: { size?: number; color?: string }) {
  return (
    <svg width={18 * size} height={14 * size} viewBox="0 0 18 14" fill="none">
      {/* Body */}
      <ellipse cx="8" cy="7" rx="6" ry="2.5" fill={color} opacity="0.85" />
      {/* Tail */}
      <path d="M2 7 L0 4 L0 10 Z" fill={color} opacity="0.8" />
      {/* Eye */}
      <circle cx="12" cy="6" r="0.6" fill="#111" />
      {/* Water droplets trailing */}
      <circle cx="5" cy="10" r="0.8" fill="rgba(200,240,245,0.5)" />
      <circle cx="3" cy="11" r="0.5" fill="rgba(200,240,245,0.4)" />
      <circle cx="7" cy="11" r="0.6" fill="rgba(200,240,245,0.3)" />
    </svg>
  );
}

function SwimmingFish({ size = 1 }: { size?: number }) {
  return (
    <svg width={20 * size} height="8 * size" viewBox="0 0 20 8" fill="none">
      <ellipse cx="9" cy="4" rx="6" ry="2" fill="rgba(40,80,90,0.25)" />
      <path d="M3 4 L0 2 L0 6 Z" fill="rgba(40,80,90,0.2)" />
      <path d="M9 2 Q11 1 13 2" fill="none" stroke="rgba(40,80,90,0.15)" strokeWidth="0.5" />
    </svg>
  );
}

function FishingBoat({ size = 1 }: { size?: number }) {
  return (
    <svg
      width={40 * size}
      height={28 * size}
      viewBox="0 0 40 28"
      fill="none"
    >
      {/* Hull */}
      <path
        d="M4 18 Q20 24 36 18 L33 22 Q20 26 7 22 Z"
        fill="#3A4A52"
        stroke="#2A3A42"
        strokeWidth="0.5"
      />
      {/* Cabin */}
      <rect x="14" y="12" width="8" height="6" rx="1" fill="#4A5A62" />
      {/* Mast */}
      <line x1="20" y1="12" x2="20" y2="2" stroke="#2A3A42" strokeWidth="0.8" />
      {/* Sail */}
      <path d="M20 3 L20 11 L28 10 Z" fill="rgba(245,242,234,0.7)" stroke="rgba(200,200,190,0.4)" strokeWidth="0.3" />
      {/* Flag */}
      <line x1="20" y1="2" x2="24" y2="4" stroke="#C8503C" strokeWidth="0.8" />
      <path d="M24 4 L22 5 L24 6 Z" fill="#C8503C" />
    </svg>
  );
}

function SeaShells() {
  const shells = [
    { left: '8%', bottom: '3%', rot: -15, scale: 1, type: 'scallop' as const },
    { left: '22%', bottom: '5%', rot: 25, scale: 0.7, type: 'spiral' as const },
    { left: '38%', bottom: '2%', rot: -8, scale: 0.85, type: 'scallop' as const },
    { left: '55%', bottom: '4%', rot: 40, scale: 0.6, type: 'spiral' as const },
    { left: '72%', bottom: '3%', rot: -20, scale: 0.9, type: 'scallop' as const },
    { left: '88%', bottom: '5%', rot: 15, scale: 0.65, type: 'spiral' as const },
    { left: '15%', bottom: '8%', rot: 55, scale: 0.5, type: 'scallop' as const },
    { left: '62%', bottom: '8%', rot: -35, scale: 0.55, type: 'spiral' as const },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0" style={{ height: '14%' }}>
      {shells.map((shell, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: shell.left,
            bottom: shell.bottom,
            transform: `rotate(${shell.rot}deg) scale(${shell.scale})`,
          }}
        >
          {shell.type === 'scallop' ? <ScallopShell /> : <SpiralShell />}
        </div>
      ))}
    </div>
  );
}

function ScallopShell() {
  return (
    <svg width="22" height="20" viewBox="0 0 22 20" fill="none">
      <path
        d="M11 2 Q2 4 1 14 Q11 19 21 14 Q20 4 11 2 Z"
        fill="#E8D8C0"
        stroke="#C4A87A"
        strokeWidth="0.5"
      />
      <path d="M11 2 L11 18" stroke="#C4A87A" strokeWidth="0.4" opacity="0.6" />
      <path d="M11 3 L5 17" stroke="#C4A87A" strokeWidth="0.3" opacity="0.5" />
      <path d="M11 3 L17 17" stroke="#C4A87A" strokeWidth="0.3" opacity="0.5" />
      <path d="M11 4 L3 15" stroke="#C4A87A" strokeWidth="0.25" opacity="0.4" />
      <path d="M11 4 L19 15" stroke="#C4A87A" strokeWidth="0.25" opacity="0.4" />
      <path d="M11 5 L7 16" stroke="#C4A87A" strokeWidth="0.2" opacity="0.3" />
      <path d="M11 5 L15 16" stroke="#C4A87A" strokeWidth="0.2" opacity="0.3" />
    </svg>
  );
}

function SpiralShell() {
  return (
    <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
      <path
        d="M8 1 Q3 3 3 10 Q3 17 8 18 Q13 17 13 12 Q13 8 8 8 Q6 8 6 11"
        fill="none"
        stroke="#D4B898"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M8 1 Q3 3 3 10 Q3 17 8 18 Q13 17 13 12 Q13 8 8 8 Q6 8 6 11"
        fill="none"
        stroke="#C4A87A"
        strokeWidth="0.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      <circle cx="8" cy="1" r="1" fill="#D4B898" />
    </svg>
  );
}

function BirdSilhouette({ size = 1 }: { size?: number }) {
  return (
    <svg
      width={24 * size}
      height={12 * size}
      viewBox="0 0 24 12"
      fill="none"
      style={{ animation: 'bird-flap 0.6s ease-in-out infinite' }}
    >
      <path
        d="M2 8 Q6 2 12 6 Q18 2 22 8"
        stroke="rgba(40,60,70,0.6)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
