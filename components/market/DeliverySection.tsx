'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp, staggerContainer, easeOutCubic } from '@/lib/animations';

interface DeliverySectionProps {
  visible: boolean;
}

export function DeliverySection({ visible }: DeliverySectionProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-gradient-to-b from-transparent via-[#111111]/60 to-[#111111]/90 px-6"
        >
          <motion.div variants={fadeInUp} className="text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#527C78]">
              From our market
            </p>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="mt-6 text-center text-4xl font-light leading-tight tracking-tight text-[#F5F2EA] sm:text-6xl"
          >
            From our market
            <br />
            to your table.
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mt-6 max-w-md text-center text-sm leading-relaxed text-[#F5F2EA]/50"
          >
            Freshly selected. Carefully prepared. Delivered to your door.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4"
          >
            <button className="border border-[#F5F2EA] bg-[#F5F2EA]/5 px-8 py-4 text-xs font-medium uppercase tracking-[0.3em] text-[#F5F2EA] transition-all hover:bg-[#F5F2EA]/10">
              Shop Today&apos;s Catch
            </button>
            <button className="border border-[#F5F2EA]/20 px-8 py-4 text-xs font-medium uppercase tracking-[0.3em] text-[#F5F2EA]/60 transition-all hover:border-[#F5F2EA]/40 hover:text-[#F5F2EA]">
              Contact Us
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
