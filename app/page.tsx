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

export default function Home() {
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isEntered, setIsEntered] = useState(false);
  const scrollAccumulator = useRef(0);
  const wheelTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    selectProduct,
    setHovered,
    addToBasket,
    removeFromBasket,
    setBasketOpen,
  } = useProductInteraction();

  // Simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 4;
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  const handleEnter = () => {
    setIsEntered(true);
    navigateTo('entrance');
  };

  // Scroll-driven navigation
  useEffect(() => {
    if (!isEntered) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isTransitioning) return;

      scrollAccumulator.current += e.deltaY;

      if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
      wheelTimeout.current = setTimeout(() => {
        scrollAccumulator.current = 0;
      }, 200);

      if (Math.abs(scrollAccumulator.current) > 120) {
        if (scrollAccumulator.current > 0) {
          goNext();
        } else {
          goPrev();
        }
        scrollAccumulator.current = 0;
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      if (isTransitioning) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'Escape') {
        selectProduct(null);
        setBasketOpen(false);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKey);
    };
  }, [isEntered, isTransitioning, goNext, goPrev, selectProduct, setBasketOpen]);

  // Touch navigation for mobile
  const touchStartY = useRef(0);
  useEffect(() => {
    if (!isEntered) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (isTransitioning) return;
      const diff = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goNext();
        else goPrev();
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isEntered, isTransitioning, goNext, goPrev]);

  const handleAddToBasket = useCallback(
    (productId: string, preparation: PreparationOption) => {
      const fullProduct = products.find((p) => p.id === productId);
      if (fullProduct) {
        addToBasket(fullProduct, preparation);
      }
    },
    [addToBasket]
  );

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
      />

      {/* Basket panel */}
      <Basket
        open={basketOpen}
        items={basket}
        total={basketTotal}
        onClose={() => setBasketOpen(false)}
        onRemove={removeFromBasket}
      />

      {/* Delivery section overlay */}
      <DeliverySection visible={isEntered && isDelivery} />

      {/* Vignette overlay for depth */}
      {isEntered && (
        <div className="pointer-events-none fixed inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_65%,rgba(10,22,24,0.18)_100%)]" />
      )}

      {/* Storytelling hints */}
      {isEntered && !isDelivery && !activeProductId && (
        <div className="pointer-events-none fixed bottom-20 left-1/2 z-20 -translate-x-1/2 text-center sm:bottom-24">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#F5F2EA]/25">
            Scroll or swipe to explore
          </p>
        </div>
      )}
    </main>
  );
}
