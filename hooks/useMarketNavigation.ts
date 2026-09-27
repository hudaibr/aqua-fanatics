'use client';

import { useState, useCallback, useRef } from 'react';
import type { MarketSection } from '@/lib/camera';
import { sectionOrder } from '@/lib/camera';

export function useMarketNavigation() {
  const [currentSection, setCurrentSection] = useState<MarketSection>('entrance');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigateTo = useCallback((section: MarketSection) => {
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    setIsTransitioning(true);
    setCurrentSection(section);
    transitionTimer.current = setTimeout(() => setIsTransitioning(false), 1800);
  }, []);

  const goNext = useCallback(() => {
    const idx = sectionOrder.indexOf(currentSection);
    if (idx < sectionOrder.length - 1) {
      navigateTo(sectionOrder[idx + 1]);
    }
  }, [currentSection, navigateTo]);

  const goPrev = useCallback(() => {
    const idx = sectionOrder.indexOf(currentSection);
    if (idx > 0) {
      navigateTo(sectionOrder[idx - 1]);
    }
  }, [currentSection, navigateTo]);

  const goHome = useCallback(() => {
    navigateTo('entrance');
  }, [navigateTo]);

  return {
    currentSection,
    isTransitioning,
    navigateTo,
    goNext,
    goPrev,
    goHome,
  };
}
