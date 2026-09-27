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
          // Anchored to the lower half with a transparent top so the 3D
          // delivery counter behind it stays visible instead of being covered.
          className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center bg-gradient-to-t from-[#111111] via-[#111111]/75 to-transparent px-6 pb-28 pt-24 sm:pb-32"
        >
          <div className="pointer-events-auto flex flex-col items-center text-center">
            <motion.h1
              variants={fadeInUp}
              className="text-3xl font-light leading-tight tracking-tight text-[#F5F2EA] sm:text-5xl"
            >
              From our market
              <br />
              to your table.
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-4 max-w-md text-sm leading-relaxed text-[#F5F2EA]/50"
            >
              Freshly selected. Carefully prepared. Delivered to your door.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4"
            >
              <button
                type="button"
                onClick={onShop}
                className="border border-[#F5F2EA] bg-[#F5F2EA]/5 px-8 py-4 text-xs font-medium uppercase tracking-[0.3em] text-[#F5F2EA] transition-all hover:bg-[#F5F2EA]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F2EA]/70"
              >
                Shop Today&apos;s Catch
              </button>
              <a
                href="mailto:hello@aquafanatics.com"
                className="border border-[#F5F2EA]/20 px-8 py-4 text-xs font-medium uppercase tracking-[0.3em] text-[#F5F2EA]/60 transition-all hover:border-[#F5F2EA]/40 hover:text-[#F5F2EA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F2EA]/70"
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
