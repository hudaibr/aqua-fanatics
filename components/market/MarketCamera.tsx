'use client';

import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { cameraTargets, type MarketSection } from '@/lib/camera';

interface MarketCameraProps {
  target: MarketSection;
  isEntered: boolean;
}

export function MarketCamera({ target, isEntered }: MarketCameraProps) {
  const { camera } = useThree();
  const currentPos = useRef(new THREE.Vector3(0, 3, 20));
  const currentLookAt = useRef(new THREE.Vector3(0, 1.5, 0));
  const currentFov = useRef(55);
  const targetPos = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const targetFov = useRef(55);

  useEffect(() => {
    if (!isEntered) {
      targetPos.current.set(0, 2.5, 16);
      targetLookAt.current.set(0, 1.5, 0);
      targetFov.current = 58;
    }
  }, [isEntered]);

  useFrame((_, delta) => {
    const t = cameraTargets[target];
    if (isEntered) {
      targetPos.current.set(...t.position);
      targetLookAt.current.set(...t.lookAt);
      targetFov.current = t.fov;
    }

    const lerpSpeed = Math.min(delta * 4, 1);

    currentPos.current.lerp(targetPos.current, lerpSpeed);
    currentLookAt.current.lerp(targetLookAt.current, lerpSpeed);
    currentFov.current += (targetFov.current - currentFov.current) * lerpSpeed;

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);

    if ((camera as THREE.PerspectiveCamera).fov !== currentFov.current) {
      (camera as THREE.PerspectiveCamera).fov = currentFov.current;
      (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
    }
  });

  return null;
}
