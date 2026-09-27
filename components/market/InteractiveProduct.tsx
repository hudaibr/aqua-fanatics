'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { FishModel, PrawnModel, CrabModel, LobsterModel } from './SeafoodModels';
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

const modelMap = {
  fish: { Component: FishModel, defaultColor: '#8BAEB0' },
  prawns: { Component: PrawnModel, defaultColor: '#E8927A' },
  shellfish: { Component: CrabModel, defaultColor: '#C25B3F' },
  premium: { Component: LobsterModel, defaultColor: '#A0421C' },
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
  'hamour-fillet': '#C4A88A',
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
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const showHover = hovered || isHovered;

  const modelInfo = modelMap[product.category];
  const ModelComponent = modelInfo.Component;
  const color = productColors[product.id] || modelInfo.defaultColor;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetY = showHover ? position[1] + 0.08 : position[1];
    groupRef.current.position.y +=
      (targetY - groupRef.current.position.y) * Math.min(delta * 5, 1);
    if (isActive) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHover(product.id);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        onHover(null);
        document.body.style.cursor = 'auto';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(product.id);
      }}
    >
      <ModelComponent color={color} />

      {/* Hover light */}
      {showHover && (
        <pointLight
          position={[0, 0.5, 0.5]}
          intensity={2}
          distance={2.5}
          color="#FFE8D0"
        />
      )}

      {/* Hover label */}
      {showHover && !isActive && (
        <Html center distanceFactor={8} position={[0, 0.8, 0]} zIndexRange={[10, 0]}>
          <div className="pointer-events-none select-none whitespace-nowrap rounded-full border border-white/20 bg-black/70 px-4 py-1.5 backdrop-blur-md">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white">
              {product.name}
            </p>
          </div>
        </Html>
      )}
    </group>
  );
}
