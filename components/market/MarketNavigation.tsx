'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ArrowRight } from 'lucide-react';
import { sectionLabels, sectionOrder, type MarketSection } from '@/lib/camera';
import { easeOutCubic } from '@/lib/animations';
import { Brand } from '@/components/Brand';

interface MarketNavigationProps {
  currentSection: MarketSection;
  isEntered: boolean;
  onNavigate: (section: MarketSection) => void;
  onBack: () => void;
  onHome: () => void;
}

const navItems: MarketSection[] = ['fish', 'prawns', 'shellfish', 'premium', 'preparation'];

export function MarketNavigation({
  currentSection,
  isEntered,
  onNavigate,
  onBack,
  onHome,
}: MarketNavigationProps) {
  const currentIndex = sectionOrder.indexOf(currentSection);

  return (
    <AnimatePresence>
      {isEntered && (
        <>
          {/* Top bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: easeOutCubic }}
            className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between px-6 py-5 sm:px-10 bg-background/40 backdrop-blur-md border-b border-white/5"
          >
            <button
              type="button"
              onClick={onHome}
              aria-label="Aqua Fanatics — return to the entrance"
              className="transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              <Brand />
            </button>

            <div className="hidden items-center gap-4 sm:flex">
              {navItems.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => onNavigate(item)}
                  aria-current={currentSection === item ? 'page' : undefined}
                  className={`px-3 py-1.5 text-[11px] font-sans uppercase tracking-[0.2em] transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
                    currentSection === item
                      ? 'text-foreground'
                      : 'text-foreground/40 hover:text-foreground/70'
                  }`}
                >
                  {sectionLabels[item]}
                </button>
              ))}
            </div>

            <div className="h-px w-8 bg-foreground/20 hidden sm:block" />
          </motion.div>

          {/* Bottom navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: easeOutCubic, delay: 0.2 }}
            className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-5 sm:px-10 bg-background/40 backdrop-blur-md border-t border-white/5"
          >
            <button
              type="button"
              onClick={onBack}
              disabled={currentIndex <= 0}
              className="flex items-center gap-2 text-[10px] font-sans uppercase tracking-[0.25em] text-foreground/60 transition-colors hover:text-foreground disabled:opacity-20 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>

            <div className="flex items-center gap-3">
              {sectionOrder.map((section, i) => (
                <button
                  key={section}
                  type="button"
                  onClick={() => onNavigate(section)}
                  aria-label={`Go to ${sectionLabels[section]}`}
                  aria-current={i === currentIndex ? 'true' : undefined}
                  className={`h-1 rounded-full transition-all duration-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
                    i === currentIndex
                      ? 'w-10 bg-primary'
                      : 'w-2 bg-foreground/20 hover:bg-foreground/50'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                onNavigate(
                  currentIndex < sectionOrder.length - 1
                    ? sectionOrder[currentIndex + 1]
                    : 'delivery'
                )
              }
              disabled={currentIndex >= sectionOrder.length - 1}
              className="flex items-center gap-2 text-[10px] font-sans uppercase tracking-[0.25em] text-foreground/60 transition-colors hover:text-foreground disabled:opacity-20 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              Explore
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>

          {/* Section label */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.8, ease: easeOutCubic }}
              className="fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 sm:block sm:left-10"
            >
              <div className="bg-background/30 backdrop-blur-sm border border-white/5 p-6 rounded-lg">
                <p className="text-[10px] font-sans uppercase tracking-[0.3em] text-primary/70">
                  Section
                </p>
                <p className="mt-2 text-3xl font-serif text-foreground">
                  {sectionLabels[currentSection]}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
