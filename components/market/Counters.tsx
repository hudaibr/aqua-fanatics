'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { InteractiveProduct } from './InteractiveProduct';
import { createRandom, hashSeed } from '@/lib/random';
import type { MarketProduct } from '@/data/products';

interface CounterProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  products: MarketProduct[];
  activeProductId: string | null;
  hoveredProductId: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  label?: string;
}

function IceBed({ size = [2, 0.15, 1.2] }: { size?: [number, number, number] }) {
  // Destructure to primitives so the memo keys are stable — `size` is a fresh
  // array literal on every parent render, which would otherwise rebuild the
  // whole ice bed. The ice is seeded from those same numbers, so it is
  // deterministic and stable rather than re-randomising each render.
  const [width, height, depth] = size;

  const iceChunks = useMemo(() => {
    const rand = createRandom(hashSeed(width, depth, 1));
    const chunks: {
      pos: [number, number, number];
      scale: [number, number, number];
      rot: [number, number, number];
      color: string;
    }[] = [];
    const palette = ['#C5E8EB', '#D8F2F4', '#E8FAFB', '#B5DDE2', '#D0EDEF'];
    for (let i = 0; i < 40; i++) {
      const s = 0.03 + rand() * 0.08;
      chunks.push({
        pos: [
          (rand() - 0.5) * width * 0.88,
          0.02 + rand() * 0.06,
          (rand() - 0.5) * depth * 0.88,
        ],
        scale: [
          s * (1.2 + rand() * 0.6),
          s * (0.4 + rand() * 0.3),
          s * (0.8 + rand() * 0.6),
        ],
        rot: [rand() * Math.PI, rand() * Math.PI, rand() * Math.PI],
        color: palette[Math.floor(rand() * palette.length)],
      });
    }
    return chunks;
  }, [width, depth]);

  const frostCrystals = useMemo(() => {
    const rand = createRandom(hashSeed(width, height, depth, 2));
    const crystals: {
      pos: [number, number, number];
      scale: number;
      rot: [number, number, number];
    }[] = [];
    for (let i = 0; i < 15; i++) {
      crystals.push({
        pos: [
          (rand() - 0.5) * width * 0.8,
          height * 0.55 + rand() * 0.02,
          (rand() - 0.5) * depth * 0.8,
        ],
        scale: 0.015 + rand() * 0.02,
        rot: [rand() * Math.PI, rand() * Math.PI, rand() * Math.PI],
      });
    }
    return crystals;
  }, [width, height, depth]);

  return (
    <group>
      {/* Chilled ice base */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color="#A8D5DA"
          roughness={0.25}
          metalness={0.05}
          transparent
          opacity={0.92}
        />
      </mesh>
      {/* Frost top layer */}
      <mesh position={[0, height * 0.52, 0]} receiveShadow>
        <boxGeometry args={[width * 0.97, 0.02, depth * 0.97]} />
        <meshStandardMaterial
          color="#E8FAFB"
          roughness={0.08}
          metalness={0.02}
          transparent
          opacity={0.65}
        />
      </mesh>
      {/* Irregular translucent ice chunks */}
      {iceChunks.map((chunk, i) => (
        <mesh
          key={i}
          position={[chunk.pos[0], chunk.pos[1] + height * 0.5, chunk.pos[2]]}
          scale={chunk.scale}
          rotation={chunk.rot}
          castShadow
        >
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={chunk.color}
            roughness={0.15}
            metalness={0.03}
            transparent
            opacity={0.75}
          />
        </mesh>
      ))}
      {/* Small frost crystals */}
      {frostCrystals.map((crystal, i) => (
        <mesh
          key={`frost-${i}`}
          position={crystal.pos}
          scale={crystal.scale}
          rotation={crystal.rot}
        >
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#F5FEFF"
            roughness={0.05}
            metalness={0.01}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
    </group>
  );
}

function CounterBase({ width = 3, depth = 1.6 }: { width?: number; depth?: number }) {
  return (
    <group>
      {/* Counter base - dark wood */}
      <mesh position={[0, -0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, 1, depth]} />
        <meshStandardMaterial color="#3D2A1E" roughness={0.7} metalness={0.05} />
      </mesh>
      {/* Stainless steel top rim */}
      <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.1, 0.08, depth + 0.1]} />
        <meshStandardMaterial color="#C8CDD0" roughness={0.2} metalness={0.9} />
      </mesh>
      {/* Front trim */}
      <mesh position={[0, -0.15, depth / 2 + 0.01]} castShadow>
        <boxGeometry args={[width - 0.1, 0.5, 0.02]} />
        <meshStandardMaterial color="#4A3B2E" roughness={0.6} />
      </mesh>
    </group>
  );
}

function BackSign({ label, position = [0, 0.8, -0.9] as [number, number, number] }: { label: string; position?: [number, number, number] }) {
  return (
    <group>
      <mesh position={position} castShadow>
        <boxGeometry args={[2.5, 0.4, 0.05]} />
        <meshStandardMaterial color="#4A5E60" roughness={0.65} />
      </mesh>
      <Text
        position={[position[0], position[1], position[2] + 0.04]}
        fontSize={0.16}
        color="#F5F2EA"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.12}
      >
        {label}
      </Text>
    </group>
  );
}

export function FishCounter({
  position,
  rotation = [0, 0, 0],
  products,
  activeProductId,
  hoveredProductId,
  onSelect,
  onHover,
}: CounterProps) {
  return (
    <group position={position} rotation={rotation}>
      <CounterBase width={3} depth={1.6} />
      {/* Ice bed */}
      <group position={[0, 0.12, 0]}>
        <IceBed size={[2.6, 0.12, 1.3]} />
      </group>
      {/* Fish on ice */}
      {products.map((product, i) => {
        const cols = 3;
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = (col - 1) * 0.85;
        const z = row * 0.55;
        return (
          <InteractiveProduct
            key={product.id}
            product={product}
            position={[x, 0.28, z]}
            rotation={[0, Math.PI / 2 + ((i % 3) - 1) * 0.18, 0]}
            scale={0.62}
            isActive={activeProductId === product.id}
            isHovered={hoveredProductId === product.id}
            onSelect={onSelect}
            onHover={onHover}
          />
        );
      })}
      <BackSign label="FRESH FISH" />
    </group>
  );
}

export function SeafoodCounter({
  position,
  rotation = [0, 0, 0],
  products,
  activeProductId,
  hoveredProductId,
  onSelect,
  onHover,
  label = 'PRAWNS',
}: CounterProps) {
  return (
    <group position={position} rotation={rotation}>
      <CounterBase width={3} depth={1.6} />
      {/* Ice bed */}
      <group position={[0, 0.12, 0]}>
        <IceBed size={[2.6, 0.12, 1.3]} />
      </group>
      {/* Products lying on ice */}
      {products.map((product, i) => {
        const cols = 2;
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = (col - 0.5) * 1.0;
        const z = (row - 0.5) * 0.6;
        return (
          <InteractiveProduct
            key={product.id}
            product={product}
            position={[x, 0.28, z]}
            rotation={[0, (i % 2 === 0 ? 0.2 : -0.2), 0]}
            scale={0.55}
            isActive={activeProductId === product.id}
            isHovered={hoveredProductId === product.id}
            onSelect={onSelect}
            onHover={onHover}
          />
        );
      })}
      <BackSign label={label} position={[0, 0.8, -0.9]} />
    </group>
  );
}

export function PremiumCounter({
  position,
  rotation = [0, 0, 0],
  products,
  activeProductId,
  hoveredProductId,
  onSelect,
  onHover,
}: CounterProps) {
  return (
    <group position={position} rotation={rotation}>
      <CounterBase width={3.5} depth={2} />
      {/* Ice bed */}
      <group position={[0, 0.12, 0]}>
        <IceBed size={[3.2, 0.15, 1.6]} />
      </group>
      {/* Products lying on ice */}
      {products.map((product, i) => {
        const cols = 2;
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = (col - 0.5) * 1.2;
        const z = (row - 0.5) * 0.7;
        return (
          <InteractiveProduct
            key={product.id}
            product={product}
            position={[x, 0.32, z]}
            rotation={[0, (i % 2 === 0 ? 0.15 : -0.15), 0]}
            scale={0.65}
            isActive={activeProductId === product.id}
            isHovered={hoveredProductId === product.id}
            onSelect={onSelect}
            onHover={onHover}
          />
        );
      })}
      {/* Spotlight bar */}
      <mesh position={[0, 1.2, -1]} castShadow>
        <boxGeometry args={[3.5, 0.08, 0.08]} />
        <meshStandardMaterial color="#4A5E60" roughness={0.4} />
      </mesh>
      <BackSign label="PREMIUM CATCH" position={[0, 1.2, -0.95]} />
    </group>
  );
}

export function PreparationStation({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const knifeRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (knifeRef.current) {
      knifeRef.current.position.y = 0.15 + Math.sin(clock.elapsedTime * 0.8) * 0.02;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      <CounterBase width={3} depth={1.6} />
      {/* Cutting board */}
      <mesh position={[-0.4, 0.1, 0]} castShadow>
        <boxGeometry args={[1, 0.06, 0.8]} />
        <meshStandardMaterial color="#C4A87A" roughness={0.6} />
      </mesh>
      {/* Knife */}
      <group ref={knifeRef} position={[0.2, 0.15, 0]} rotation={[0, 0, 0.3]}>
        <mesh position={[0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.4, 0.02, 0.08]} />
          <meshStandardMaterial color="#E8E8E8" roughness={0.1} metalness={0.95} />
        </mesh>
        <mesh position={[-0.05, 0, 0]} castShadow>
          <boxGeometry args={[0.15, 0.04, 0.06]} />
          <meshStandardMaterial color="#2A1A10" roughness={0.6} />
        </mesh>
      </group>
      {/* Ice container */}
      <mesh position={[1, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.25, 0.2, 16]} />
        <meshStandardMaterial color="#E8E8E8" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Ice in container */}
      <group position={[1, 0.22, 0]}>
        <IceBed size={[0.4, 0.08, 0.4]} />
      </group>
      {/* Packaging box */}
      <mesh position={[1, 0.2, 0.5]} castShadow>
        <boxGeometry args={[0.5, 0.3, 0.35]} />
        <meshStandardMaterial color="#F5F2EA" roughness={0.8} />
      </mesh>
      <BackSign label="PREPARATION" position={[0, 0.8, -0.85]} />
    </group>
  );
}
