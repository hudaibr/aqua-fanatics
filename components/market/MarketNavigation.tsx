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
            className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between px-6 py-5 sm:px-10"
          >
            <button
              type="button"
              onClick={onHome}
              aria-label="Aqua Fanatics — return to the entrance"
              className="transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F2EA]/70"
            >
              <Brand size="sm" tone="muted" />
            </button>

            <div className="hidden items-center gap-1 sm:flex">
              {navItems.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => onNavigate(item)}
                  aria-current={currentSection === item ? 'page' : undefined}
                  className={`px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F2EA]/70 ${
                    currentSection === item
                      ? 'text-[#F5F2EA]'
                      : 'text-[#F5F2EA]/40 hover:text-[#F5F2EA]/70'
                  }`}
                >
                  {sectionLabels[item]}
                </button>
              ))}
            </div>

            <div className="h-px w-8 bg-[#F5F2EA]/20" />
          </motion.div>

          {/* Bottom navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: easeOutCubic, delay: 0.2 }}
            className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-5 sm:px-10"
          >
            <button
              type="button"
              onClick={onBack}
              disabled={currentIndex <= 0}
              className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.25em] text-[#F5F2EA]/60 transition-colors hover:text-[#F5F2EA] disabled:opacity-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F2EA]/70"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>

            <div className="flex items-center gap-2">
              {sectionOrder.map((section, i) => (
                <button
                  key={section}
                  type="button"
                  onClick={() => onNavigate(section)}
                  aria-label={`Go to ${sectionLabels[section]}`}
                  aria-current={i === currentIndex ? 'true' : undefined}
                  className={`h-1.5 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F2EA]/70 ${
                    i === currentIndex
                      ? 'w-8 bg-[#F5F2EA]'
                      : 'w-1.5 bg-[#F5F2EA]/30 hover:bg-[#F5F2EA]/50'
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
              className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.25em] text-[#F5F2EA]/60 transition-colors hover:text-[#F5F2EA] disabled:opacity-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F2EA]/70"
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
              transition={{ duration: 0.5, ease: easeOutCubic }}
              className="fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 sm:block sm:left-10"
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#F5F2EA]/30">
                Section
              </p>
              <p className="mt-1 text-2xl font-light text-[#F5F2EA]">
                {sectionLabels[currentSection]}
              </p>
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
