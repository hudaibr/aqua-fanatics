'use client';

import * as THREE from 'three';
import { Text } from '@react-three/drei';

/**
 * Glass-door upright freezer.
 *
 * Deliberately non-interactive: the counters already carry the click targets,
 * and adding a second interactive surface per aisle would dilute them. The
 * cold interior light is what sells it — a warm-lit room with cool-lit
 * freezers reads as cold storage instantly.
 */
export function UprightFreezer({
  position,
  rotation = [0, 0, 0],
  width = 1.6,
  height = 2.6,
  depth = 0.9,
  label,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
  depth?: number;
  label?: string;
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Stainless carcass */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="#9FA9AD" roughness={0.34} metalness={0.86} />
      </mesh>
      {/* Recessed dark interior — visible through the glass */}
      <mesh position={[0, height / 2, depth / 2 - 0.06]}>
        <boxGeometry args={[width - 0.16, height - 0.2, 0.06]} />
        <meshStandardMaterial color="#16282E" roughness={0.7} />
      </mesh>
      {/* Wire shelves with a hint of stock on them */}
      {[0.28, 0.34, 0.6, 0.66, 0.92, 0.98].map((y, i) => (
        <mesh key={i} position={[0, y * height + 0.1, depth / 2 - 0.14]}>
          <boxGeometry args={[width - 0.24, 0.02, depth * 0.5]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#6E7A7E' : '#8A9498'}
            roughness={0.35}
            metalness={0.8}
          />
        </mesh>
      ))}
      {/* Pale stock blocks, so the shelves aren't visibly empty */}
      {[0.28, 0.6, 0.92].map((y, row) =>
        Array.from({ length: 3 }).map((_, col) => (
          <mesh
            key={`s-${row}-${col}`}
            position={[
              (col - 1) * (width - 0.5) * 0.32,
              y * height + 0.2,
              depth / 2 - 0.16,
            ]}
            rotation={[0, (col - 1) * 0.3, 0]}
            scale={[0.16, 0.07, 0.2]}
          >
            <sphereGeometry args={[1, 10, 8]} />
            <meshStandardMaterial
              color={row === 0 ? '#C3CFD2' : row === 1 ? '#B7C6C9' : '#AEBEC1'}
              roughness={0.3}
              metalness={0.5}
            />
          </mesh>
        ))
      )}
      {/* Glass door — the transmission pass is what makes it read as glass */}
      <mesh position={[0, height / 2, depth / 2 - 0.01]}>
        <boxGeometry args={[width - 0.1, height - 0.14, 0.03]} />
        <meshPhysicalMaterial
          color="#D7F0F4"
          roughness={0.05}
          metalness={0}
          transmission={0.92}
          thickness={0.15}
          transparent
          opacity={0.5}
          ior={1.4}
        />
      </mesh>
      {/* Door frame + vertical handle */}
      <mesh position={[0, height / 2, depth / 2]}>
        <boxGeometry args={[width - 0.06, height - 0.1, 0.04]} />
        <meshStandardMaterial
          color="#B4BEC2"
          roughness={0.25}
          metalness={0.9}
          transparent
          opacity={0.35}
        />
      </mesh>
      <mesh position={[width / 2 - 0.16, height / 2, depth / 2 + 0.08]} castShadow>
        <boxGeometry args={[0.05, height * 0.7, 0.05]} />
        <meshStandardMaterial color="#D4DBDE" roughness={0.15} metalness={0.96} />
      </mesh>
      {/* Interior LED strip — the cold key light */}
      <mesh position={[0, height - 0.14, depth / 2 - 0.2]}>
        <boxGeometry args={[width - 0.3, 0.04, 0.06]} />
        <meshStandardMaterial
          color="#EAFBFF"
          emissive="#CFF2FF"
          emissiveIntensity={3}
        />
      </mesh>
      <pointLight
        position={[0, height - 0.3, depth / 2 + 0.1]}
        intensity={4}
        distance={4.5}
        color="#CFEEFF"
      />
      {/* Base kick plate */}
      <mesh position={[0, 0.06, 0]} receiveShadow>
        <boxGeometry args={[width + 0.04, 0.12, depth + 0.04]} />
        <meshStandardMaterial color="#5C6A6E" roughness={0.5} metalness={0.5} />
      </mesh>
      {label && (
        <Text
          position={[0, height + 0.16, 0]}
          fontSize={0.13}
          color="#CFE9EF"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.14}
        >
          {label}
        </Text>
      )}
    </group>
  );
}

/** Horizontal chest freezer / ice table with a hinged lid. */
export function ChestFreezer({
  position,
  rotation = [0, 0, 0],
  width = 2,
  depth = 1.1,
  height = 0.9,
  lidOpen = false,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  depth?: number;
  height?: number;
  lidOpen?: boolean;
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="#A8B2B6" roughness={0.36} metalness={0.84} />
      </mesh>
      {/* Inner well */}
      <mesh position={[0, height * 0.78, 0]}>
        <boxGeometry args={[width - 0.14, 0.2, depth - 0.14]} />
        <meshStandardMaterial color="#1A2C32" roughness={0.7} />
      </mesh>
      {/* Lid, hinged open or closed */}
      <group position={[0, height, -depth / 2]} rotation={[-lidOpen ? 1.1 : 0, 0, 0]}>
        <mesh position={[0, 0.05, depth / 2]} castShadow>
          <boxGeometry args={[width, 0.1, depth]} />
          <meshStandardMaterial color="#C0C9CD" roughness={0.3} metalness={0.88} />
        </mesh>
        {/* Handle bar */}
        <mesh position={[0, 0.14, depth - 0.12]}>
          <cylinderGeometry args={[0.025, 0.025, width * 0.7, 8]} />
          <meshStandardMaterial color="#D4DBDE" roughness={0.18} metalness={0.95} />
        </mesh>
      </group>
      {/* Cool spill from the open well */}
      <pointLight
        position={[0, height + 0.3, 0]}
        intensity={lidOpen ? 3 : 1.6}
        distance={3.2}
        color="#C7ECFF"
      />
    </group>
  );
}

/** Stainless prep/sink unit — pairs with the freezers along the side walls. */
export function SinkUnit({
  position,
  rotation = [0, 0, 0],
  width = 1.8,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
}) {
  const depth = 0.8;
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, -0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.9, depth]} />
        <meshStandardMaterial color="#3D2A1E" roughness={0.7} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.08, 0.08, depth + 0.08]} />
        <meshStandardMaterial color="#C8CDD0" roughness={0.22} metalness={0.9} />
      </mesh>
      {/* Recessed basin */}
      <mesh position={[0, -0.02, 0]}>
        <boxGeometry args={[width * 0.5, 0.14, depth * 0.6]} />
        <meshStandardMaterial
          color="#7C878B"
          roughness={0.3}
          metalness={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Gooseneck tap */}
      <group position={[0, 0.06, -depth / 2 + 0.12]}>
        <mesh position={[0, 0.16, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.32, 8]} />
          <meshStandardMaterial color="#D4DBDE" roughness={0.15} metalness={0.96} />
        </mesh>
        <mesh position={[0, 0.32, 0.1]} rotation={[Math.PI / 2.4, 0, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.26, 8]} />
          <meshStandardMaterial color="#D4DBDE" roughness={0.15} metalness={0.96} />
        </mesh>
      </group>
    </group>
  );
}
