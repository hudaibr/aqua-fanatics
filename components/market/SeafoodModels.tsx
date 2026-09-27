'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import type { ThreeElements } from '@react-three/fiber';
import type { FishProfile } from '@/data/products';

type GroupProps = Omit<ThreeElements['group'], 'args'>;

/**
 * Proportions per body plan. `x` is length (the sphere's long axis), `y` is
 * body depth, `z` is body width. These are what separate a flat pomfret from
 * a torpedo-shaped surmai — sharing one stretched sphere made every species
 * read as the same animal in a different colour.
 */
const profiles: Record<
  FishProfile,
  { x: number; y: number; z: number; tail: number; dorsal: number; girth: number }
> = {
  // Pomfret: short, very deep and laterally compressed — almost a disc.
  disc: { x: 0.46, y: 0.44, z: 0.15, tail: 0.3, dorsal: 0.5, girth: 0.1 },
  // Surmai: long and slim with a narrow caudal peduncle.
  slender: { x: 0.82, y: 0.19, z: 0.15, tail: 0.24, dorsal: 0.3, girth: 0.05 },
  // Rohu: a moderate torpedo, the "average" fish.
  torpedo: { x: 0.66, y: 0.28, z: 0.19, tail: 0.28, dorsal: 0.4, girth: 0.08 },
  // Grouper / snapper: heavy, deep-bodied, broad head.
  deep: { x: 0.58, y: 0.38, z: 0.24, tail: 0.26, dorsal: 0.42, girth: 0.14 },
};

