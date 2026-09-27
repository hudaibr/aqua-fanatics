/**
 * Deterministic PRNG helpers.
 *
 * `Math.random()` cannot be used during render: it is impure, so the result
 * changes whenever a component re-renders and it also differs between the
 * server and the client (a hydration mismatch). A seeded generator gives
 * stable, repeatable "random-looking" layout for decorative geometry.
 */

export type Random = () => number;

/** mulberry32 — small, fast, well-distributed 32-bit PRNG. */
export function createRandom(seed: number): Random {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Hash a small tuple of numbers into a 32-bit seed. */
export function hashSeed(...values: number[]): number {
  let h = 2166136261;
  for (const value of values) {
    // Quantise so -0.3 and -0.30000000000000004 map to the same seed.
    const q = Math.round(value * 1000);
    h ^= q + 0x9e3779b9 + (h << 6) + (h >>> 2);
    h >>>= 0;
  }
  return h >>> 0;
}
