'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  FishModel,
  PrawnModel,
  CrabModel,
  LobsterModel,
  FilletModel,
} from './SeafoodModels';
import type { MarketProduct } from '@/data/products';

interface InteractiveProductProps {
  product: MarketProduct;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  isActive: boolean;
  isHovered: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

type ModelKind = NonNullable<MarketProduct['model']>;

const modelMap: Record<
  ModelKind,
  { Component: typeof FishModel; defaultColor: string }
> = {
  fish: { Component: FishModel, defaultColor: '#8BAEB0' },
  prawn: { Component: PrawnModel, defaultColor: '#E8927A' },
  crab: { Component: CrabModel, defaultColor: '#C25B3F' },
  lobster: { Component: LobsterModel, defaultColor: '#A0421C' },
  fillet: { Component: FilletModel, defaultColor: '#E8A87C' },
};

const categoryToModel: Record<MarketProduct['category'], ModelKind> = {
  fish: 'fish',
  prawns: 'prawn',
  shellfish: 'crab',
  premium: 'lobster',
  fillet: 'fillet',
};

const productColors: Record<string, string> = {
  pomfret: '#B8C8C9',
  surmai: '#6B8E8F',
  'red-snapper': '#C8503C',
  hamour: '#9B7E6A',
  rohu: '#7A8B6A',
  'king-prawns': '#E89878',
  shrimp: '#D4A08A',
  crab: '#C25B3F',
  lobster: '#A0421C',
  'hamour-fillet': '#E8A87C',
};

export function InteractiveProduct({
  product,
  position,
  rotation = [0, 0, 0],
  scale = 1,
  isActive,
  isHovered,
  onSelect,
  onHover,
}: InteractiveProductProps) {
  const innerRef = useRef<THREE.Group>(null);

  const modelKind = product.model ?? categoryToModel[product.category];
  const modelInfo = modelMap[modelKind];
  const ModelComponent = modelInfo.Component;
  const color = productColors[product.id] || modelInfo.defaultColor;

  // Restore the document cursor even if the product unmounts while hovered.
  useEffect(() => {
    return () => {
      document.body.style.cursor = '';
    };
  }, []);

  useFrame((_, delta) => {
    const group = innerRef.current;
    if (!group) return;

    // The inner group is a child of the static rotation group, so animating
    // this never fights React's re-application of the `rotation` prop.
    const targetY = isHovered ? position[1] + 0.08 : position[1];
    group.position.y +=
      (targetY - group.position.y) * Math.min(delta * 5, 1);

    if (isActive) {
      group.rotation.y += delta * 0.5;
    }
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <group
        ref={innerRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(product.id);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onHover(null);
          document.body.style.cursor = '';
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(product.id);
        }}
      >
        <ModelComponent color={color} />

        {/* Hover light */}
        {isHovered && (
          <pointLight
            position={[0, 0.5, 0.5]}
            intensity={2}
            distance={2.5}
            color="#FFE8D0"
          />
        )}

        {/* Hover label */}
        {isHovered && !isActive && (
          <Html
            center
            distanceFactor={8}
            position={[0, 0.8, 0]}
            zIndexRange={[10, 0]}
          >
            <div className="pointer-events-none select-none whitespace-nowrap rounded-full border border-white/20 bg-black/70 px-4 py-1.5 backdrop-blur-md">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white">
                {product.name}
              </p>
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}
