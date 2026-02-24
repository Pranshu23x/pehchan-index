'use client';

import { motion } from 'framer-motion';

export default function StartupSplash() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 text-center"
      style={{ backgroundImage: 'url(/bg-gradient.jpg)', backgroundSize: 'cover', backgroundAttachment: 'fixed', backgroundPosition: 'center' }}
    >
      <div className="relative max-w-4xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          <h1 className="text-3xl sm:text-5xl md:text-7xl text-black font-[family-name:var(--font-cormorant)] font-light tracking-tighter leading-tight">
           Pehchaan Index
          </h1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
          className="mt-12"
        >
          <p className="text-[10px] text-black/60 font-normal tracking-[0.4em] uppercase">
            ~A Monthly Aadhaar update activity tracker
          </p>
        </motion.div>
      </div>
      
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
        <div className="w-px h-12 bg-gradient-to-b from-black/20 to-transparent" />
      </div>
    </motion.div>
  );
}
