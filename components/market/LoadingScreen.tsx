'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { easeOutCubic } from '@/lib/animations';
import { createRandom } from '@/lib/random';

interface LoadingScreenProps {
  progress: number;
  isReady: boolean;
  onEnter: () => void;
}

export function LoadingScreen({ progress, isReady, onEnter }: LoadingScreenProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleEnter = () => {
    setIsExiting(true);
    // Let the fade-out play before the parent tears the screen down.
    window.setTimeout(onEnter, 800);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-hidden"
      initial={false}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.8, ease: easeOutCubic }}
    >
      <OceanScene />
      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        <AnimatePresence>
          {!isReady ? (
            <motion.div
              key="loading"
              className="flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.4 } }}
            >
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
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: 'easeOut' }}
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="ready"
              className="flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
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
                type="button"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: easeOutCubic }}
                onClick={handleEnter}
                className="mt-12 border border-[#F5F2EA]/30 px-10 py-4 text-xs font-medium uppercase tracking-[0.3em] text-[#F5F2EA] transition-colors hover:border-[#F5F2EA] hover:bg-[#F5F2EA]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F2EA]/70"
              >
                Enter the Market
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
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
      <Sparkles />

      {/* Glint streaks on water */}
      <Glints />

      {/* Fishing boats on the horizon */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Distant boats — just below the horizon line (ocean starts at 55%) */}
        <div className="absolute" style={{ top: '52%', left: '10%', animation: 'boat-bob-1 6s ease-in-out infinite' }}>
          <FishingBoat />
        </div>
        <div className="absolute" style={{ top: '53%', left: '64%', animation: 'boat-bob-2 8s ease-in-out infinite 1s' }}>
          <FishingBoat size={0.78} />
        </div>
        <div className="absolute" style={{ top: '55%', left: '37%', animation: 'boat-bob-1 7s ease-in-out infinite 2s' }}>
          <FishingBoat size={0.62} />
        </div>
        <div className="absolute" style={{ top: '52%', left: '84%', animation: 'boat-bob-2 9s ease-in-out infinite 3s' }}>
          <FishingBoat size={0.58} />
        </div>
        <div className="absolute" style={{ top: '56%', left: '4%', animation: 'boat-bob-1 8s ease-in-out infinite 1.5s' }}>
          <FishingBoat size={0.54} />
        </div>
        {/* Boat actively fishing with net — nearer the viewer, mid water */}
        <div className="absolute" style={{ top: '58%', left: '25%', animation: 'boat-bob-1 5s ease-in-out infinite' }}>
          <FishingBoatWithNet />
        </div>
        {/* Second netting boat — nearest, largest */}
        <div className="absolute" style={{ top: '60%', left: '73%', animation: 'boat-bob-2 6s ease-in-out infinite 0.5s' }}>
          <FishingBoatWithNet size={0.88} />
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
            <SwimmingFish size={0.75 + i * 0.12} />
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

