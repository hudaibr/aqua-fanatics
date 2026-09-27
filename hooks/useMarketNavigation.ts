'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { MarketSection } from '@/lib/camera';
import { sectionOrder } from '@/lib/camera';

const TRANSITION_MS = 1200;

export function useMarketNavigation() {
  const [currentSection, setCurrentSection] = useState<MarketSection>('entrance');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentRef = useRef<MarketSection>('entrance');

  useEffect(() => {
    return () => {
      if (transitionTimer.current) clearTimeout(transitionTimer.current);
    };
  }, []);

  const navigateTo = useCallback((section: MarketSection) => {
    if (section === currentRef.current) return;

    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    currentRef.current = section;
    setCurrentSection(section);
    setIsTransitioning(true);
    transitionTimer.current = setTimeout(() => setIsTransitioning(false), TRANSITION_MS);
  }, []);

  const goNext = useCallback(() => {
    const idx = sectionOrder.indexOf(currentRef.current);
    if (idx < sectionOrder.length - 1) {
      navigateTo(sectionOrder[idx + 1]);
    }
  }, [navigateTo]);

  const goPrev = useCallback(() => {
    const idx = sectionOrder.indexOf(currentRef.current);
    if (idx > 0) {
      navigateTo(sectionOrder[idx - 1]);
    }
  }, [navigateTo]);

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
