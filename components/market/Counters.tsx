'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { InteractiveProduct } from './InteractiveProduct';
import { useFluteTexture } from './useTileTexture';
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

function DisplayTray({ size = [2, 0.1, 1.2] }: { size?: [number, number, number] }) {
  // Destructure to primitives so the memo keys are stable — `size` is a fresh
  // array literal on every parent render, which would otherwise rebuild the
  // tray on each one.
  const [width, height, depth] = size;

  // A perforated drainage grate rather than loose ice. The previous ice bed
  // spawned 55 translucent meshes per counter (~275 across the market), which
  // both obscured the products and — because transparent materials render
  // opaque into the shadow map — scattered hard black blobs over the counters.
  // Two draw calls does the same job.
  const grateSlats = useMemo(() => {
    const count = Math.max(4, Math.round(depth * 7));
    const slats: { z: number; w: number }[] = [];
    for (let i = 0; i < count; i++) {
      slats.push({
        z: (i / (count - 1) - 0.5) * depth * 0.8,
        w: width * 0.88,
      });
    }
    return slats;
  }, [width, depth]);

  return (
    <group>
      {/* Stainless tray pan */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="#B9C2C6" roughness={0.28} metalness={0.88} />
      </mesh>
      {/* Rolled rim — catches the light along the tray edge */}
      <mesh position={[0, height * 0.5, 0]} castShadow>
        <boxGeometry args={[width + 0.04, 0.015, depth + 0.04]} />
        <meshStandardMaterial color="#D4DBDE" roughness={0.18} metalness={0.95} />
      </mesh>
      {/* Grate slats */}
      {grateSlats.map((slat, i) => (
        <mesh key={i} position={[0, height * 0.52, slat.z]}>
          <boxGeometry args={[slat.w, 0.008, depth * 0.05]} />
          <meshStandardMaterial color="#8A9498" roughness={0.35} metalness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function CounterBase({ width = 3, depth = 1.6 }: { width?: number; depth?: number }) {
  // Reeded front panel. ~16 reeds per 1.28 units keeps the physical flute width
  // constant across the three different counter lengths.
  const flute = useFluteTexture({
    size: 256,
    count: 16,
    base: '#4A3427',
    repeat: [width / 1.28, 1],
  });

  return (
    <group>
      {/* Dark walnut carcass */}
      <mesh position={[0, -0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, 1, depth]} />
        <meshStandardMaterial color="#241811" roughness={0.52} metalness={0.06} />
      </mesh>

      {/* Fluted front panel */}
      <mesh position={[0, -0.5, depth / 2 + 0.008]} receiveShadow>
        <planeGeometry args={[width - 0.06, 0.96]} />
        <meshStandardMaterial
          map={flute}
          color="#FFFFFF"
          roughness={0.42}
          metalness={0.1}
        />
      </mesh>

      {/* Brass reveal along the toe kick — the single detail that does most of
          the "expensive joinery" work on the front elevation */}
      <mesh position={[0, -0.945, depth / 2 + 0.022]}>
        <boxGeometry args={[width - 0.05, 0.03, 0.022]} />
        <meshStandardMaterial color="#B08D57" roughness={0.3} metalness={0.95} />
      </mesh>

      {/* Honed dark stone worktop. Top face sits at y=0.06, unchanged, so the
          trays, products and price tags above it keep their existing heights. */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.12, 0.12, depth + 0.12]} />
        <meshStandardMaterial color="#1E2528" roughness={0.15} metalness={0.16} />
      </mesh>

      {/* Brushed steel nosing on the front lip */}
      <mesh position={[0, 0.01, depth / 2 + 0.068]} castShadow>
        <boxGeometry args={[width + 0.12, 0.035, 0.028]} />
        <meshStandardMaterial color="#BCC3C6" roughness={0.22} metalness={0.95} />
      </mesh>

      {/* Upstand at the back edge of the counter. A low kick-up belonging to
          the fixture — solid stone rather than tile, which is what was making
          the counters read as cheap deli joinery. */}
      <group position={[0, 0.06, -depth / 2]}>
        <mesh position={[0, 0.2, -0.025]} castShadow receiveShadow>
          <boxGeometry args={[width, 0.4, 0.05]} />
          <meshStandardMaterial color="#1E2528" roughness={0.17} metalness={0.14} />
        </mesh>
        {/* Brass capping rail along the top edge */}
        <mesh position={[0, 0.42, 0]} castShadow>
          <boxGeometry args={[width + 0.02, 0.04, 0.075]} />
          <meshStandardMaterial color="#B08D57" roughness={0.28} metalness={0.95} />
        </mesh>
      </group>
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

/**
 * Small price tag clipped to the front lip of a tray, the way a real market
 * labels its stock. Deliberately tiny and mounted at the edge so it never sits
 * on top of the fish — the earlier wide card was both oversized and positioned
 * over the product.
 */
function PriceTag({
  product,
  position,
}: {
  product: MarketProduct;
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      {/* Wire stake into the tray rim */}
      <mesh position={[0, 0.042, 0]} castShadow>
        <cylinderGeometry args={[0.0096, 0.0096, 0.084, 6]} />
        <meshStandardMaterial color="#9AA3A7" roughness={0.35} metalness={0.85} />
      </mesh>
      <group position={[0, 0.102, 0]} rotation={[-0.42, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.36, 0.18, 0.012]} />
          <meshStandardMaterial color="#F7F5EF" roughness={0.75} />
        </mesh>
        <Text
          position={[0, 0.042, 0.0084]}
          fontSize={0.054}
          color="#5C6B70"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.03}
        >
          {product.name.toUpperCase()}
        </Text>
        <Text
          position={[0, -0.0384, 0.0084]}
          fontSize={0.0744}
          color="#B05A32"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.01}
        >
          {`${product.price} ${product.unit}`}
        </Text>
      </group>
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
  // Five SKUs, each now a tray of several specimens, so the counter is wide
  // enough to give every tray its own run of surface.
  const width = 4.8;
  return (
    <group position={position} rotation={rotation}>
      <CounterBase width={width} depth={1.8} />
      {products.map((product, i) => {
        const x = (i - (products.length - 1) / 2) * 0.9;
        return (
          <group key={product.id} position={[x, 0, 0]}>
            {/* Sits on the counter top (y=0.06), not sunk into it */}
            <group position={[0, 0.11, 0]}>
              <DisplayTray size={[0.84, 0.1, 1.5]} />
            </group>
            <group position={[0, 0.19, 0]}>
              <InteractiveProduct
                product={product}
                position={[0, 0, 0]}
                scale={0.5}
                isActive={activeProductId === product.id}
                isHovered={hoveredProductId === product.id}
                onSelect={onSelect}
                onHover={onHover}
              />
            </group>
            <PriceTag product={product} position={[0, 0.06, 0.7]} />
          </group>
        );
      })}
      <BackSign label="FRESH FISH" position={[0, 1.1, -1]} />
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
      {products.map((product, i) => {
        const x = (i - (products.length - 1) / 2) * 1.3;
        return (
          <group key={product.id} position={[x, 0, 0]}>
            <group position={[0, 0.11, 0]}>
              <DisplayTray size={[1.16, 0.1, 1.3]} />
            </group>
            <group position={[0, 0.19, 0]}>
              <InteractiveProduct
                product={product}
                position={[0, 0, 0]}
                scale={0.5}
                isActive={activeProductId === product.id}
                isHovered={hoveredProductId === product.id}
                onSelect={onSelect}
                onHover={onHover}
              />
            </group>
            <PriceTag product={product} position={[0, 0.06, 0.6]} />
          </group>
        );
      })}
      <BackSign label={label} position={[0, 1.0, -0.9]} />
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
      {products.map((product, i) => {
        const x = (i - (products.length - 1) / 2) * 1.6;
        return (
          <group key={product.id} position={[x, 0, 0]}>
            <group position={[0, 0.12, 0]}>
              <DisplayTray size={[1.4, 0.12, 1.7]} />
            </group>
            <group position={[0, 0.21, 0]}>
              <InteractiveProduct
                product={product}
                position={[0, 0, 0]}
                scale={0.55}
                isActive={activeProductId === product.id}
                isHovered={hoveredProductId === product.id}
                onSelect={onSelect}
                onHover={onHover}
              />
            </group>
            <PriceTag product={product} position={[0, 0.06, 0.8]} />
          </group>
        );
      })}
      {/* Spotlight bar */}
      <mesh position={[0, 1.4, -1.1]} castShadow>
        <boxGeometry args={[3.5, 0.08, 0.08]} />
        <meshStandardMaterial color="#4A5E60" roughness={0.4} />
      </mesh>
      <BackSign label="PREMIUM CATCH" position={[0, 1.4, -1.05]} />
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
      <mesh position={[-0.6, 0.1, 0]} castShadow>
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
      {/* Brushed-steel bowl (ice container, now empty of loose ice) */}
      <mesh position={[1.1, 0.2, -0.2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.32, 0.26, 0.24, 20]} />
        <meshStandardMaterial color="#B9C2C6" roughness={0.25} metalness={0.9} side={THREE.DoubleSide} />
      </mesh>
      {/* Packaging box */}
      <mesh position={[1.1, 0.2, 0.5]} castShadow>
        <boxGeometry args={[0.5, 0.3, 0.35]} />
        <meshStandardMaterial color="#F5F2EA" roughness={0.8} />
      </mesh>
      {/* Weighing scale — a market staple and a nice metal accent */}
      <group position={[-0.6, 0.13, 0.6]}>
        <mesh castShadow>
          <boxGeometry args={[0.36, 0.08, 0.3]} />
          <meshStandardMaterial color="#C8CDD0" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.06, -0.1]} castShadow>
          <boxGeometry args={[0.28, 0.04, 0.12]} />
          <meshStandardMaterial color="#2A3A40" roughness={0.4} metalness={0.3} />
        </mesh>
      </group>
      {/* Stacked empty trays */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[-1.2, 0.06 + i * 0.05, -0.3]} castShadow>
          <boxGeometry args={[0.5, 0.05, 0.4]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#B9C2C6' : '#C8CDD0'} roughness={0.3} metalness={0.8} />
        </mesh>
      ))}
      <BackSign label="PREPARATION" position={[0, 0.8, -0.85]} />
    </group>
  );
}
