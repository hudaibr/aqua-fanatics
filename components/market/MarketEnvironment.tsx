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

interface MarketEnvironmentProps {
  activeProductId: string | null;
  hoveredProductId: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color="#26383A" roughness={0.55} metalness={0.15} />
    </mesh>
  );
}

function Walls() {
  return (
    <>
      {/* Back wall */}
      <mesh position={[0, 3, -22]} receiveShadow>
        <planeGeometry args={[40, 8]} />
        <meshStandardMaterial color="#354649" roughness={0.9} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-15, 3, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[40, 8]} />
        <meshStandardMaterial color="#2F4043" roughness={0.9} />
      </mesh>
      {/* Right wall */}
      <mesh position={[15, 3, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[40, 8]} />
        <meshStandardMaterial color="#2F4043" roughness={0.9} />
      </mesh>
      {/* Ceiling */}
      <mesh position={[0, 7, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#243437" roughness={0.92} />
      </mesh>
    </>
  );
}

function HangingLights() {
  const lights = useMemo(() => {
    const arr: { pos: [number, number, number]; color: string }[] = [];
    for (let i = 0; i < 5; i++) {
      arr.push({
        pos: [(i - 2) * 5, 5.5, -2 - i * 2],
        color: '#FFD9A0',
      });
    }
    return arr;
  }, []);

  return (
    <group>
      {lights.map((light, i) => (
        <group key={i} position={light.pos}>
          {/* Cord */}
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 1, 6]} />
            <meshStandardMaterial color="#4A5E60" />
          </mesh>
          {/* Shade */}
          <mesh position={[0, 0, 0]}>
            <coneGeometry args={[0.3, 0.25, 16, 1, true]} />
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
            distance={12}
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
        <meshStandardMaterial color="#A8784F" roughness={0.45} />
      </mesh>
      <Text
        position={[0, 4.5, 0.1]}
        fontSize={0.35}
        color="#F5F2EA"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.15}
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
        <meshStandardMaterial color="#3D2A1E" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.1, 0.08, 1.7]} />
        <meshStandardMaterial color="#D0D5D8" roughness={0.15} metalness={0.95} />
      </mesh>
      {/* Delivery box */}
      <mesh position={[0.5, 0.3, 0]} castShadow>
        <boxGeometry args={[0.8, 0.5, 0.6]} />
        <meshStandardMaterial color="#F5F2EA" roughness={0.8} />
      </mesh>
      <mesh position={[-0.8, 0.25, 0]} castShadow>
        <boxGeometry args={[0.6, 0.4, 0.5]} />
        <meshStandardMaterial color="#527C78" roughness={0.7} />
      </mesh>
      {/* Rope divider */}
      <mesh position={[-1.5, 0.5, 0.5]}>
        <cylinderGeometry args={[0.02, 0.02, 1.5, 8]} />
        <meshStandardMaterial color="#6B4A32" roughness={0.6} />
      </mesh>
      <mesh position={[-1.5, 0, 0.5]}>
        <cylinderGeometry args={[0.03, 0.03, 1, 8]} />
        <meshStandardMaterial color="#3D2A1E" roughness={0.6} />
      </mesh>
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

      {/* Delivery area - far back */}
      <DeliveryArea />

      {/* Ambient lighting */}
      <ambientLight intensity={1.15} color="#FFF1DD" />
      <hemisphereLight args={['#FFE0B5', '#31545A', 1.1]} />
      {/* Key light — the only shadow caster, so the scene is rendered to a
          single shadow map per frame. Bounded by an orthographic frustum that
          tightly hugs the market floor. */}
      <directionalLight
        position={[0, 8, 8]}
        intensity={2.5}
        color="#FFF4E6"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
        shadow-camera-near={0.5}
        shadow-camera-far={45}
        shadow-bias={-0.0005}
      />
      <directionalLight position={[-8, 5, -8]} intensity={1.5} color="#BFE7EA" />
      {/* Cool fill from front */}
      <pointLight position={[0, 4, 12]} intensity={4} distance={25} color="#EAF4F5" />
      {/* Warm fill mid */}
      <pointLight position={[0, 4, -5]} intensity={3} distance={20} color="#FFD9A0" />
      {/* Accent on the premium counter — light only, no shadow pass */}
      <spotLight
        position={[0, 6, -10]}
        angle={0.6}
        penumbra={0.4}
        intensity={8}
        distance={15}
        color="#FFE8D0"
      />
    </group>
  );
}
