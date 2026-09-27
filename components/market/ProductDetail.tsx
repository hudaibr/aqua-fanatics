'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { products, type PreparationOption } from '@/data/products';
import { scaleIn, easeOutCubic } from '@/lib/animations';
import { useFocusTrap } from '@/hooks/useFocusTrap';

const ADDED_RESET_MS = 2000;

interface ProductDetailProps {
  productId: string | null;
  onClose: () => void;
  onAddToBasket: (productId: string, preparation: PreparationOption) => void;
  onOpenBasket: () => void;
}

export function ProductDetail({
  productId,
  onClose,
  onAddToBasket,
  onOpenBasket,
}: ProductDetailProps) {
  const [selectedPrep, setSelectedPrep] = useState<PreparationOption>('Whole');
  const [added, setAdded] = useState(false);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const product = products.find((p) => p.id === productId);
  const isOpen = Boolean(product);

  const panelRef = useFocusTrap<HTMLDivElement>(isOpen);

  // Reset the panel's state when a different product is opened. Adjusting state
  // during render (rather than in an effect) avoids a cascading re-render.
  const [lastProductId, setLastProductId] = useState(productId);
  if (productId !== lastProductId) {
    setLastProductId(productId);
    setSelectedPrep(product?.preparationOptions[0] ?? 'Whole');
    setAdded(false);
  }

  useEffect(() => {
    return () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    };
  }, []);

  const handleAdd = useCallback(() => {
    if (!product) return;
    onAddToBasket(product.id, selectedPrep);
    setAdded(true);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), ADDED_RESET_MS);
  }, [product, selectedPrep, onAddToBasket]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    },
    [onClose]
  );

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-detail-title"
            tabIndex={-1}
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.4, ease: easeOutCubic }}
            className="relative mx-4 max-h-[90vh] w-full max-w-md overflow-y-auto border border-[#F5F2EA]/15 bg-[#111111]/95 p-8 backdrop-blur-xl"
            data-scrollable
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close product details"
              className="absolute right-5 top-5 text-[#F5F2EA]/40 transition-colors hover:text-[#F5F2EA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F2EA]/70"
            >
              <X className="h-5 w-5" />
            </button>

            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#527C78]">
              {product.freshness}
            </p>
            <h2
              id="product-detail-title"
              className="mt-2 text-3xl font-light tracking-tight text-[#F5F2EA]"
            >
              {product.name}
            </h2>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#F5F2EA]/40">
              {product.origin}
            </p>

            <p className="mt-5 text-sm leading-relaxed text-[#F5F2EA]/60">
              {product.description}
            </p>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-2xl font-light text-[#F5F2EA]">
                Rs. {product.price.toLocaleString()}
              </span>
              <span className="text-sm text-[#F5F2EA]/40">/ {product.unit}</span>
            </div>

            <fieldset className="mt-6">
              <legend className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#F5F2EA]/40">
                Choose preparation
              </legend>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {product.preparationOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={selectedPrep === option}
                    onClick={() => setSelectedPrep(option)}
                    className={`border px-4 py-3 text-xs font-medium tracking-wide transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F2EA]/70 ${
                      selectedPrep === option
                        ? 'border-[#527C78] bg-[#527C78]/10 text-[#F5F2EA]'
                        : 'border-[#F5F2EA]/15 text-[#F5F2EA]/50 hover:border-[#F5F2EA]/30 hover:text-[#F5F2EA]/80'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 border border-[#F5F2EA]/30 py-4 text-xs font-medium uppercase tracking-[0.3em] text-[#F5F2EA] transition-all hover:bg-[#F5F2EA]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F2EA]/70"
              >
                {added ? 'Added' : 'Add to Basket'}
              </button>
              {added && (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={onOpenBasket}
                  aria-label="View basket"
                  className="border border-[#527C78] bg-[#527C78]/10 px-4 py-4 text-[#F5F2EA] transition-colors hover:bg-[#527C78]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F2EA]/70"
                >
                  <ShoppingBag className="h-4 w-4" />
                </motion.button>
              )}
            </div>

            <AnimatePresence>
              {added && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-3 text-center text-[10px] uppercase tracking-[0.2em] text-[#527C78]"
                >
                  Added to your catch
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
