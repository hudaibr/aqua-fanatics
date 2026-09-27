'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import type { ThreeElements } from '@react-three/fiber';

type GroupProps = Omit<ThreeElements['group'], 'args'>;

export function FishModel({
  color = '#8BAEB0',
  length = 1.2,
  ...props
}: {
  color?: string;
  length?: number;
} & GroupProps) {
  const bodyGeo = useMemo(() => {
    const geo = new THREE.SphereGeometry(1, 32, 20);
    geo.scale(length * 0.5, 0.2, 0.24);
    return geo;
  }, [length]);

  const tailGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(-0.18, 0.4);
    shape.lineTo(-0.06, 0);
    shape.lineTo(-0.18, -0.4);
    shape.lineTo(0, 0);
    return new THREE.ShapeGeometry(shape);
  }, []);

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
      <mesh position={[0, -0.1, 0]} scale={[length * 0.45, 0.1, 0.2]}>
        <sphereGeometry args={[1, 16, 12]} />
        <meshStandardMaterial color={belly} roughness={0.5} metalness={0.1} />
      </mesh>
      {/* Gill plate */}
      <mesh position={[length * 0.25, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <ringGeometry args={[0.12, 0.18, 16]} />
        <meshStandardMaterial color={darker} roughness={0.4} metalness={0.3} side={THREE.DoubleSide} />
      </mesh>
      {/* Tail */}
      <mesh
        geometry={tailGeo}
        position={[-length * 0.48, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        castShadow
      >
        <meshStandardMaterial color={darker} roughness={0.3} metalness={0.5} side={THREE.DoubleSide} />
      </mesh>
      {/* Dorsal fin */}
      <mesh
        geometry={dorsalGeo}
        position={[length * 0.05, 0.22, 0]}
        rotation={[0, Math.PI / 2, 0]}
        castShadow
      >
        <meshStandardMaterial color={darker} roughness={0.3} metalness={0.5} side={THREE.DoubleSide} />
      </mesh>
      {/* Pectoral fins */}
      <mesh
        geometry={finGeo}
        position={[length * 0.18, 0.02, 0.2]}
        rotation={[Math.PI / 2, 0, -0.3]}
        castShadow
      >
        <meshStandardMaterial color={darker} roughness={0.3} metalness={0.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh
        geometry={finGeo}
        position={[length * 0.18, 0.02, -0.2]}
        rotation={[-Math.PI / 2, 0, -0.3]}
        castShadow
      >
        <meshStandardMaterial color={darker} roughness={0.3} metalness={0.5} side={THREE.DoubleSide} />
      </mesh>
      {/* Eyes */}
      <mesh position={[length * 0.4, 0.08, 0.13]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshStandardMaterial color="#111111" roughness={0.1} metalness={0.9} />
      </mesh>
      <mesh position={[length * 0.4, 0.08, -0.13]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshStandardMaterial color="#111111" roughness={0.1} metalness={0.9} />
      </mesh>
      {/* Eye highlights */}
      <mesh position={[length * 0.41, 0.1, 0.14]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[length * 0.41, 0.1, -0.14]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.3} />
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
