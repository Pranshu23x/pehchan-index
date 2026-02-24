'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BRAND_NAMES } from '@/lib/config';

export default function LanguageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasStartedCycling, setHasStartedCycling] = useState(false);

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      setHasStartedCycling(true);
      setCurrentIndex(1);
    }, 8000);

    return () => clearTimeout(initialTimer);
  }, []);

  useEffect(() => {
    if (!hasStartedCycling) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        return next >= BRAND_NAMES.length ? 1 : next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [hasStartedCycling]);

  return (
    <div className="relative h-5 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.h1
          key={currentIndex}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="text-base font-semibold tracking-tight text-[#0F172A] absolute whitespace-nowrap"
        >
          {BRAND_NAMES[currentIndex].name}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
}
