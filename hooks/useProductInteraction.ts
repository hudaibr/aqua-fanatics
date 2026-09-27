'use client';

import { useState, useCallback } from 'react';
import type { MarketProduct, PreparationOption } from '@/data/products';

export interface BasketItem {
  product: MarketProduct;
  quantity: number;
  preparation: PreparationOption;
}

export function useProductInteraction() {
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [basketOpen, setBasketOpen] = useState(false);

  const selectProduct = useCallback((id: string | null) => {
    setActiveProductId(id);
  }, []);

  const setHovered = useCallback((id: string | null) => {
    setHoveredProductId(id);
  }, []);

  const addToBasket = useCallback(
    (product: MarketProduct, preparation: PreparationOption) => {
      setBasket((prev) => {
        const existing = prev.find(
          (item) =>
            item.product.id === product.id &&
            item.preparation === preparation
        );
        if (existing) {
          return prev.map((item) =>
            item.product.id === product.id &&
            item.preparation === preparation
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { product, quantity: 1, preparation }];
      });
    },
    []
  );

  const removeFromBasket = useCallback((index: number) => {
    setBasket((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const basketCount = basket.reduce((sum, item) => sum + item.quantity, 0);
  const basketTotal = basket.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return {
    activeProductId,
    hoveredProductId,
    basket,
    basketOpen,
    basketCount,
    basketTotal,
    selectProduct,
    setHovered,
    addToBasket,
    removeFromBasket,
    setBasketOpen,
  };
}
