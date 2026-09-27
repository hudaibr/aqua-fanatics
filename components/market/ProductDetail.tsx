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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
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
            className="relative mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto border border-white/10 bg-background/60 p-10 backdrop-blur-2xl shadow-2xl"
            data-scrollable
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close product details"
              className="absolute right-6 top-6 text-foreground/40 transition-colors hover:text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              <X className="h-6 w-6 stroke-[1.5]" />
            </button>

            <p className="text-[10px] font-sans font-medium uppercase tracking-[0.3em] text-primary/80">
              {product.freshness}
            </p>
            <h2
              id="product-detail-title"
              className="mt-3 text-4xl font-serif text-foreground"
            >
              {product.name}
            </h2>
            <p className="mt-2 text-xs font-sans uppercase tracking-[0.2em] text-foreground/50">
              {product.origin}
            </p>

            <p className="mt-6 text-sm font-sans leading-relaxed text-foreground/70">
              {product.description}
            </p>

            <div className="mt-8 flex items-baseline gap-3">
              <span className="text-3xl font-serif text-foreground">
                Rs. {product.price.toLocaleString()}
              </span>
              <span className="text-sm font-sans text-foreground/40">/ {product.unit}</span>
            </div>

            <fieldset className="mt-10">
              <legend className="text-[10px] font-sans uppercase tracking-[0.25em] text-foreground/50">
                Preparation
              </legend>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {product.preparationOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={selectedPrep === option}
                    onClick={() => setSelectedPrep(option)}
                    className={`border px-4 py-3 text-xs font-sans uppercase tracking-widest transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
                      selectedPrep === option
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-white/10 text-foreground/50 hover:border-white/30 hover:text-foreground'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="mt-10 flex gap-4">
              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 border border-white/20 py-4 text-xs font-sans uppercase tracking-[0.3em] text-foreground transition-all duration-500 hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
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
                  className="border border-primary bg-primary/10 px-5 py-4 text-primary transition-colors hover:bg-primary/20 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                >
                  <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
                </motion.button>
              )}
            </div>

            <AnimatePresence>
              {added && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-4 text-center text-[10px] font-sans uppercase tracking-[0.2em] text-primary"
                >
                  Added to your selection
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
