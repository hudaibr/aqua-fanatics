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
          className="fixed bottom-24 right-6 z-40 flex items-center gap-2.5 border border-white/10 bg-background/40 px-4 py-2.5 backdrop-blur-md transition-colors hover:border-white/30 hover:bg-background/60 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary sm:bottom-28 sm:right-10"
        >
          <ShoppingBag className="h-3.5 w-3.5 text-primary" />
          <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-foreground/60">
            Selection
          </span>
          <span className="flex min-w-[1.5rem] items-center justify-center rounded-full border border-white/20 px-1.5 py-0.5 text-xs font-sans text-foreground">
            {count}
          </span>
          <span className="sr-only">
            {count === 1 ? '1 item in selection' : `${count} items in selection`}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
