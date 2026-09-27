'use client';

import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import type * as THREE from 'three';
import { Vector3 } from 'three';
import { cameraTargets, type MarketSection } from '@/lib/camera';

interface MarketCameraProps {
  target: MarketSection;
  isEntered: boolean;
}

export function MarketCamera({ target, isEntered }: MarketCameraProps) {
  // Held in a ref so the render loop mutates the three.js camera — the render
  // loop is the sanctioned imperative escape hatch, and r3f owns the camera.
  const cameraRef = useRef<THREE.Camera | null>(null);
  const { camera } = useThree();

  useEffect(() => {
    cameraRef.current = camera;
  }, [camera]);

  const currentPos = useRef(new Vector3(0, 3, 20));
  const currentLookAt = useRef(new Vector3(0, 1.5, 0));
  const currentFov = useRef(55);
  const targetPos = useRef(new Vector3(0, 2.5, 16));
  const targetLookAt = useRef(new Vector3(0, 1.5, 0));
  const targetFov = useRef(58);

  useEffect(() => {
    if (!isEntered) {
      targetPos.current.set(0, 2.5, 16);
      targetLookAt.current.set(0, 1.5, 0);
      targetFov.current = 58;
    }
  }, [isEntered]);

  useFrame((_, delta) => {
    const cam = cameraRef.current;
    if (!cam) return;

    const t = cameraTargets[target];
    if (isEntered) {
      targetPos.current.set(t.position[0], t.position[1], t.position[2]);
      targetLookAt.current.set(t.lookAt[0], t.lookAt[1], t.lookAt[2]);
      targetFov.current = t.fov;
    }

    const lerpSpeed = Math.min(delta * 4, 1);

    currentPos.current.lerp(targetPos.current, lerpSpeed);
    currentLookAt.current.lerp(targetLookAt.current, lerpSpeed);

    cam.position.copy(currentPos.current);
    cam.lookAt(currentLookAt.current);

    const perspective = cam as THREE.PerspectiveCamera;
    const nextFov = currentFov.current + (targetFov.current - currentFov.current) * lerpSpeed;
    currentFov.current = nextFov;

    if (perspective.isPerspectiveCamera && Math.abs(perspective.fov - nextFov) > 0.01) {
      perspective.fov = nextFov;
      perspective.updateProjectionMatrix();
    }
  });

  return null;
}
