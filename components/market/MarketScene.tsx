'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useProgress } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import { MarketEnvironment } from './MarketEnvironment';
import { MarketCamera } from './MarketCamera';
import type { MarketSection } from '@/lib/camera';

interface MarketSceneProps {
  targetSection: MarketSection;
  isEntered: boolean;
  activeProductId: string | null;
  hoveredProductId: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  onProgress?: (progress: number) => void;
  onReady?: () => void;
}

/**
 * Bridges drei's loader progress out to the React tree and signals the first
 * rendered frame, so the loading screen reflects real work instead of a timer.
 */
function LoadReporter({
  onProgress,
  onReady,
}: {
  onProgress?: (progress: number) => void;
  onReady?: () => void;
}) {
  const { progress, active } = useProgress();
  const [frameDrawn, setFrameDrawn] = useState(false);
  const reported = useRef(false);

  useEffect(() => {
    onProgress?.(active ? progress : 100);
  }, [progress, active, onProgress]);

  useFrame(() => {
    if (!frameDrawn) setFrameDrawn(true);
  });

  useEffect(() => {
    if (frameDrawn && !reported.current) {
      reported.current = true;
      onReady?.();
    }
  }, [frameDrawn, onReady]);

  return null;
}

export function MarketScene({
  targetSection,
  isEntered,
  activeProductId,
  hoveredProductId,
  onSelect,
  onHover,
  onProgress,
  onReady,
}: MarketSceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      // Nothing is visible behind the loading screen, so only render on
      // demand until the user enters; then run continuously for the animation.
      frameloop={isEntered ? 'always' : 'demand'}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        toneMappingExposure: 1.25,
      }}
      camera={{ position: [0, 3, 20], fov: 60, near: 0.1, far: 60 }}
    >
      <color attach="background" args={['#172225']} />
      <fog attach="fog" args={['#172225', 24, 60]} />
      <Suspense fallback={null}>
        <LoadReporter onProgress={onProgress} onReady={onReady} />
        <MarketEnvironment
          activeProductId={activeProductId}
          hoveredProductId={hoveredProductId}
          onSelect={onSelect}
          onHover={onHover}
        />
      </Suspense>
      <MarketCamera target={targetSection} isEntered={isEntered} />
    </Canvas>
  );
}
