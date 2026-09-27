'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { easeOutCubic } from '@/lib/animations';

interface BasketButtonProps {
  count: number;
  isEntered: boolean;
  onClick: () => void;
}

export function BasketButton({ count, isEntered, onClick }: BasketButtonProps) {
  return (
    <AnimatePresence>
      {isEntered && (
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: easeOutCubic }}
          onClick={onClick}
          className="fixed right-6 top-5 z-40 flex items-center gap-2 sm:right-10"
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#F5F2EA]/60">
            Basket
          </span>
          <span className="flex items-center justify-center rounded-full border border-[#F5F2EA]/20 px-2.5 py-0.5 text-xs font-medium text-[#F5F2EA]">
            {count}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
