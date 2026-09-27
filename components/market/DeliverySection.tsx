'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';

interface DeliverySectionProps {
  visible: boolean;
  onShop: () => void;
}

export function DeliverySection({ visible, onShop }: DeliverySectionProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center bg-gradient-to-t from-background via-background/80 to-transparent px-6 pb-28 pt-24 sm:pb-32"
        >
          <div className="pointer-events-auto flex flex-col items-center text-center">
            <motion.h1
              variants={fadeInUp}
              className="text-4xl font-serif leading-tight text-foreground sm:text-6xl"
            >
              From our market
              <br />
              to your table.
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-6 max-w-md text-sm font-sans leading-relaxed text-foreground/60"
            >
              Freshly selected. Carefully prepared. Delivered to your door.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
            >
              <button
                type="button"
                onClick={onShop}
                className="border border-foreground bg-foreground/5 px-10 py-4 text-xs font-sans uppercase tracking-[0.3em] text-foreground transition-all hover:bg-foreground/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                Shop Today&apos;s Catch
              </button>
              <a
                href="mailto:hello@aquafanatics.com"
                className="border border-white/20 px-10 py-4 text-xs font-sans uppercase tracking-[0.3em] text-foreground/60 transition-all hover:border-white/40 hover:text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                Contact Us
              </a>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