function Sparkles() {
  const dots = useMemo(() => {
    const r = createRandom(0x5eed1234);
    return Array.from({ length: 50 }, (_, i) => {
      const size = 1 + r() * 2.5;
      return {
        size,
        left: r() * 100,
        top: 38 + r() * 38,
        duration: 1.5 + r() * 3,
        delay: r() * 5,
        glow: i % 3 === 0,
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {dots.map((dot, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            left: `${dot.left}%`,
            top: `${dot.top}%`,
            opacity: 0,
            animation: `sparkle ${dot.duration}s ease-in-out ${dot.delay}s infinite`,
            boxShadow: dot.glow ? '0 0 4px rgba(255,255,255,0.5)' : 'none',
          }}
        />
      ))}
    </div>
  );
}

function Glints() {
  const streaks = useMemo(() => {
    const r = createRandom(0x0c1a9e);
    return Array.from({ length: 8 }, (_, i) => ({
      left: 10 + i * 11,
      top: 42 + r() * 30,
      width: 20 + r() * 30,
      duration: 3 + r() * 2,
      delay: r() * 4,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {streaks.map((streak, i) => (
        <div
          key={`glint-${i}`}
          className="absolute"
          style={{
            left: `${streak.left}%`,
            top: `${streak.top}%`,
            width: `${streak.width}px`,
            height: '1px',
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            opacity: 0,
            animation: `sparkle ${streak.duration}s ease-in-out ${streak.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function FishingBoatWithNet({ size = 1 }: { size?: number }) {
  return (
    <svg width={128 * size} height={92 * size} viewBox="0 0 56 40" fill="none">
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
    <svg width={36 * size} height={28 * size} viewBox="0 0 18 14" fill="none">
      {/* Body */}
      <ellipse cx="8" cy="7" rx="6" ry="2.5" fill={color} opacity="0.85" />
      {/* Dorsal fin */}
      <path d="M6 4.8 L9 2.6 L11 4.8 Z" fill={color} opacity="0.6" />
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
    <svg width={42 * size} height={17 * size} viewBox="0 0 20 8" fill="none">
      <ellipse cx="9" cy="4" rx="6" ry="2" fill="rgba(40,80,90,0.25)" />
      <path d="M3 4 L0 2 L0 6 Z" fill="rgba(40,80,90,0.2)" />
      <path d="M9 2 Q11 1 13 2" fill="none" stroke="rgba(40,80,90,0.15)" strokeWidth="0.5" />
    </svg>
  );
}

function FishingBoat({ size = 1 }: { size?: number }) {
  return (
    <svg
      width={92 * size}
      height={64 * size}
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
  // Ribs fan out from the hinge at the top; alternating opacity gives the
  // ridged, three-dimensional look of a real scallop.
  const ribs = Array.from({ length: 13 }, (_, i) => {
    const t = i / 12; // 0 = left edge, 1 = right edge
    const x = 1.6 + t * 18.8;
    return { x, opacity: 0.22 + (1 - Math.abs(t - 0.5) * 2) * 0.42, width: 0.16 + (1 - Math.abs(t - 0.5) * 2) * 0.22 };
  });

  return (
    <svg width="34" height="30" viewBox="0 0 22 20" fill="none">
      <defs>
        <radialGradient id="scallop-body" cx="50%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#FBF1E0" />
          <stop offset="55%" stopColor="#E8D8C0" />
          <stop offset="100%" stopColor="#C9AE85" />
        </radialGradient>
      </defs>

      {/* Soft contact shadow on the sand */}
      <ellipse cx="11" cy="18.4" rx="9" ry="1.1" fill="#8A7A5E" opacity="0.25" />

      {/* Shell body */}
      <path
        d="M11 2 Q2 4 1 14 Q11 19 21 14 Q20 4 11 2 Z"
        fill="url(#scallop-body)"
        stroke="#A8875C"
        strokeWidth="0.5"
      />

      {/* Ribs */}
      {ribs.map((rib, i) => (
        <path
          key={i}
          d={`M11 2.4 L${rib.x} 17.4`}
          stroke="#9A7A50"
          strokeWidth={rib.width}
          opacity={rib.opacity}
          strokeLinecap="round"
        />
      ))}

      {/* Growth ridges following the shell edge */}
      <path d="M3.2 6.6 Q11 3.2 18.8 6.6" fill="none" stroke="#B08F62" strokeWidth="0.3" opacity="0.5" />
      <path d="M2 9.8 Q11 6 20 9.8" fill="none" stroke="#B08F62" strokeWidth="0.28" opacity="0.4" />
      <path d="M1.2 13 Q11 9 20.8 13" fill="none" stroke="#B08F62" strokeWidth="0.26" opacity="0.3" />

      {/* Hinge / ear at the top */}
      <path d="M8.6 2.1 Q11 1.1 13.4 2.1 L12.6 3.4 Q11 2.7 9.4 3.4 Z" fill="#D8C3A2" stroke="#A8875C" strokeWidth="0.3" />

      {/* Specular sheen */}
      <ellipse cx="7.5" cy="6.5" rx="2.6" ry="1.1" fill="#FFFFFF" opacity="0.35" transform="rotate(-18 7.5 6.5)" />
    </svg>
  );
}

function SpiralShell() {
  // Successively smaller whorls, each rotated a little further round.
  const whorls = [
    { r: 7.4, cx: 8, cy: 10.6, sw: 1.5, o: 0.95 },
    { r: 5.2, cx: 9.1, cy: 9.4, sw: 1.25, o: 0.8 },
    { r: 3.2, cx: 7.7, cy: 8.2, sw: 1.05, o: 0.7 },
    { r: 1.5, cx: 8.8, cy: 7.5, sw: 0.85, o: 0.6 },
  ];

  return (
    <svg width="26" height="32" viewBox="0 0 16 20" fill="none">
      <defs>
        <radialGradient id="spiral-body" cx="38%" cy="32%" r="80%">
          <stop offset="0%" stopColor="#F6E6D0" />
          <stop offset="60%" stopColor="#DDBE9C" />
          <stop offset="100%" stopColor="#B08F62" />
        </radialGradient>
      </defs>

      {/* Soft contact shadow on the sand */}
      <ellipse cx="8" cy="19" rx="6" ry="0.9" fill="#8A7A5E" opacity="0.25" />

      {/* Outer shell body */}
      <path
        d="M8 1 Q2.6 3.4 2.6 10.4 Q2.6 17.4 8 18.6 Q13.4 17.4 13.4 11.6 Q13.4 6.6 8.4 5.4 Q5 4.6 4.4 8.4"
        fill="url(#spiral-body)"
        stroke="#9A7A50"
        strokeWidth="0.45"
        strokeLinejoin="round"
      />

      {/* Spiral whorls traced on top of the body */}
      {whorls.map((whorl, i) => (
        <circle
          key={i}
          cx={whorl.cx}
          cy={whorl.cy}
          r={whorl.r}
          fill="none"
          stroke="#8A6A44"
          strokeWidth={whorl.sw}
          opacity={whorl.o}
        />
      ))}

      {/* Aperture (the opening) */}
      <path
        d="M12.6 12.4 Q14 14.6 12 16.4 Q10.2 17.6 9.2 15.8 Q8.6 14 10.2 12.8 Z"
        fill="#7A5C3C"
        opacity="0.55"
      />

      {/* Growth banding across the whorls */}
      <path d="M4.4 6.6 Q8 4.4 11.6 6.2" fill="none" stroke="#A8875C" strokeWidth="0.26" opacity="0.45" />
      <path d="M3.2 12.4 Q8 10.6 12.6 12" fill="none" stroke="#A8875C" strokeWidth="0.24" opacity="0.35" />
      <path d="M3.8 16.2 Q8 14.8 12 16" fill="none" stroke="#A8875C" strokeWidth="0.22" opacity="0.28" />

      {/* Apex / tip of the spire */}
      <path d="M6.6 2.6 Q8 0.6 9.4 2.6 Q8 3.8 6.6 2.6 Z" fill="#C4A87A" stroke="#9A7A50" strokeWidth="0.3" />

      {/* Specular sheen */}
      <ellipse cx="5.4" cy="5.4" rx="1.7" ry="0.8" fill="#FFFFFF" opacity="0.32" transform="rotate(-32 5.4 5.4)" />
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