export function FishModel({
  color = '#8BAEB0',
  length = 1.2,
  profile = 'torpedo',
  ...props
}: {
  color?: string;
  length?: number;
  profile?: FishProfile;
} & GroupProps) {
  const p = profiles[profile];

  const bodyGeo = useMemo(() => {
    const geo = new THREE.SphereGeometry(1, 32, 20);
    geo.scale(length * p.x, length * p.y, length * p.z);
    return geo;
  }, [length, p.x, p.y, p.z]);

  // Deep-bodied species get a rounder tail; slim ones get a forked tail.
  const tailGeo = useMemo(() => {
    const shape = new THREE.Shape();
    const fork = profile === 'slender' || profile === 'torpedo' ? 0.06 : 0.14;
    shape.moveTo(0, 0);
    shape.lineTo(-p.tail * 0.6, p.tail);
    shape.lineTo(-p.tail * 0.22, 0);
    shape.lineTo(-p.tail * 0.6, -p.tail);
    shape.lineTo(0, 0);
    if (fork > 0.1) {
      // shallow notch for the deeper-bodied fish
      shape.lineTo(-p.tail * 0.1, 0);
    }
    return new THREE.ShapeGeometry(shape);
  }, [p.tail, profile]);

  const dorsalGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0.3, 0);
    shape.lineTo(0.1, 0.35);
    shape.lineTo(0, 0);
    return new THREE.ShapeGeometry(shape);
  }, []);

  const finGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0.2, 0);
    shape.lineTo(0.05, -0.2);
    shape.lineTo(0, 0);
    return new THREE.ShapeGeometry(shape);
  }, []);

  const darker = useMemo(() => {
    const c = new THREE.Color(color);
    c.multiplyScalar(0.7);
    return `#${c.getHexString()}`;
  }, [color]);

  const belly = useMemo(() => {
    const c = new THREE.Color(color);
    c.lerp(new THREE.Color('#F0F0F0'), 0.5);
    return `#${c.getHexString()}`;
  }, [color]);

  // All the feature offsets scale off the body, so a pomfret and a surmai
  // both keep their anatomy in proportion at their very different sizes.
  const nose = length * p.x * 0.86;
  const eyeX = length * p.x * 0.66;
  const eyeY = length * p.y * 0.34;
  const eyeZ = length * p.z * 0.62;
  const eyeR = length * p.girth * 0.34 + 0.012;

  return (
    <group {...props}>
      {/* Body */}
      <mesh geometry={bodyGeo} castShadow receiveShadow>
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>
      {/* Belly highlight */}
      <mesh
        position={[0, -length * p.y * 0.42, 0]}
        scale={[length * p.x * 0.82, length * p.y * 0.4, length * p.z * 0.86]}
      >
        <sphereGeometry args={[1, 16, 12]} />
        <meshStandardMaterial color={belly} roughness={0.5} metalness={0.1} />
      </mesh>
      {/* Gill plate */}
      <mesh
        position={[length * p.x * 0.48, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        scale={1}
      >
        <ringGeometry args={[length * p.y * 0.34, length * p.y * 0.5, 16]} />
        <meshStandardMaterial color={darker} roughness={0.4} metalness={0.3} side={THREE.DoubleSide} />
      </mesh>
      {/* Tail */}
      <mesh
        geometry={tailGeo}
        position={[-length * p.x * 0.94, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        castShadow
      >
        <meshStandardMaterial color={darker} roughness={0.3} metalness={0.5} side={THREE.DoubleSide} />
      </mesh>
      {/* Dorsal fin — tall and spiny on deep-bodied fish */}
      <mesh
        geometry={dorsalGeo}
        position={[0, length * p.y * 0.86, 0]}
        rotation={[0, Math.PI / 2, 0]}
        scale={length * p.dorsal}
        castShadow
      >
        <meshStandardMaterial color={darker} roughness={0.3} metalness={0.5} side={THREE.DoubleSide} />
      </mesh>
      {/* Pectoral fins */}
      <mesh
        geometry={finGeo}
        position={[length * p.x * 0.3, -length * p.y * 0.1, length * p.z * 0.8]}
        rotation={[Math.PI / 2, 0, -0.3]}
        scale={length * 0.5}
        castShadow
      >
        <meshStandardMaterial color={darker} roughness={0.3} metalness={0.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh
        geometry={finGeo}
        position={[length * p.x * 0.3, -length * p.y * 0.1, -length * p.z * 0.8]}
        rotation={[-Math.PI / 2, 0, -0.3]}
        scale={length * 0.5}
        castShadow
      >
        <meshStandardMaterial color={darker} roughness={0.3} metalness={0.5} side={THREE.DoubleSide} />
      </mesh>
      {/* Eyes */}
      <mesh position={[eyeX, eyeY, eyeZ]}>
        <sphereGeometry args={[eyeR, 12, 12]} />
        <meshStandardMaterial color="#111111" roughness={0.1} metalness={0.9} />
      </mesh>
      <mesh position={[eyeX, eyeY, -eyeZ]}>
        <sphereGeometry args={[eyeR, 12, 12]} />
        <meshStandardMaterial color="#111111" roughness={0.1} metalness={0.9} />
      </mesh>
      {/* Eye highlights */}
      <mesh position={[eyeX + eyeR * 0.3, eyeY + eyeR * 0.3, eyeZ * 1.06]}>
        <sphereGeometry args={[eyeR * 0.34, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[eyeX + eyeR * 0.3, eyeY + eyeR * 0.3, -eyeZ * 1.06]}>
        <sphereGeometry args={[eyeR * 0.34, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.3} />
      </mesh>
      {/* Blunt snout tip — most visible on the deep-bodied species */}
      <mesh position={[nose, 0, 0]} scale={[length * p.x * 0.16, length * p.y * 0.5, length * p.z * 0.7]}>
        <sphereGeometry args={[1, 14, 10]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.35} />
      </mesh>
    </group>
  );
}

export function PrawnModel({
  color = '#E8927A',
  ...props
}: {
  color?: string;
} & GroupProps) {
  const segments = useMemo(() => {
    const segs: { pos: [number, number, number]; scale: number; curl: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const t = i / 6;
      const curl = t * 0.25;
      segs.push({
        pos: [-i * 0.14, -curl * 0.1, 0],
        scale: 0.16 * (1 - t * 0.45),
        curl,
      });
    }
    return segs;
  }, []);

  const legPositions = useMemo(() => {
    const legs: { pos: [number, number, number] }[] = [];
    for (let i = 0; i < 5; i++) {
      legs.push({ pos: [-0.15 - i * 0.12, -0.08, 0.12] });
      legs.push({ pos: [-0.15 - i * 0.12, -0.08, -0.12] });
    }
    return legs;
  }, []);

  const darker = useMemo(() => {
    const c = new THREE.Color(color);
    c.multiplyScalar(0.75);
    return `#${c.getHexString()}`;
  }, [color]);

  return (
    <group {...props}>
      {/* Body segments — curled prawn lying on side */}
      {segments.map((seg, i) => (
        <mesh
          key={i}
          position={seg.pos}
          rotation={[0, 0, seg.curl * 0.3]}
          scale={[seg.scale * 1.5, seg.scale, seg.scale * 0.85]}
          castShadow
        >
          <sphereGeometry args={[1, 16, 12]} />
          <meshStandardMaterial color={i % 2 === 0 ? color : darker} roughness={0.35} metalness={0.3} />
        </mesh>
      ))}
      {/* Head/carapace */}
      <mesh position={[0.2, 0.04, 0]} scale={[0.26, 0.16, 0.2]} castShadow>
        <sphereGeometry args={[1, 16, 12]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.35} />
      </mesh>
      {/* Rostrum (nose spike) */}
      <mesh position={[0.38, 0.08, 0]} rotation={[0, 0, -0.3]}>
        <coneGeometry args={[0.03, 0.2, 6]} />
        <meshStandardMaterial color={darker} roughness={0.4} />
      </mesh>
      {/* Antennae */}
      <mesh position={[0.3, 0.14, 0.1]} rotation={[0, 0.3, 0.4]}>
        <cylinderGeometry args={[0.008, 0.004, 0.6, 6]} />
        <meshStandardMaterial color={darker} roughness={0.5} />
      </mesh>
      <mesh position={[0.3, 0.14, -0.1]} rotation={[0, -0.3, 0.4]}>
        <cylinderGeometry args={[0.008, 0.004, 0.6, 6]} />
        <meshStandardMaterial color={darker} roughness={0.5} />
      </mesh>
      {/* Legs */}
      {legPositions.map((leg, i) => (
        <mesh key={i} position={leg.pos} rotation={[0.3, 0, 0.2]} castShadow>
          <cylinderGeometry args={[0.01, 0.006, 0.15, 6]} />
          <meshStandardMaterial color={darker} roughness={0.5} />
        </mesh>
      ))}
      {/* Tail fan */}
      <mesh position={[-0.95, -0.08, 0]} rotation={[0, 0, Math.PI / 2 + 0.3]}>
        <coneGeometry args={[0.14, 0.22, 5]} />
        <meshStandardMaterial color={darker} roughness={0.3} metalness={0.4} side={THREE.DoubleSide} />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.3, 0.12, 0.12]}>
        <sphereGeometry args={[0.025, 10, 10]} />
        <meshStandardMaterial color="#111" roughness={0.1} metalness={0.8} />
      </mesh>
      <mesh position={[0.3, 0.12, -0.12]}>
        <sphereGeometry args={[0.025, 10, 10]} />
        <meshStandardMaterial color="#111" roughness={0.1} metalness={0.8} />
      </mesh>
    </group>
  );
}

export function CrabModel({
  color = '#C25B3F',
  ...props
}: {
  color?: string;
} & GroupProps) {
  const legPositions = useMemo(() => {
    const legs: { pos: [number, number, number]; rot: [number, number, number] }[] = [];
    for (let i = 0; i < 4; i++) {
      const angle = -0.2 - i * 0.22;
      legs.push({
        pos: [0.38, -0.05, 0.12 - i * 0.14],
        rot: [0, angle, 0.3],
      });
      legs.push({
        pos: [-0.38, -0.05, 0.12 - i * 0.14],
        rot: [0, Math.PI - angle, 0.3],
      });
    }
    return legs;
  }, []);

  const darker = useMemo(() => {
    const c = new THREE.Color(color);
    c.multiplyScalar(0.7);
    return `#${c.getHexString()}`;
  }, [color]);

  const lighter = useMemo(() => {
    const c = new THREE.Color(color);
    c.lerp(new THREE.Color('#FFD0A0'), 0.3);
    return `#${c.getHexString()}`;
  }, [color]);

  return (
    <group {...props}>
      {/* Shell — flattened dome */}
      <mesh scale={[0.55, 0.22, 0.45]} castShadow receiveShadow>
        <sphereGeometry args={[1, 24, 16]} />
        <meshStandardMaterial color={color} roughness={0.45} metalness={0.2} />
      </mesh>
      {/* Shell rim highlight */}
      <mesh position={[0, -0.08, 0]} scale={[0.55, 0.05, 0.45]}>
        <sphereGeometry args={[1, 20, 12]} />
        <meshStandardMaterial color={lighter} roughness={0.4} metalness={0.15} />
      </mesh>
      {/* Shell bumps */}
      <mesh position={[0.18, 0.13, 0]} scale={[0.14, 0.1, 0.12]} castShadow>
        <sphereGeometry args={[1, 12, 10]} />
        <meshStandardMaterial color={darker} roughness={0.4} metalness={0.25} />
      </mesh>
      <mesh position={[-0.18, 0.13, 0]} scale={[0.14, 0.1, 0.12]} castShadow>
        <sphereGeometry args={[1, 12, 10]} />
        <meshStandardMaterial color={darker} roughness={0.4} metalness={0.25} />
      </mesh>
      <mesh position={[0, 0.15, 0.15]} scale={[0.1, 0.08, 0.1]} castShadow>
        <sphereGeometry args={[1, 12, 10]} />
        <meshStandardMaterial color={darker} roughness={0.4} metalness={0.25} />
      </mesh>
      {/* Claws — larger, more defined */}
      <mesh position={[0.6, 0, 0.12]} rotation={[0, 0, -0.5]} scale={[0.25, 0.18, 0.16]} castShadow>
        <sphereGeometry args={[1, 16, 12]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.25} />
      </mesh>
      <mesh position={[-0.6, 0, 0.12]} rotation={[0, 0, 0.5]} scale={[0.25, 0.18, 0.16]} castShadow>
        <sphereGeometry args={[1, 16, 12]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.25} />
      </mesh>
      {/* Claw pincers */}
      <mesh position={[0.82, 0.06, 0.12]} rotation={[0, 0, -0.5]}>
        <coneGeometry args={[0.07, 0.25, 8]} />
        <meshStandardMaterial color={darker} roughness={0.35} />
      </mesh>
      <mesh position={[-0.82, 0.06, 0.12]} rotation={[0, 0, 0.5]}>
        <coneGeometry args={[0.07, 0.25, 8]} />
        <meshStandardMaterial color={darker} roughness={0.35} />
      </mesh>
      {/* Lower pincer */}
      <mesh position={[0.78, -0.04, 0.12]} rotation={[0, 0, -0.7]}>
        <coneGeometry args={[0.05, 0.18, 6]} />
        <meshStandardMaterial color={darker} roughness={0.35} />
      </mesh>
      <mesh position={[-0.78, -0.04, 0.12]} rotation={[0, 0, 0.7]}>
        <coneGeometry args={[0.05, 0.18, 6]} />
        <meshStandardMaterial color={darker} roughness={0.35} />
      </mesh>
      {/* Legs */}
      {legPositions.map((leg, i) => (
        <mesh
          key={i}
          position={leg.pos}
          rotation={leg.rot}
          castShadow
        >
          <cylinderGeometry args={[0.025, 0.015, 0.35, 8]} />
          <meshStandardMaterial color={darker} roughness={0.5} />
        </mesh>
      ))}
      {/* Eyes on stalks */}
      <mesh position={[0.12, 0.2, 0.3]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.08, 6]} />
        <meshStandardMaterial color={darker} roughness={0.4} />
      </mesh>
      <mesh position={[0.12, 0.26, 0.32]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#111" roughness={0.1} metalness={0.8} />
      </mesh>
      <mesh position={[-0.12, 0.2, 0.3]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.08, 6]} />
        <meshStandardMaterial color={darker} roughness={0.4} />
      </mesh>
      <mesh position={[-0.12, 0.26, 0.32]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#111" roughness={0.1} metalness={0.8} />
      </mesh>
    </group>
  );
}

export function LobsterModel({
  color = '#A0421C',
  ...props
}: {
  color?: string;
} & GroupProps) {
  const darker = useMemo(() => {
    const c = new THREE.Color(color);
    c.multiplyScalar(0.75);
    return `#${c.getHexString()}`;
  }, [color]);

  const lighter = useMemo(() => {
    const c = new THREE.Color(color);
    c.lerp(new THREE.Color('#FFB088'), 0.3);
    return `#${c.getHexString()}`;
  }, [color]);

  return (
    <group {...props}>
      {/* Body segments — horizontal, tail at -X */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          position={[-i * 0.2, 0, 0]}
          scale={[0.14, 0.24 - i * 0.025, 0.18 - i * 0.01]}
          castShadow
        >
          <sphereGeometry args={[1, 16, 12]} />
          <meshStandardMaterial color={i % 2 === 0 ? color : darker} roughness={0.35} metalness={0.3} />
        </mesh>
      ))}
      {/* Head/carapace */}
      <mesh position={[0.15, 0.06, 0]} scale={[0.26, 0.26, 0.2]} castShadow>
        <sphereGeometry args={[1, 16, 12]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.3} />
      </mesh>
      {/* Rostrum */}
      <mesh position={[0.36, 0.12, 0]} rotation={[0, 0, -0.2]}>
        <coneGeometry args={[0.04, 0.18, 6]} />
        <meshStandardMaterial color={darker} roughness={0.4} />
      </mesh>
      {/* Big claws — asymmetrical, one larger */}
      <mesh position={[0.05, 0.02, 0.38]} rotation={[0, 0, 0.4]} scale={[0.2, 0.22, 0.16]} castShadow>
        <sphereGeometry args={[1, 16, 12]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.35} />
      </mesh>
      <mesh position={[0.05, 0.02, -0.38]} rotation={[0, 0, -0.4]} scale={[0.16, 0.18, 0.14]} castShadow>
        <sphereGeometry args={[1, 16, 12]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.35} />
      </mesh>
      {/* Claw pincers — upper */}
      <mesh position={[0.12, 0.12, 0.56]} rotation={[0, 0, 0.4]}>
        <coneGeometry args={[0.08, 0.3, 8]} />
        <meshStandardMaterial color={darker} roughness={0.3} />
      </mesh>
      <mesh position={[0.12, 0.12, -0.56]} rotation={[0, 0, -0.4]}>
        <coneGeometry args={[0.06, 0.25, 8]} />
        <meshStandardMaterial color={darker} roughness={0.3} />
      </mesh>
      {/* Claw pincers — lower */}
      <mesh position={[0.08, -0.02, 0.56]} rotation={[0, 0, 0.6]}>
        <coneGeometry args={[0.05, 0.2, 6]} />
        <meshStandardMaterial color={darker} roughness={0.3} />
      </mesh>
      <mesh position={[0.08, -0.02, -0.56]} rotation={[0, 0, -0.6]}>
        <coneGeometry args={[0.04, 0.18, 6]} />
        <meshStandardMaterial color={darker} roughness={0.3} />
      </mesh>
      {/* Antennae — long */}
      <mesh position={[0.25, 0.22, 0.12]} rotation={[0, 0.15, 0.5]}>
        <cylinderGeometry args={[0.012, 0.004, 0.8, 6]} />
        <meshStandardMaterial color={darker} roughness={0.5} />
      </mesh>
      <mesh position={[0.25, 0.22, -0.12]} rotation={[0, -0.15, 0.5]}>
        <cylinderGeometry args={[0.012, 0.004, 0.8, 6]} />
        <meshStandardMaterial color={darker} roughness={0.5} />
      </mesh>
      {/* Smaller antennules */}
      <mesh position={[0.28, 0.18, 0.06]} rotation={[0, 0.1, 0.7]}>
        <cylinderGeometry args={[0.006, 0.003, 0.4, 6]} />
        <meshStandardMaterial color={lighter} roughness={0.5} />
      </mesh>
      <mesh position={[0.28, 0.18, -0.06]} rotation={[0, -0.1, 0.7]}>
        <cylinderGeometry args={[0.006, 0.003, 0.4, 6]} />
        <meshStandardMaterial color={lighter} roughness={0.5} />
      </mesh>
      {/* Tail fan */}
      <mesh position={[-1.1, -0.02, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.18, 0.06, 0.25]}>
        <sphereGeometry args={[1, 12, 8]} />
        <meshStandardMaterial color={darker} roughness={0.35} metalness={0.35} side={THREE.DoubleSide} />
      </mesh>
      {/* Tail fins */}
      <mesh position={[-1.05, 0.05, 0.12]} rotation={[0, 0, Math.PI / 2 - 0.3]}>
        <coneGeometry args={[0.04, 0.18, 4]} />
        <meshStandardMaterial color={darker} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-1.05, 0.05, -0.12]} rotation={[0, 0, Math.PI / 2 + 0.3]}>
        <coneGeometry args={[0.04, 0.18, 4]} />
        <meshStandardMaterial color={darker} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.22, 0.24, 0.14]}>
        <sphereGeometry args={[0.03, 10, 10]} />
        <meshStandardMaterial color="#111" roughness={0.1} metalness={0.8} />
      </mesh>
      <mesh position={[0.22, 0.24, -0.14]}>
        <sphereGeometry args={[0.03, 10, 10]} />
        <meshStandardMaterial color="#111" roughness={0.1} metalness={0.8} />
      </mesh>
    </group>
  );
}

