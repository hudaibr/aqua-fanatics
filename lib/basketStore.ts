'use client';

import type { MarketProduct, PreparationOption } from '@/data/products';

export interface BasketItem {
  product: MarketProduct;
  quantity: number;
  preparation: PreparationOption;
}

const STORAGE_KEY = 'aqua-fanatics:basket';
const EMPTY: BasketItem[] = [];

const listeners = new Set<() => void>();

/** `null` until the persisted basket has been read from storage. */
let cache: BasketItem[] | null = null;

function isBasketItem(value: unknown): value is BasketItem {
  if (typeof value !== 'object' || value === null) return false;
  const item = value as Partial<BasketItem>;
  return (
    typeof item.quantity === 'number' &&
    item.quantity > 0 &&
    typeof item.preparation === 'string' &&
    typeof item.product === 'object' &&
    item.product !== null &&
    typeof (item.product as MarketProduct).id === 'string'
  );
}

function readStorage(): BasketItem[] {
  if (typeof window === 'undefined') return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    return parsed.filter(isBasketItem);
  } catch {
    return EMPTY;
  }
}

function persist(items: BasketItem[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Quota exceeded or private mode — keep working from memory.
  }
}

function emit() {
  for (const listener of listeners) listener();
}

function commit(next: BasketItem[]) {
  cache = next;
  persist(next);
  emit();
}

export const basketStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  /** Client snapshot. Cached so the reference is stable between renders. */
  getSnapshot(): BasketItem[] {
    if (cache === null) cache = readStorage();
    return cache;
  },

  /**
   * Server snapshot. Always empty, so the server-rendered markup matches the
   * first client render and React hydrates without a mismatch; the real basket
   * is picked up immediately afterwards.
   */
  getServerSnapshot(): BasketItem[] {
    return EMPTY;
  },

  add(product: MarketProduct, preparation: PreparationOption) {
    const current = basketStore.getSnapshot();
    const existing = current.find(
      (item) =>
        item.product.id === product.id && item.preparation === preparation
    );

    if (existing) {
      commit(
        current.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
      return;
    }

    commit([...current, { product, quantity: 1, preparation }]);
  },

  setQuantity(
    productId: string,
    preparation: PreparationOption,
    quantity: number
  ) {
    const current = basketStore.getSnapshot();
    if (quantity <= 0) {
      commit(
        current.filter(
          (item) =>
            !(
              item.product.id === productId && item.preparation === preparation
            )
        )
      );
      return;
    }

    commit(
      current.map((item) =>
        item.product.id === productId && item.preparation === preparation
          ? { ...item, quantity }
          : item
      )
    );
  },

  clear() {
    commit([]);
  },
};
