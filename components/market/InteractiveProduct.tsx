'use client';

import { useRef, useEffect, useMemo } from 'react';
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
import { createRandom, hashString } from '@/lib/random';
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
  pomfret: '#C6D4D6',
  surmai: '#8FB0B2',
  'red-snapper': '#D05B44',
  hamour: '#A88A70',
  rohu: '#8B9B76',
  'king-prawns': '#E89878',
  shrimp: '#D4A08A',
  crab: '#C25B3F',
  lobster: '#A0421C',
  'hamour-fillet': '#E8A87C',
};

/** Scene units per centimetre of real fish length. */
const CM_TO_UNITS = 2.2;

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

  // Real species differ by a lot in size, so the model is sized from the
  // product's actual length rather than a shared default.
  const modelLength = product.lengthCm ? (product.lengthCm / 100) * CM_TO_UNITS : 1.2;

  // Several specimens of the same SKU laid side by side the way a fishmonger
  // fills a tray. They spread *perpendicular* to the body's long axis (local
  // Z) so a row of fish reads as a row, and overflow into a second row to make
  // a mound for small items like prawns. Seeded off the product id so the
  // arrangement is stable across renders.
  const specimens = useMemo(() => {
    const count = product.displayCount ?? 1;
    if (count <= 1) {
      return [{ pos: [0, 0, 0] as [number, number, number], rot: 0, roll: 0, scale: 1 }];
    }
    const rand = createRandom(hashString(product.id));
    const perRow = Math.min(count, 3);
    const rows = Math.ceil(count / perRow);
    const out: { pos: [number, number, number]; rot: number; roll: number; scale: number }[] = [];
    for (let i = 0; i < count; i++) {
      const col = i % perRow;
      const row = Math.floor(i / perRow);
      out.push({
        pos: [
          (row - (rows - 1) / 2) * modelLength * 0.34 + (rand() - 0.5) * 0.02,
          (rand() - 0.5) * 0.02,
          (col - (perRow - 1) / 2) * modelLength * 0.4,
        ],
        // Slight yaw so the row doesn't look machine-stacked.
        rot: (rand() - 0.5) * 0.24,
        // Fish rest at a slight roll, not perfectly flat.
        roll: (rand() - 0.5) * 0.14,
        scale: 0.9 + rand() * 0.2,
      });
    }
    return out;
  }, [product.id, product.displayCount, modelLength]);

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
        {specimens.map((spec, i) => (
          <group
            key={i}
            position={spec.pos}
            rotation={[0, spec.rot, spec.roll]}
            scale={spec.scale}
          >
            {/* Only FishModel understands `length`/`profile`; the others spread
                unknown props onto the group, so don't pass them. */}
            {modelKind === 'fish' ? (
              <FishModel
                color={color}
                length={modelLength}
                {...(product.profile ? { profile: product.profile } : {})}
              />
            ) : (
              <ModelComponent color={color} />
            )}
          </group>
        ))}

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
