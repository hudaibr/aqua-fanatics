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
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
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
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-background/80 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-8 py-6">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <h2
                  id="basket-title"
                  className="text-sm font-sans uppercase tracking-[0.25em] text-foreground"
                >
                  Your Selection
                </h2>
                {isHydrated && itemCount > 0 && (
                  <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] text-primary">
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close basket"
                className="text-foreground/40 transition-colors hover:text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                <X className="h-6 w-6 stroke-[1.5]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6" data-scrollable>
              {!isHydrated ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm font-sans text-foreground/40">Loading...</p>
                </div>
              ) : items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="text-sm font-sans text-foreground/40">Your basket is empty.</p>
                  <p className="mt-2 text-xs font-sans text-foreground/30">
                    Explore the market to find your catch.
                  </p>
                  <button
                    type="button"
                    onClick={onShop}
                    className="mt-8 border border-foreground/30 px-8 py-4 text-[10px] font-sans uppercase tracking-[0.25em] text-foreground transition-all duration-300 hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  >
                    Shop Today&apos;s Catch
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item, i) => (
                    <motion.div
                      key={`${item.product.id}-${item.preparation}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start justify-between gap-4 border-b border-white/5 pb-6"
                    >
                      <div className="min-w-0">
                        <h3 className="text-lg font-serif text-foreground">
                          {item.product.name}
                        </h3>
                        <p className="mt-1 text-xs font-sans uppercase tracking-[0.1em] text-foreground/50">
                          {item.preparation} · {item.product.unit}
                        </p>
                        <p className="mt-2 text-sm font-sans text-foreground/70">
                          Rs. {(item.product.price * item.quantity).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-col items-end gap-3">
                        <div className="flex items-center border border-white/20">
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
                            className="px-3 py-2 text-foreground/50 transition-colors hover:bg-white/5 hover:text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span
                            aria-live="polite"
                            className="min-w-[2ch] text-center text-sm font-sans text-foreground"
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
                            className="px-3 py-2 text-foreground/50 transition-colors hover:bg-white/5 hover:text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
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
                          className="text-foreground/30 transition-colors hover:text-destructive focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
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
              <div className="border-t border-white/10 px-8 py-6 bg-background/50">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-sans uppercase tracking-[0.25em] text-foreground/60">
                    Total
                  </span>
                  <span className="text-2xl font-serif text-foreground">
                    Rs. {total.toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={onClear}
                    className="border border-white/20 px-6 py-4 text-[10px] font-sans uppercase tracking-[0.2em] text-foreground/60 transition-colors hover:border-white/40 hover:text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={onCheckout}
                    className="flex-1 border border-primary/50 bg-primary/5 py-4 text-xs font-sans uppercase tracking-[0.3em] text-primary transition-all hover:bg-primary/20 hover:border-primary focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
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
