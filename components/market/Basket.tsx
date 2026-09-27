'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Minus, Plus } from 'lucide-react';
import { slideInRight, easeOutCubic } from '@/lib/animations';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import type { BasketItem } from '@/hooks/useProductInteraction';
import type { PreparationOption } from '@/data/products';

interface BasketProps {
  open: boolean;
  items: BasketItem[];
  total: number;
  isHydrated: boolean;
  onClose: () => void;
  onSetQuantity: (
    productId: string,
    preparation: PreparationOption,
    quantity: number
  ) => void;
  onClear: () => void;
  onCheckout: () => void;
  onShop: () => void;
}

export function Basket({
  open,
  items,
  total,
  isHydrated,
  onClose,
  onSetQuantity,
  onClear,
  onCheckout,
  onShop,
}: BasketProps) {
  const panelRef = useFocusTrap<HTMLElement>(open);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

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
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="basket-title"
            tabIndex={-1}
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
                <h2
                  id="basket-title"
                  className="text-sm font-medium uppercase tracking-[0.25em] text-[#F5F2EA]"
                >
                  Your Catch
                </h2>
                {isHydrated && itemCount > 0 && (
                  <span className="rounded-full bg-[#527C78]/20 px-2 py-0.5 text-[10px] text-[#527C78]">
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close basket"
                className="text-[#F5F2EA]/40 transition-colors hover:text-[#F5F2EA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F2EA]/70"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4" data-scrollable>
              {!isHydrated ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-[#F5F2EA]/30">Loading your catch…</p>
                </div>
              ) : items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="text-sm text-[#F5F2EA]/30">Your basket is empty.</p>
                  <p className="mt-2 text-xs text-[#F5F2EA]/20">
                    Explore the market to find your catch.
                  </p>
                  <button
                    type="button"
                    onClick={onShop}
                    className="mt-6 border border-[#F5F2EA]/30 px-6 py-3 text-[10px] font-medium uppercase tracking-[0.25em] text-[#F5F2EA] transition-colors hover:bg-[#F5F2EA]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F2EA]/70"
                  >
                    Shop Today&apos;s Catch
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, i) => (
                    <motion.div
                      key={`${item.product.id}-${item.preparation}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start justify-between gap-3 border-b border-[#F5F2EA]/10 pb-4"
                    >
                      <div className="min-w-0">
                        <h3 className="text-sm font-medium text-[#F5F2EA]">
                          {item.product.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-[#F5F2EA]/40">
                          {item.preparation} · {item.product.unit}
                        </p>
                        <p className="mt-1 text-xs text-[#F5F2EA]/60">
                          Rs. {(item.product.price * item.quantity).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <div className="flex items-center border border-[#F5F2EA]/15">
                          <button
                            type="button"
                            aria-label={`Decrease quantity of ${item.product.name}`}
                            onClick={() =>
                              onSetQuantity(
                                item.product.id,
                                item.preparation,
                                item.quantity - 1
                              )
                            }
                            className="px-2 py-1.5 text-[#F5F2EA]/50 transition-colors hover:bg-[#F5F2EA]/5 hover:text-[#F5F2EA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F2EA]/70"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span
                            aria-live="polite"
                            className="min-w-[2ch] text-center text-xs text-[#F5F2EA]"
                          >
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label={`Increase quantity of ${item.product.name}`}
                            onClick={() =>
                              onSetQuantity(
                                item.product.id,
                                item.preparation,
                                item.quantity + 1
                              )
                            }
                            className="px-2 py-1.5 text-[#F5F2EA]/50 transition-colors hover:bg-[#F5F2EA]/5 hover:text-[#F5F2EA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F2EA]/70"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            onSetQuantity(item.product.id, item.preparation, 0)
                          }
                          aria-label={`Remove ${item.product.name} from basket`}
                          className="text-[#F5F2EA]/30 transition-colors hover:text-[#F5F2EA]/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F2EA]/70"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {isHydrated && items.length > 0 && (
              <div className="border-t border-[#F5F2EA]/10 px-6 py-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.25em] text-[#F5F2EA]/50">
                    Total
                  </span>
                  <span className="text-xl font-light text-[#F5F2EA]">
                    Rs. {total.toLocaleString()}
                  </span>
                </div>
                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={onClear}
                    className="border border-[#F5F2EA]/15 px-4 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-[#F5F2EA]/50 transition-colors hover:border-[#F5F2EA]/40 hover:text-[#F5F2EA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F2EA]/70"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={onCheckout}
                    className="flex-1 border border-[#F5F2EA]/30 py-4 text-xs font-medium uppercase tracking-[0.3em] text-[#F5F2EA] transition-all hover:bg-[#F5F2EA]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F2EA]/70"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
