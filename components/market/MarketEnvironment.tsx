'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import {
  FishCounter,
  SeafoodCounter,
  PremiumCounter,
  PreparationStation,
} from './Counters';
import { products } from '@/data/products';
import { createRandom } from '@/lib/random';
import { UprightFreezer, SinkUnit } from './Freezers';
import { useTileTexture } from './useTileTexture';

interface MarketEnvironmentProps {
  activeProductId: string | null;
  hoveredProductId: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

function Floor() {
  const tile = useTileTexture({
    size: 256,
    tiles: 4,
    grout: '#050505',
    groutWidth: 5,
    base: '#111518',
    // 4 cells per repeat, 10 repeats across 40 units => 1-unit floor tiles.
    repeat: [10, 10],
  });

  const wetPatches = useMemo(() => {
    const rand = createRandom(0x5f3a91);
    const out: { pos: [number, number]; r: number }[] = [];
    for (let i = 0; i < 14; i++) {
      out.push({
        pos: [(rand() - 0.5) * 24, (rand() - 0.5) * 30 - 4],
        r: 0.6 + rand() * 1.5,
      });
    }
    return out;
  }, []);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial map={tile} color="#FFFFFF" roughness={0.3} metalness={0.16} />
      </mesh>
      {/* Central drainage channel with a steel grate — the detail that makes a
          wet-market floor read as a wet-market floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.985, -5]}>
        <planeGeometry args={[0.7, 30]} />
        <meshStandardMaterial color="#141B1D" roughness={0.45} metalness={0.35} />
      </mesh>
      {Array.from({ length: 26 }).map((_, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.975, -20 + i * 1.15]}
        >
          <planeGeometry args={[0.62, 0.5]} />
          <meshStandardMaterial color="#8A9498" roughness={0.3} metalness={0.85} />
        </mesh>
      ))}
      {/* Standing water — low roughness so the lamps reflect off it */}
      {wetPatches.map((p, i) => (
        <mesh
          key={`wet-${i}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[p.pos[0], -0.97, p.pos[1]]}
        >
          <circleGeometry args={[p.r, 16]} />
          <meshStandardMaterial
            color="#2B3A3D"
            roughness={0.05}
            metalness={0.35}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

function Walls() {
  const wallTile = useTileTexture({
    size: 256,
    tiles: 2,
    grout: '#000000',
    groutWidth: 3,
    base: '#0A0C0E',
    // 2 cells per repeat at 10x2 => 2x2-unit large-format slabs. Bigger tiles
    // and dark grout are the difference between a bathroom and a restaurant.
    repeat: [10, 2],
  });

  // Note: tile behind the counters is handled by the counter itself as a low
  // upstand (see CounterBase). The room walls are ~20 units behind the
  // counters, so a separate full-height "splashback" plane out in the room
  // would read as a stray wall rather than part of the fixture.
  return (
    <>
      {/* Back wall */}
      <mesh position={[0, 3, -22]} receiveShadow>
        <planeGeometry args={[40, 8]} />
        <meshStandardMaterial map={wallTile} color="#FFFFFF" roughness={0.5} metalness={0.06} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-15, 3, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[40, 8]} />
        <meshStandardMaterial map={wallTile} color="#FFFFFF" roughness={0.5} metalness={0.06} />
      </mesh>
      {/* Right wall */}
      <mesh position={[15, 3, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[40, 8]} />
        <meshStandardMaterial map={wallTile} color="#FFFFFF" roughness={0.5} metalness={0.06} />
      </mesh>
      <Ceiling />
    </>
  );
}

/** Exposed trusses so the ceiling isn't a featureless plane, and the hanging
    lamps have something to hang from. */
function Ceiling() {
  const beams = useMemo(() => {
    const out: number[] = [];
    for (let i = 0; i < 9; i++) {
      out.push(-18 + i * 4.5);
    }
    return out;
  }, []);

  return (
    <group>
      <mesh position={[0, 7, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#243437" roughness={0.92} />
      </mesh>
      {/* Cross beams spanning the room */}
      {beams.map((z, i) => (
        <mesh key={i} position={[0, 6.7, z]} castShadow>
          <boxGeometry args={[30, 0.35, 0.28]} />
          <meshStandardMaterial color="#1E2629" roughness={0.85} metalness={0.25} />
        </mesh>
      ))}
      {/* Longitudinal purlins tying the beams together */}
      {[-9, 0, 9].map((x, i) => (
        <mesh key={`pur-${i}`} position={[x, 6.5, 0]}>
          <boxGeometry args={[0.16, 0.16, 40]} />
          <meshStandardMaterial color="#1E2629" roughness={0.85} metalness={0.25} />
        </mesh>
      ))}
    </group>
  );
}

/** The branded hero wall. This is the single biggest fix for the blank-wall
    problem — a large back wall with nothing on it reads as unfinished. */
function BrandWall() {
  return (
    <group position={[0, 0, -21.9]}>
      {/* Luxury brushed metal panel */}
      <mesh position={[0, 3.6, 0]} receiveShadow>
        <planeGeometry args={[17, 4.4]} />
        <meshStandardMaterial
          color="#0A0A0A"
          roughness={0.4}
          metalness={0.8}
        />
      </mesh>
      {/* Subtle gold trim line */}
      <mesh position={[0, 1.45, 0.02]}>
        <planeGeometry args={[16.8, 0.05]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh position={[0, 5.75, 0.02]}>
        <planeGeometry args={[16.8, 0.05]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.3} metalness={0.9} />
      </mesh>
      
      <Text
        position={[0, 4.0, 0.05]}
        fontSize={1.5}
        color="#D4AF37"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.15}
      >
        AQUA FANATICS
      </Text>
      <Text
        position={[0, 2.8, 0.05]}
        fontSize={0.42}
        color="#D4AF37"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.4}
      >
        FRESH FROM THE SEA
      </Text>
      
      {/* Warm spotlighting for the gold text */}
      <pointLight
        position={[0, 5.2, -18.5]}
        intensity={16}
        distance={14}
        color="#FFD9A0"
      />
    </group>
  );
}

function HangingLights() {
  // Previously these ran in a diagonal line (z from -2 to -10) and nothing lit
  // the entrance at all. They now hang over the counter runs, with a dedicated
  // lamp at the entrance.
  const lights = useMemo(() => {
    const arr: { pos: [number, number, number]; color: string }[] = [];
    for (let i = 0; i < 5; i++) {
      arr.push({
        pos: [(i - 2) * 4.4, 5.4, -2.2],
        color: '#FFD9A0',
      });
    }
    // Entrance lamp, so the front of the room isn't dead space.
    arr.push({ pos: [0, 5.4, 5.5], color: '#FFE2B8' });
    return arr;
  }, []);

  return (
    <group>
      {lights.map((light, i) => (
        <group key={i} position={light.pos}>
          {/* Cord up to the truss */}
          <mesh position={[0, 0.7, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 1.4, 6]} />
            <meshStandardMaterial color="#4A5E60" />
          </mesh>
          {/* Shade */}
          <mesh position={[0, 0, 0]}>
            <coneGeometry args={[0.32, 0.26, 16, 1, true]} />
            <meshStandardMaterial
              color="#354649"
              roughness={0.4}
              metalness={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Bulb */}
          <mesh position={[0, -0.1, 0]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial
              color="#FFE8C0"
              emissive="#FFD080"
              emissiveIntensity={2}
            />
          </mesh>
          {/* Actual light — no shadow casting; only the key light casts, so we
              avoid one full extra scene pass per lamp. */}
          <pointLight
            position={[0, -0.2, 0]}
            intensity={12}
            distance={13}
            color={light.color}
          />
        </group>
      ))}
    </group>
  );
}

function AmbientParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, originalY } = useMemo(() => {
    const count = 80;
    const positions = new Float32Array(count * 3);
    const originalY = new Float32Array(count);
    const rand = createRandom(0x1ceaf00d);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * 24;
      positions[i * 3 + 1] = rand() * 5 + 0.5;
      positions[i * 3 + 2] = (rand() - 0.5) * 30 - 5;
      originalY[i] = positions[i * 3 + 1];
    }
    return { positions, originalY };
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const time = clock.elapsedTime;
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < originalY.length; i++) {
      pos[i * 3 + 1] = originalY[i] + Math.sin(time * 0.3 + i) * 0.15;
      pos[i * 3] += Math.sin(time * 0.1 + i) * 0.002;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#EAF4F5"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

function EntranceArch() {
  return (
    <group position={[0, 0, 6]}>
      {/* Left pillar */}
      <mesh position={[-3, 2, 0]} castShadow>
        <boxGeometry args={[0.4, 6, 0.4]} />
        <meshStandardMaterial color="#3D2A1E" roughness={0.7} />
      </mesh>
      {/* Right pillar */}
      <mesh position={[3, 2, 0]} castShadow>
        <boxGeometry args={[0.4, 6, 0.4]} />
        <meshStandardMaterial color="#3D2A1E" roughness={0.7} />
      </mesh>
      {/* Top beam */}
      <mesh position={[0, 5.2, 0]} castShadow>
        <boxGeometry args={[6.4, 0.4, 0.4]} />
        <meshStandardMaterial color="#3D2A1E" roughness={0.7} />
      </mesh>
      {/* Sign */}
      <mesh position={[0, 4.5, 0.05]}>
        <boxGeometry args={[4, 0.8, 0.05]} />
        <meshStandardMaterial color="#0A0A0A" roughness={0.4} metalness={0.8} />
      </mesh>
      <mesh position={[0, 4.5, 0.06]}>
        <boxGeometry args={[4.08, 0.88, 0.04]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.3} metalness={0.9} />
      </mesh>
      {/* The sign used to read "FRESH MARKET" as leftover placeholder copy. */}
      <Text
        position={[0, 4.58, 0.1]}
        fontSize={0.3}
        color="#D4AF37"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.14}
      >
        AQUA FANATICS
      </Text>
      <Text
        position={[0, 4.28, 0.1]}
        fontSize={0.13}
        color="#D4AF37"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.24}
      >
        FRESH MARKET
      </Text>
      {/* Entrance side walls for framing */}
      <mesh position={[-3.2, 2, 0.5]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 6, 2]} />
        <meshStandardMaterial color="#354649" roughness={0.85} />
      </mesh>
      <mesh position={[3.2, 2, 0.5]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 6, 2]} />
        <meshStandardMaterial color="#354649" roughness={0.85} />
      </mesh>
    </group>
  );
}

function DeliveryArea() {
  return (
    <group position={[0, 0, -18]}>
      {/* Counter */}
      <mesh position={[0, -0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 1, 1.6]} />
        <meshStandardMaterial color="#050505" roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.1, 0.08, 1.7]} />
        <meshStandardMaterial color="#020202" roughness={0.05} metalness={0.3} />
      </mesh>
      {/* Wooden pallet the boxes are stacked on */}
      <group position={[0.9, 0, -0.3]}>
        {[0, 1, 2].map((i) => (
          <mesh key={`slat-${i}`} position={[0, 0.04, (i - 1) * 0.45]} receiveShadow>
            <boxGeometry args={[1.6, 0.06, 0.28]} />
            <meshStandardMaterial color="#111" roughness={0.9} />
          </mesh>
        ))}
        {[-0.6, 0, 0.6].map((x, i) => (
          <mesh key={`bearer-${i}`} position={[x, 0.01, 0]}>
            <boxGeometry args={[0.16, 0.04, 1.2]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
          </mesh>
        ))}
      </group>
      {/* Stacked branded cartons with tape lines and printed labels */}
      <group position={[0.9, 0.09, -0.3]}>
        {[
          { p: [0, 0.19, 0], s: [0.7, 0.34, 0.5] },
          { p: [0.05, 0.55, 0.05], s: [0.62, 0.3, 0.46] },
          { p: [-0.02, 0.87, -0.02], s: [0.5, 0.26, 0.4] },
        ].map((box, i) => (
          <group key={`carton-${i}`} position={box.p as [number, number, number]}>
            <mesh castShadow>
              <boxGeometry args={box.s as [number, number, number]} />
              <meshStandardMaterial color="#0A0A0A" roughness={0.4} metalness={0.2} />
            </mesh>
            {/* Tape seam */}
            <mesh>
              <boxGeometry args={[(box.s as number[])[0] * 1.01, 0.005, 0.06]} />
              <meshStandardMaterial color="#D4AF37" roughness={0.7} />
            </mesh>
            {/* Printed brand band */}
            <mesh position={[0, 0, ((box.s as number[])[2] / 2) + 0.002]}>
              <planeGeometry args={[(box.s as number[])[0] * 0.7, 0.1]} />
              <meshStandardMaterial color="#D4AF37" roughness={0.7} />
            </mesh>
          </group>
        ))}
      </group>
      {/* Insulated delivery box on the counter */}
      <group position={[-0.9, 0.06, 0.1]}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[0.8, 0.4, 0.58]} />
          <meshStandardMaterial color="#0A0A0A" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.41, 0]} castShadow>
          <boxGeometry args={[0.84, 0.05, 0.62]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.9} />
        </mesh>
        <Text
          position={[0, 0.2, 0.3]}
          fontSize={0.09}
          color="#D4AF37"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.1}
        >
          AQUA FANATICS
        </Text>
      </group>
      {/* Rope divider */}
      <mesh position={[-1.5, 0.5, 0.5]}>
        <cylinderGeometry args={[0.02, 0.02, 1.5, 8]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.4} metalness={0.9} />
      </mesh>
      <mesh position={[-1.5, 0, 0.5]}>
        <cylinderGeometry args={[0.03, 0.03, 1, 8]} />
        <meshStandardMaterial color="#050505" roughness={0.6} />
      </mesh>
      {/* Section sign matching the wall signage */}
      <mesh position={[0, 1.4, -0.5]} castShadow>
        <boxGeometry args={[2.5, 0.4, 0.05]} />
        <meshStandardMaterial color="#0A0A0A" roughness={0.4} metalness={0.8} />
      </mesh>
      <Text
        position={[0, 1.4, -0.45]}
        fontSize={0.16}
        color="#D4AF37"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.12}
      >
        DELIVERY
      </Text>
    </group>
  );
}

export function MarketEnvironment({
  activeProductId,
  hoveredProductId,
  onSelect,
  onHover,
}: MarketEnvironmentProps) {
  const fishProducts = products.filter((p) => p.category === 'fish');
  const prawnProducts = products.filter((p) => p.category === 'prawns');
  const shellfishProducts = products.filter((p) => p.category === 'shellfish');
  const premiumProducts = products.filter((p) => p.category === 'premium');

  return (
    <group>
      <Floor />
      <Walls />
      <BrandWall />
      <EntranceArch />
      <HangingLights />
      <AmbientParticles />

      {/* Fish counter - left side */}
      <FishCounter
        position={[-4.5, 0, -2]}
        rotation={[0, 0.3, 0]}
        products={fishProducts}
        activeProductId={activeProductId}
        hoveredProductId={hoveredProductId}
        onSelect={onSelect}
        onHover={onHover}
      />

      {/* Prawns counter - right side */}
      <SeafoodCounter
        position={[4.5, 0, -2]}
        rotation={[0, -0.3, 0]}
        products={prawnProducts}
        activeProductId={activeProductId}
        hoveredProductId={hoveredProductId}
        onSelect={onSelect}
        onHover={onHover}
      />

      {/* Shellfish counter - right, further back */}
      <SeafoodCounter
        position={[4.5, 0, -8]}
        rotation={[0, -0.3, 0]}
        products={shellfishProducts}
        activeProductId={activeProductId}
        hoveredProductId={hoveredProductId}
        onSelect={onSelect}
        onHover={onHover}
        label="SHELLFISH"
      />

      {/* Premium counter - center back */}
      <PremiumCounter
        position={[0, 0, -12]}
        rotation={[0, 0, 0]}
        products={premiumProducts}
        activeProductId={activeProductId}
        hoveredProductId={hoveredProductId}
        onSelect={onSelect}
        onHover={onHover}
      />

      {/* Preparation station - left back */}
      <PreparationStation position={[-3, 0, -12]} rotation={[0, 0.3, 0]} />

      {/* Cold storage down both side walls */}
      <UprightFreezer position={[-14.1, 0, -5]} rotation={[0, Math.PI / 2, 0]} label="FROZEN" />
      <UprightFreezer position={[-14.1, 0, -11]} rotation={[0, Math.PI / 2, 0]} />
      <UprightFreezer position={[14.1, 0, -5]} rotation={[0, -Math.PI / 2, 0]} label="CHILLED" />
      <UprightFreezer position={[14.1, 0, -11]} rotation={[0, -Math.PI / 2, 0]} />
      {/* Wash-down sinks near the prep station */}
      <SinkUnit position={[-9.8, 0, -11.5]} rotation={[0, 0.3, 0]} />
      <SinkUnit position={[9.8, 0, -11.5]} rotation={[0, -0.3, 0]} />

      {/* Delivery area - far back */}
      <DeliveryArea />

      {/* Ambient: warm and present so surfaces are readable, not cave-dark */}
      <ambientLight intensity={1.2} color="#FFF8EE" />
      <hemisphereLight args={['#FFE8C8', '#1A1A1A', 0.8]} />
      {/* Key directional — only shadow caster */}
      <directionalLight
        position={[0, 10, 8]}
        intensity={2.5}
        color="#FFF4E6"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
        shadow-camera-near={0.5}
        shadow-camera-far={45}
        shadow-bias={-0.0005}
      />
      {/* Soft fill from behind to lift shadow areas */}
      <directionalLight position={[-8, 5, -8]} intensity={0.8} color="#FFE8D0" />
      <directionalLight position={[8, 5, -8]} intensity={0.6} color="#FFF0DC" />
      {/* Front fill so entrance isn't black */}
      <pointLight position={[0, 4, 12]} intensity={3.5} distance={30} color="#F5F2EA" />
      {/* Warm mid-market fill */}
      <pointLight position={[0, 4, -5]} intensity={5.0} distance={22} color="#FFD9A0" />
      {/* Side fills */}
      <pointLight position={[-8, 3, 0]} intensity={2.0} distance={18} color="#FFE4C0" />
      <pointLight position={[8, 3, 0]} intensity={2.0} distance={18} color="#FFE4C0" />
      {/* Premium counter accent spot */}
      <spotLight
        position={[0, 6, -10]}
        angle={0.55}
        penumbra={0.5}
        intensity={10}
        distance={20}
        color="#FFE8D0"
      />
    </group>
  );
}