/** A trimmed, skinless fillet steak — used for products like hamour fillet. */
export function FilletModel({
  color = '#E8A87C',
  ...props
}: {
  color?: string;
} & GroupProps) {
  const darker = useMemo(() => {
    const c = new THREE.Color(color);
    c.multiplyScalar(0.82);
    return `#${c.getHexString()}`;
  }, [color]);

  const flesh = useMemo(() => {
    const c = new THREE.Color(color);
    c.lerp(new THREE.Color('#FFD9B3'), 0.4);
    return `#${c.getHexString()}`;
  }, [color]);

  return (
    <group {...props}>
      {/* Main loin — tapered slab, thicker at the head end (+X) */}
      <mesh castShadow receiveShadow scale={[0.5, 0.11, 0.2]}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshStandardMaterial color={color} roughness={0.55} metalness={0.05} />
      </mesh>
      {/* Cut face, exposing the lighter flesh */}
      <mesh position={[0.5, 0, 0]} scale={[0.02, 0.1, 0.19]}>
        <sphereGeometry args={[1, 16, 12]} />
        <meshStandardMaterial color={flesh} roughness={0.6} />
      </mesh>
      {/* Myotome banding — the visible muscle segments of a fillet */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[-0.34 + i * 0.17, 0.015, 0]} scale={[0.055, 0.1, 0.205]}>
          <sphereGeometry args={[1, 12, 10]} />
          <meshStandardMaterial color={darker} roughness={0.65} />
        </mesh>
      ))}
      {/* Darker trimmed edge along the belly */}
      <mesh position={[0, -0.06, 0]} scale={[0.46, 0.05, 0.17]}>
        <sphereGeometry args={[1, 16, 12]} />
        <meshStandardMaterial color={darker} roughness={0.6} />
      </mesh>
    </group>
  );
}
