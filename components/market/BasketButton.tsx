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
          type="button"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: easeOutCubic }}
          onClick={onClick}
          // Anchored bottom-right so it clears both the top and bottom nav bars.
          className="fixed bottom-24 right-6 z-40 flex items-center gap-2.5 border border-[#F5F2EA]/20 bg-[#111111]/60 px-4 py-2.5 backdrop-blur-md transition-colors hover:border-[#F5F2EA]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F2EA]/70 sm:bottom-28 sm:right-10"
        >
          <ShoppingBag className="h-3.5 w-3.5 text-[#527C78]" />
          <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#F5F2EA]/60">
            Basket
          </span>
          <span className="flex min-w-[1.5rem] items-center justify-center rounded-full border border-[#F5F2EA]/20 px-1.5 py-0.5 text-xs font-medium text-[#F5F2EA]">
            {count}
          </span>
          <span className="sr-only">
            {count === 1 ? '1 item in basket' : `${count} items in basket`}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
