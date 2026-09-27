'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

/**
 * A tiling pattern used for the floor, walls and counter upstands. Baking
 * grout lines into a texture is dramatically cheaper than modelling every tile
 * as its own mesh, and it gives the specular highlights something to catch —
 * which is what stops large flat surfaces reading as empty.
 *
 * `tiles` is the number of cells per repeat, so the on-surface cell size in
 * scene units is (surface size) / (repeat * tiles).
 */
export function useTileTexture({
  size = 256,
  tiles = 4,
  grout = '#8A9498',
  groutWidth = 3,
  base = '#D8DCD6',
  offsetY = 0,
  repeat = [1, 1] as [number, number],
}: {
  size?: number;
  tiles?: number;
  grout?: string;
  groutWidth?: number;
  base?: string;
  offsetY?: number;
  repeat?: [number, number];
}) {
  // Destructure to primitives so the memo keys are stable — `repeat` is a
  // fresh array literal on every render.
  const [repeatX, repeatY] = repeat;

  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, size, size);
    const step = size / tiles;
    // Offset every other row for a brick bond.
    for (let row = 0; row < tiles; row++) {
      const shift = row % 2 === 0 ? offsetY : offsetY + step / 2;
      for (let col = -1; col <= tiles; col++) {
        const x = col * step + shift;
        const y = row * step;
        ctx.fillStyle = base;
        ctx.fillRect(x, y, step, step);
        ctx.strokeStyle = grout;
        ctx.lineWidth = groutWidth;
        ctx.strokeRect(x, y, step, step);
        // Soft highlight along the top of each tile for a slight bevel.
        ctx.strokeStyle = 'rgba(255,255,255,0.22)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y + 1);
        ctx.lineTo(x + step, y + 1);
        ctx.stroke();
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    // Without this the texture stretches once across the whole surface.
    tex.repeat.set(repeatX, repeatY);
    tex.anisotropy = 4;
    return tex;
  }, [size, tiles, grout, groutWidth, base, offsetY, repeatX, repeatY]);
}
