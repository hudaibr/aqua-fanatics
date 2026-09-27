'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    if (isReady) {
      // Auto-enter the market 3 seconds after the ready state appears
      const timer = setTimeout(() => {
        setIsExiting(true);
        // Let the fade-out play before tearing down
        setTimeout(onEnter, 800);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isReady, onEnter]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-hidden bg-background"
      initial={false}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.8, ease: easeOutCubic }}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,235,205,0.05)_0%,transparent_100%)]" />

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
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: easeOutCubic }}
                className="mb-8"
              >
                <Brand size="lg" priority />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: easeOutCubic }}
                className="mt-6 text-4xl font-serif text-foreground sm:text-5xl"
              >
                The Ocean&apos;s Finest.
              </motion.h1>

              <div className="mt-16 w-64">
                <div className="mb-4 flex justify-between text-[10px] uppercase tracking-[0.2em] text-foreground/40">
                  <span>Preparing</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-[1px] w-full overflow-hidden bg-foreground/10">
                  <motion.div
                    className="h-full bg-primary"
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
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: easeOutCubic }}
                className="mb-8"
              >
                <Brand size="lg" priority />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: easeOutCubic }}
                className="mt-6 text-center text-4xl font-serif text-foreground sm:text-6xl leading-tight"
              >
                The Ocean&apos;s Finest.<br />
                <span className="text-foreground/80 italic text-3xl sm:text-5xl">Sourced with uncompromising standards.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.5, ease: easeOutCubic }}
                className="mt-16 text-[10px] font-sans uppercase tracking-[0.3em] text-foreground/40"
              >
                Entering Market...
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
