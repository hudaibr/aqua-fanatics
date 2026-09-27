'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MarketScene } from '@/components/market/MarketScene';
import { LoadingScreen } from '@/components/market/LoadingScreen';
import { MarketNavigation } from '@/components/market/MarketNavigation';
import { ProductDetail } from '@/components/market/ProductDetail';
import { Basket } from '@/components/market/Basket';
import { BasketButton } from '@/components/market/BasketButton';
import { DeliverySection } from '@/components/market/DeliverySection';
import { useMarketNavigation } from '@/hooks/useMarketNavigation';
import { useProductInteraction } from '@/hooks/useProductInteraction';
import { products, type PreparationOption } from '@/data/products';

const WHEEL_THRESHOLD = 120;
const WHEEL_RESET_MS = 200;

export default function Home() {
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isEntered, setIsEntered] = useState(false);
  const scrollAccumulator = useRef(0);
  const wheelTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartY = useRef(0);

  const {
    currentSection,
    isTransitioning,
    navigateTo,
    goNext,
    goPrev,
    goHome,
  } = useMarketNavigation();

  const {
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
  } = useProductInteraction();

  // A modal overlay owns the wheel/scroll while it is open.
  const isOverlayOpen = Boolean(activeProductId) || basketOpen;

  const handleProgress = useCallback((next: number) => {
    setProgress((prev) => (next > prev ? next : prev));
  }, []);

  const handleSceneReady = useCallback(() => {
    setProgress(100);
    setIsReady(true);
  }, []);

  const handleEnter = useCallback(() => {
    setIsEntered(true);
    navigateTo('entrance');
  }, [navigateTo]);

  useEffect(() => {
    return () => {
      if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
    };
  }, []);

  // Scroll-driven navigation.
  useEffect(() => {
    if (!isEntered) return;

    const isScrollableTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      // Let overlay panels scroll themselves instead of driving the camera.
      return (
        target.closest('[data-scrollable]') !== null ||
        target.closest('dialog, [role="dialog"]') !== null
      );
    };

    const handleWheel = (e: WheelEvent) => {
      // Never hijack the wheel while a panel or dialog owns it.
      if (isOverlayOpen || isScrollableTarget(e.target)) return;

      e.preventDefault();
      if (isTransitioning) return;

      scrollAccumulator.current += e.deltaY;

      if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
      wheelTimeout.current = setTimeout(() => {
        scrollAccumulator.current = 0;
      }, WHEEL_RESET_MS);

      if (Math.abs(scrollAccumulator.current) > WHEEL_THRESHOLD) {
        if (scrollAccumulator.current > 0) {
          goNext();
        } else {
          goPrev();
        }
        scrollAccumulator.current = 0;
      }
    };

    const isInteractiveTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      return (
        target.closest('input, textarea, select, [contenteditable="true"]') !==
        null
      );
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        selectProduct(null);
        setBasketOpen(false);
        return;
      }

      // Do not steal arrow keys from form fields or while a modal is open —
      // those arrows belong to the panel the user is interacting with.
      if (isOverlayOpen || isInteractiveTarget(e.target)) return;
      if (isTransitioning) return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isOverlayOpen || isTransitioning) return;
      const diff = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goNext();
        else goPrev();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKey);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [
    isEntered,
    isTransitioning,
    isOverlayOpen,
    goNext,
    goPrev,
    selectProduct,
    setBasketOpen,
  ]);

  const handleAddToBasket = useCallback(
    (productId: string, preparation: PreparationOption) => {
      const fullProduct = products.find((p) => p.id === productId);
      if (fullProduct) {
        addToBasket(fullProduct, preparation);
      }
    },
    [addToBasket]
  );

  const handleCheckout = useCallback(() => {
    clearBasket();
    setBasketOpen(false);
    navigateTo('entrance');
  }, [clearBasket, setBasketOpen, navigateTo]);

  const isDelivery = currentSection === 'delivery';

  return (
    <main className="fixed inset-0 overflow-hidden bg-[#172225]">
      {/* 3D Scene */}
      <div className="absolute inset-0">
        <MarketScene
          targetSection={currentSection}
          isEntered={isEntered}
          activeProductId={activeProductId}
          hoveredProductId={hoveredProductId}
          onSelect={selectProduct}
          onHover={setHovered}
          onProgress={handleProgress}
          onReady={handleSceneReady}
        />
      </div>

      {/* Loading screen — unmounts once the user enters */}
      {!isEntered && (
        <LoadingScreen
          progress={progress}
          isReady={isReady}
          onEnter={handleEnter}
        />
      )}

      {/* Navigation UI */}
      <MarketNavigation
        currentSection={currentSection}
        isEntered={isEntered}
        onNavigate={navigateTo}
        onBack={goPrev}
        onHome={goHome}
      />

      {/* Basket button */}
      <BasketButton
        count={basketCount}
        isEntered={isEntered}
        onClick={() => setBasketOpen(true)}
      />

      {/* Product detail panel */}
      <ProductDetail
        productId={activeProductId}
        onClose={() => selectProduct(null)}
        onAddToBasket={handleAddToBasket}
        onOpenBasket={() => {
          selectProduct(null);
          setBasketOpen(true);
        }}
      />

      {/* Basket panel */}
      <Basket
        open={basketOpen}
        items={basket}
        total={basketTotal}
        isHydrated={isHydrated}
        onClose={() => setBasketOpen(false)}
        onSetQuantity={setQuantity}
        onClear={clearBasket}
        onCheckout={handleCheckout}
        onShop={() => {
          setBasketOpen(false);
          navigateTo('fish');
        }}
      />

      {/* Delivery section overlay */}
      <DeliverySection
        visible={isEntered && isDelivery}
        onShop={() => navigateTo('fish')}
      />

      {/* Vignette overlay for depth */}
      {isEntered && (
        <div className="pointer-events-none fixed inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_65%,rgba(10,22,24,0.18)_100%)]" />
      )}

      {/* Storytelling hints */}
      {isEntered && !isDelivery && !activeProductId && !basketOpen && (
        <div className="pointer-events-none fixed bottom-20 left-1/2 z-20 -translate-x-1/2 text-center sm:bottom-24">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#F5F2EA]/25">
            Scroll or swipe to explore
          </p>
        </div>
      )}
    </main>
  );
}
