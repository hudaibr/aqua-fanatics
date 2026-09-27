'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { easeOutCubic } from '@/lib/animations';

interface OfferToastProps {
  /** Seconds after entering the market before the toast appears */
  delaySeconds?: number;
  /** Only shown once the user has entered the 3D market */
  isEntered: boolean;
}

const OFFERS = [
  {
    label: 'Today Only',
    headline: 'Free delivery on orders over Rs. 2,500',
    sub: 'Use code FRESH at checkout',
  },
  {
    label: 'New Arrivals',
    headline: 'Giant Tiger Prawns — just landed',
    sub: 'Limited stock. Visit the Prawns counter.',
  },
  {
    label: "Today's Catch",
    headline: 'Yellowfin Tuna fresh off the boat',
    sub: 'Premium section · while stocks last',
  },
];

export function OfferToast({ delaySeconds = 8, isEntered }: OfferToastProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Pick a random offer once on mount
  const [offer] = useState(() => OFFERS[Math.floor(Math.random() * OFFERS.length)]);

  useEffect(() => {
    if (!isEntered || dismissed) return;
    const t = setTimeout(() => setVisible(true), delaySeconds * 1000);
    return () => clearTimeout(t);
  }, [isEntered, dismissed, delaySeconds]);

  const dismiss = () => {
    setVisible(false);
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24, x: 0 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 16, transition: { duration: 0.35, ease: easeOutCubic } }}
          transition={{ duration: 0.6, ease: easeOutCubic }}
          className="fixed bottom-24 left-6 z-40 sm:bottom-28 sm:left-10"
          role="status"
          aria-live="polite"
        >
          <div className="relative flex max-w-[280px] flex-col gap-1.5 border border-white/10 bg-background/60 px-5 py-4 backdrop-blur-xl">
            {/* Top gold rule */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-primary/60" />

            {/* Label */}
            <p className="text-[9px] font-sans uppercase tracking-[0.3em] text-primary/80">
              {offer.label}
            </p>

            {/* Headline */}
            <p className="text-sm font-serif text-foreground leading-snug">
              {offer.headline}
            </p>

            {/* Sub-copy */}
            <p className="text-[10px] font-sans text-foreground/50 tracking-wide">
              {offer.sub}
            </p>

            {/* Dismiss */}
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss offer"
              className="absolute right-3 top-3 text-foreground/30 transition-colors hover:text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
