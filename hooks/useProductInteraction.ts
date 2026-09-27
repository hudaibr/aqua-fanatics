'use client';

import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';
import { basketStore, type BasketItem } from '@/lib/basketStore';
import type { MarketProduct, PreparationOption } from '@/data/products';

export type { BasketItem };

const emptySubscribe = () => () => {};

/**
 * `false` during SSR and the first client render, `true` afterwards — so UI can
 * avoid flashing an empty basket before the persisted one is read.
 */
function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function useProductInteraction() {
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
  const [basketOpen, setBasketOpen] = useState(false);

  const basket = useSyncExternalStore(
    basketStore.subscribe,
    basketStore.getSnapshot,
    basketStore.getServerSnapshot
  );
  const isHydrated = useHydrated();

  const selectProduct = useCallback((id: string | null) => {
    setActiveProductId(id);
  }, []);

  const setHovered = useCallback((id: string | null) => {
    setHoveredProductId(id);
  }, []);

  const addToBasket = useCallback(
    (product: MarketProduct, preparation: PreparationOption) => {
      basketStore.add(product, preparation);
    },
    []
  );

  const setQuantity = useCallback(
    (productId: string, preparation: PreparationOption, quantity: number) => {
      basketStore.setQuantity(productId, preparation, quantity);
    },
    []
  );

  const clearBasket = useCallback(() => {
    basketStore.clear();
  }, []);

  const basketCount = useMemo(
    () => basket.reduce((sum, item) => sum + item.quantity, 0),
    [basket]
  );

  const basketTotal = useMemo(
    () => basket.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [basket]
  );

  return {
    activeProductId,
    hoveredProductId,
    basket,
    basketOpen,
    basketCount,
    basketTotal,
    isHydrated,
    selectProduct,
    setHovered,
    addToBasket,
    setQuantity,
    clearBasket,
    setBasketOpen,
  };
}
