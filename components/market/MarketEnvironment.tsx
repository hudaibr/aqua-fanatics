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
    grout: '#1A1A1A',
    groutWidth: 3,
    base: '#282C2E',
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
        <meshStandardMaterial map={wallTile} color="#C8CDD0" roughness={0.6} metalness={0.04} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-15, 3, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[40, 8]} />
        <meshStandardMaterial map={wallTile} color="#C8CDD0" roughness={0.6} metalness={0.04} />
      </mesh>
      {/* Right wall */}
      <mesh position={[15, 3, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[40, 8]} />
        <meshStandardMaterial map={wallTile} color="#C8CDD0" roughness={0.6} metalness={0.04} />
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

/** Promotional posters, info plaques and specials boards along the side walls */
function WallDecor() {
  // Each poster: a dark frame + an inner coloured panel + text
  const Poster = ({
    position,
    rotation,
    width = 1.8,
    height = 2.4,
    accentColor = '#D4AF37',
    title,
    subtitle,
    body,
  }: {
    position: [number, number, number];
    rotation: [number, number, number];
    width?: number;
    height?: number;
    accentColor?: string;
    title: string;
    subtitle?: string;
    body?: string;
  }) => (
    <group position={position} rotation={rotation}>
      {/* Outer frame */}
      <mesh>
        <boxGeometry args={[width + 0.12, height + 0.12, 0.05]} />
        <meshStandardMaterial color="#0A0A0A" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Gold border inset */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[width + 0.06, height + 0.06, 0.04]} />
        <meshStandardMaterial color={accentColor} roughness={0.25} metalness={0.95} />
      </mesh>
      {/* Inner panel */}
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[width, height, 0.04]} />
        <meshStandardMaterial color="#111416" roughness={0.5} metalness={0.1} />
      </mesh>
      {/* Title */}
      <Text
        position={[0, height * 0.3, 0.07]}
        fontSize={height * 0.13}
        color={accentColor}
        anchorX="center"
        anchorY="middle"
        maxWidth={width * 0.85}
        letterSpacing={0.1}
        textAlign="center"
      >
        {title}
      </Text>
      {/* Divider rule */}
      <mesh position={[0, height * 0.1, 0.07]}>
        <planeGeometry args={[width * 0.6, 0.015]} />
        <meshStandardMaterial color={accentColor} roughness={0.3} />
      </mesh>
      {/* Subtitle */}
      {subtitle && (
        <Text
          position={[0, height * -0.05, 0.07]}
          fontSize={height * 0.075}
          color="#D0C8B8"
          anchorX="center"
          anchorY="middle"
          maxWidth={width * 0.82}
          letterSpacing={0.05}
          textAlign="center"
        >
          {subtitle}
        </Text>
      )}
      {/* Body */}
      {body && (
        <Text
          position={[0, height * -0.3, 0.07]}
          fontSize={height * 0.055}
          color="#8A8A8A"
          anchorX="center"
          anchorY="middle"
          maxWidth={width * 0.8}
          letterSpacing={0.02}
          textAlign="center"
        >
          {body}
        </Text>
      )}
    </group>
  );

  // Specials chalkboard-style board
  const ChalkBoard = ({
    position,
    rotation,
  }: {
    position: [number, number, number];
    rotation: [number, number, number];
  }) => (
    <group position={position} rotation={rotation}>
      {/* Wooden frame */}
      <mesh>
        <boxGeometry args={[2.8, 1.8, 0.08]} />
        <meshStandardMaterial color="#1A1008" roughness={0.7} metalness={0.05} />
      </mesh>
      {/* Chalk surface */}
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[2.5, 1.55, 0.03]} />
        <meshStandardMaterial color="#141F18" roughness={0.95} metalness={0} />
      </mesh>
      <Text
        position={[0, 0.42, 0.09]}
        fontSize={0.22}
        color="#E8D9B0"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.08}
      >
        TODAY'S SPECIALS
      </Text>
      {/* Divider */}
      <mesh position={[0, 0.24, 0.09]}>
        <planeGeometry args={[2.1, 0.012]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.3} />
      </mesh>
      <Text position={[-0.55, -0.02, 0.09]} fontSize={0.12} color="#C8C0A8" anchorX="center" anchorY="middle" letterSpacing={0.03}>
        {`Sea Bass\nKingfish\nLobster`}
      </Text>
      <Text position={[0.55, -0.02, 0.09]} fontSize={0.12} color="#D4AF37" anchorX="center" anchorY="middle" letterSpacing={0.03} textAlign="right">
        {`Rs. 850/kg\nRs. 1,200/kg\nRs. 3,500/kg`}
      </Text>
      <Text position={[0, -0.58, 0.09]} fontSize={0.085} color="#686868" anchorX="center" anchorY="middle" letterSpacing={0.05}>
        SOURCED FRESH DAILY · ASK OUR TEAM
      </Text>
    </group>
  );

  // Simple quality badge / cert plaque
  const QualityPlaque = ({
    position,
    rotation,
    label,
    sub,
  }: {
    position: [number, number, number];
    rotation: [number, number, number];
    label: string;
    sub: string;
  }) => (
    <group position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[1.4, 0.9, 0.06]} />
        <meshStandardMaterial color="#0A0A0A" roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[1.34, 0.84, 0.04]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.95} />
      </mesh>
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[1.24, 0.74, 0.03]} />
        <meshStandardMaterial color="#0D0D0D" roughness={0.4} metalness={0.5} />
      </mesh>
      <Text position={[0, 0.12, 0.08]} fontSize={0.17} color="#D4AF37" anchorX="center" anchorY="middle" letterSpacing={0.08}>
        {label}
      </Text>
      <Text position={[0, -0.1, 0.08]} fontSize={0.09} color="#888" anchorX="center" anchorY="middle" letterSpacing={0.04}>
        {sub}
      </Text>
    </group>
  );

  return (
    <group>
      {/* ─── LEFT WALL (x = -14.8) ─── */}
      {/* Promotional poster — "Ocean to Table" */}
      <Poster
        position={[-14.78, 3.2, 2]}
        rotation={[0, Math.PI / 2, 0]}
        title={"OCEAN\nTO TABLE"}
        subtitle="Every piece hand-selected\nfrom the morning catch"
        body="Our fishmongers work directly\nwith local boats — no middlemen,\nno compromise."
        accentColor="#D4AF37"
      />
      {/* Specials chalkboard */}
      <ChalkBoard position={[-14.78, 3.0, -4]} rotation={[0, Math.PI / 2, 0]} />
      {/* Preparation guide poster */}
      <Poster
        position={[-14.78, 3.2, -10]}
        rotation={[0, Math.PI / 2, 0]}
        width={1.6}
        height={2.2}
        title={"PREPARATION\nGUIDE"}
        subtitle="Whole · Filleted\nSteaked · Gutted\nMarinated"
        body="Ask our team for custom\npreparation at no extra cost."
        accentColor="#C0A060"
      />
      {/* Quality cert plaque */}
      <QualityPlaque
        position={[-14.78, 1.6, -16]}
        rotation={[0, Math.PI / 2, 0]}
        label="CERTIFIED\nFRESH"
        sub="ISO 22000 · HACCP COMPLIANT"
      />

      {/* ─── RIGHT WALL (x = +14.8) ─── */}
      {/* Poster — "Premium Catch" */}
      <Poster
        position={[14.78, 3.2, 2]}
        rotation={[0, -Math.PI / 2, 0]}
        title={"PREMIUM\nCATCH"}
        subtitle="Lobster · Crab · Oysters\nGiant Tiger Prawns"
        body="Sustainably sourced. Delivered\nlive or freshly harvested to order."
        accentColor="#D4AF37"
      />
      {/* Fish variety info poster */}
      <Poster
        position={[14.78, 3.2, -4]}
        rotation={[0, -Math.PI / 2, 0]}
        width={1.6}
        height={2.2}
        title={"KNOW YOUR\nFISH"}
        subtitle="Sea Bass · Kingfish\nSnapper · Pomfret\nSwordfish · Tuna"
        body="Each variety is hand-labelled\nwith origin and harvest date."
        accentColor="#B8A060"
      />
      {/* Delivery poster */}
      <Poster
        position={[14.78, 3.2, -10]}
        rotation={[0, -Math.PI / 2, 0]}
        title={"SAME-DAY\nDELIVERY"}
        subtitle="Order by 10 AM\nDelivered by 6 PM"
        body="Colombo & suburbs.\nCall +94 77 000 0000\nor order in-store."
        accentColor="#D4AF37"
      />
      {/* Quality cert plaque */}
      <QualityPlaque
        position={[14.78, 1.6, -16]}
        rotation={[0, -Math.PI / 2, 0]}
        label="DAILY\nHARVEST"
        sub="SOURCED FRESH · NEVER FROZEN"
      />
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
      <WallDecor />
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
