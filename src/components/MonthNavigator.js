'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Calendar } from 'lucide-react';
import { formatMonth } from '@/lib/aadhaarDataService';

export function MonthNavigator({ months, selectedMonth, onMonthChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full sm:w-auto" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between gap-2 w-full sm:w-auto bg-white border border-slate-200 rounded-full px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-slate-700 cursor-pointer hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all duration-200 shadow-sm"
        >
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-[#1E3A8A] sm:w-4 sm:h-4" />
          <span>View data for: <strong>{formatMonth(selectedMonth)}</strong></span>
        </div>
        <ChevronDown 
          size={14} 
          className={`text-slate-400 transition-transform duration-200 sm:w-4 sm:h-4 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-full sm:w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden"
          >
            <div className="p-2 border-b border-slate-100">
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium uppercase tracking-wider px-2">Select Month</p>
            </div>
            <div className="max-h-64 overflow-y-auto p-1">
              {months.map((month) => (
                <button
                  key={month}
                  onClick={() => {
                    onMonthChange(month);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 text-xs sm:text-sm rounded-lg transition-all duration-150 ${
                    selectedMonth === month
                      ? 'bg-[#1E3A8A] text-white font-medium'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {formatMonth(month)}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
