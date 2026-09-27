'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { slideInRight, easeOutCubic } from '@/lib/animations';
import type { BasketItem } from '@/hooks/useProductInteraction';

interface BasketProps {
  open: boolean;
  items: BasketItem[];
  total: number;
  onClose: () => void;
  onRemove: (index: number) => void;
}

export function Basket({ open, items, total, onClose, onRemove }: BasketProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.4, ease: easeOutCubic }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-[#F5F2EA]/10 bg-[#111111]"
          >
            <div className="flex items-center justify-between border-b border-[#F5F2EA]/10 px-6 py-5">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-4 w-4 text-[#527C78]" />
                <h2 className="text-sm font-medium uppercase tracking-[0.25em] text-[#F5F2EA]">
                  Your Catch
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-[#F5F2EA]/40 transition-colors hover:text-[#F5F2EA]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center">
                  <p className="text-sm text-[#F5F2EA]/30">Your basket is empty.</p>
                  <p className="mt-2 text-xs text-[#F5F2EA]/20">
                    Explore the market to find your catch.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, i) => (
                    <motion.div
                      key={`${item.product.id}-${item.preparation}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start justify-between border-b border-[#F5F2EA]/8 pb-4"
                    >
                      <div>
                        <h3 className="text-sm font-medium text-[#F5F2EA]">
                          {item.product.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-[#F5F2EA]/40">
                          {item.quantity} {item.product.unit} · {item.preparation}
                        </p>
                        <p className="mt-1 text-xs text-[#F5F2EA]/60">
                          Rs. {(item.product.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => onRemove(i)}
                        className="text-[#F5F2EA]/30 transition-colors hover:text-[#F5F2EA]/60"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-[#F5F2EA]/10 px-6 py-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.25em] text-[#F5F2EA]/50">
                    Total
                  </span>
                  <span className="text-xl font-light text-[#F5F2EA]">
                    Rs. {total.toLocaleString()}
                  </span>
                </div>
                <button className="mt-5 w-full border border-[#F5F2EA]/30 py-4 text-xs font-medium uppercase tracking-[0.3em] text-[#F5F2EA] transition-all hover:bg-[#F5F2EA]/5">
                  Continue
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
