'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
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
}

export function MarketScene({
  targetSection,
  isEntered,
  activeProductId,
  hoveredProductId,
  onSelect,
  onHover,
}: MarketSceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: 'high-performance', toneMappingExposure: 1.25 }}
      camera={{ position: [0, 3, 20], fov: 60, near: 0.1, far: 60 }}
    >
      <color attach="background" args={['#172225']} />
      <fog attach="fog" args={['#172225', 24, 60]} />
      <Suspense fallback={null}>
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
