'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { easeOutCubic } from '@/lib/animations';
import { Brand } from '@/components/Brand';

interface LoadingScreenProps {
  progress: number;
  isReady: boolean;
  onEnter: () => void;
}

export function LoadingScreen({ progress, isReady, onEnter }: LoadingScreenProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    // After 3 s on the "ready" screen, gracefully fade out and hand off.
    const t = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onEnter, 900);
    }, 3000);
    return () => clearTimeout(t);
  }, [isReady, onEnter]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-background"
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.9, ease: easeOutCubic }}
    >
      {/* Subtle warm radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,235,205,0.06)_0%,transparent_70%)]" />

      {/* Logo — always visible, fades in once on mount */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: easeOutCubic }}
        className="mb-8"
      >
        <Brand size="lg" priority />
      </motion.div>

      {/* Headline — always visible */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.25, ease: easeOutCubic }}
        className="text-center text-4xl font-serif text-foreground sm:text-5xl"
      >
        The Ocean&apos;s Finest.
      </motion.h1>

      {/* Tagline — fades in only when ready */}
      <motion.p
        animate={{ opacity: isReady ? 1 : 0 }}
        transition={{ duration: 1.2, ease: easeOutCubic }}
        className="mt-3 text-center text-xl font-serif italic text-foreground/70 sm:text-2xl"
      >
        Sourced with uncompromising standards.
      </motion.p>

      {/* Progress bar — fades out when ready */}
      <motion.div
        animate={{ opacity: isReady ? 0 : 1 }}
        transition={{ duration: 0.8, ease: easeOutCubic }}
        className="mt-14 w-64"
      >
        <div className="mb-3 flex justify-between text-[10px] uppercase tracking-[0.2em] text-foreground/40">
          <span>Preparing</span>
          <span>{Math.min(100, Math.round(progress))}%</span>
        </div>
        <div className="h-[1px] w-full overflow-hidden bg-foreground/10">
          <motion.div
            className="h-full bg-primary"
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut', duration: 0.4 }}
          />
        </div>
      </motion.div>

      {/* "Entering market" hint */}
      <motion.p
        animate={{ opacity: isReady ? 1 : 0 }}
        transition={{ duration: 1, delay: 1.8, ease: easeOutCubic }}
        className="mt-14 text-[10px] font-sans uppercase tracking-[0.35em] text-foreground/35"
      >
        Entering Market…
      </motion.p>
    </motion.div>
  );
}
