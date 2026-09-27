'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { products, type PreparationOption } from '@/data/products';
import { scaleIn, easeOutCubic } from '@/lib/animations';

interface ProductDetailProps {
  productId: string | null;
  onClose: () => void;
  onAddToBasket: (productId: string, preparation: PreparationOption) => void;
}

export function ProductDetail({ productId, onClose, onAddToBasket }: ProductDetailProps) {
  const [selectedPrep, setSelectedPrep] = useState<PreparationOption>('Whole');
  const [added, setAdded] = useState(false);

  const product = products.find((p) => p.id === productId);

  useEffect(() => {
    if (productId) {
      setSelectedPrep('Whole');
      setAdded(false);
    }
  }, [productId]);

  const handleAdd = () => {
    if (product) {
      onAddToBasket(product.id, selectedPrep);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

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
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.4, ease: easeOutCubic }}
            className="relative mx-4 w-full max-w-md border border-[#F5F2EA]/15 bg-[#111111]/95 p-8 backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute right-5 top-5 text-[#F5F2EA]/40 transition-colors hover:text-[#F5F2EA]"
            >
              <X className="h-5 w-5" />
            </button>

            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#527C78]">
              {product.freshness}
            </p>
            <h2 className="mt-2 text-3xl font-light tracking-tight text-[#F5F2EA]">
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

            <div className="mt-6">
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#F5F2EA]/40">
                Choose preparation
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {product.preparationOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelectedPrep(option)}
                    className={`border px-4 py-3 text-xs font-medium tracking-wide transition-all ${
                      selectedPrep === option
                        ? 'border-[#527C78] bg-[#527C78]/10 text-[#F5F2EA]'
                        : 'border-[#F5F2EA]/15 text-[#F5F2EA]/50 hover:border-[#F5F2EA]/30 hover:text-[#F5F2EA]/80'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAdd}
              className="mt-8 w-full border border-[#F5F2EA]/30 py-4 text-xs font-medium uppercase tracking-[0.3em] text-[#F5F2EA] transition-all hover:bg-[#F5F2EA]/5"
            >
              {added ? 'Added to basket' : 'Add to Basket'}
            </button>

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
