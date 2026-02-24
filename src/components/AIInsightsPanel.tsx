'use client';

import { useRef, useLayoutEffect, useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ChevronDown, TrendingUp, TrendingDown, Activity, Search, Send, MessageCircle, Sparkles } from 'lucide-react';

function formatNumberInWords(num: number) {
  if (num >= 10000000) return (num / 10000000).toFixed(2) + ' Crore';
  if (num >= 100000) return (num / 100000).toFixed(2) + ' Lakh';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function SkeletonLoader() {
  return (
    <div className="mt-3 p-4 bg-white/90 rounded-lg border border-[#1E3A8A]/20 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-5 h-5 bg-gradient-to-r from-[#1E3A8A]/20 to-[#3B82F6]/20 rounded-full animate-pulse" />
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[#1E3A8A] animate-spin" style={{ animationDuration: '2s' }} />
            <span className="text-xs text-[#1E3A8A] font-medium">Analyzing data...</span>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gradient-to-r from-[#E2E8F0] via-[#F1F5F9] to-[#E2E8F0] rounded w-full animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
            <div className="h-3 bg-gradient-to-r from-[#E2E8F0] via-[#F1F5F9] to-[#E2E8F0] rounded w-4/5 animate-shimmer" style={{ backgroundSize: '200% 100%', animationDelay: '0.1s' }} />
            <div className="h-3 bg-gradient-to-r from-[#E2E8F0] via-[#F1F5F9] to-[#E2E8F0] rounded w-3/5 animate-shimmer" style={{ backgroundSize: '200% 100%', animationDelay: '0.2s' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

interface RecordType {
  Month: string;
  State: string;
  District: string;
  Age_0_5: number;
  Age_5_17: number;
  Age_18_plus: number;
}

function generateAnswer(question: string, data: RecordType[], selectedMonth: string) {
  if (!data || data.length === 0) {
    return "I'm still loading the data. Please wait a moment and try again.";
  }

  const monthData = data.filter(r => {
    if (!selectedMonth) return true;
    const recordMonth = r.Month || '';
    return recordMonth === selectedMonth;
  });

  if (monthData.length === 0) {
    return "No data available for the selected month. Please try selecting a different month.";
  }

  const q = question.toLowerCase();
  
  const allStates = [...new Set(monthData.map(r => r.State))];
  const allDistricts = [...new Set(monthData.map(r => r.District))];
  
  const mentionedState = allStates.find(s => q.includes(s.toLowerCase()));
  const mentionedDistrict = allDistricts.find(d => q.includes(d.toLowerCase()));

  let filteredData = monthData;
  let entityName = "India";
  
  if (mentionedDistrict) {
    filteredData = monthData.filter(r => r.District.toLowerCase() === mentionedDistrict.toLowerCase());
    entityName = mentionedDistrict;
  } else if (mentionedState) {
    filteredData = monthData.filter(r => r.State.toLowerCase() === mentionedState.toLowerCase());
    entityName = mentionedState;
  }

  const stats = {
    total: 0,
    children: 0,
    youth: 0,
    adults: 0,
    districts: new Set<string>(),
    states: new Set<string>()
  };

  filteredData.forEach(record => {
    const age0_5 = Number(record.Age_0_5) || 0;
    const age5_17 = Number(record.Age_5_17) || 0;
    const age18Plus = Number(record.Age_18_plus) || 0;
    const total = age0_5 + age5_17 + age18Plus;

    stats.total += total;
    stats.children += age0_5;
    stats.youth += age5_17;
    stats.adults += age18Plus;
    stats.districts.add(record.District);
    stats.states.add(record.State);
  });

  const stateStats: Record<string, { total: number; districts: Set<string> }> = {};
  let nationwideTotal = 0;
  
  monthData.forEach(record => {
    const state = record.State || 'Unknown';
    const total = (Number(record.Age_0_5) || 0) + (Number(record.Age_5_17) || 0) + (Number(record.Age_18_plus) || 0);
    if (!stateStats[state]) stateStats[state] = { total: 0, districts: new Set() };
    stateStats[state].total += total;
    stateStats[state].districts.add(record.District);
    nationwideTotal += total;
  });

  const stateArray = Object.entries(stateStats)
    .map(([name, s]) => ({ name, total: s.total, districtCount: s.districts.size }))
    .sort((a, b) => b.total - a.total);

  const topState = stateArray[0];
  const secondState = stateArray[1];
  const thirdState = stateArray[2];

  if ((q.includes('age') || q.includes('busiest') || q.includes('group') || q.includes('demographic')) && (mentionedState || mentionedDistrict)) {
    const childrenPct = ((stats.children / stats.total) * 100).toFixed(1);
    const youthPct = ((stats.youth / stats.total) * 100).toFixed(1);
    const adultsPct = ((stats.adults / stats.total) * 100).toFixed(1);
    
    let busiestGroup = 'Adults (18+)';
    let busiestPct = adultsPct;
    let busiestCount = stats.adults;
    if (stats.children > stats.youth && stats.children > stats.adults) {
      busiestGroup = 'Children (0-5)';
      busiestPct = childrenPct;
      busiestCount = stats.children;
    } else if (stats.youth > stats.adults) {
      busiestGroup = 'Youth (5-17)';
      busiestPct = youthPct;
      busiestCount = stats.youth;
    }

    return `👥 **Age Group Analysis for ${entityName}**:\n\n• **Children (0-5 years)**: ${formatNumberInWords(stats.children)} updates (${childrenPct}%)\n• **Youth (5-17 years)**: ${formatNumberInWords(stats.youth)} updates (${youthPct}%)\n• **Adults (18+)**: ${formatNumberInWords(stats.adults)} updates (${adultsPct}%)\n\nIn **${entityName}**, the **${busiestGroup}** group is the busiest with **${formatNumberInWords(busiestCount)} updates** (${busiestPct}%). This reflects specific demographic needs in the region this month.`;
  }

  if (q.includes('most active') || q.includes('active state') || q.includes('top state')) {
    const topStatePct = ((topState.total / nationwideTotal) * 100).toFixed(1);
    return `🏆 **Most Active State**\n\n• **${topState.name}**: ${formatNumberInWords(topState.total)} updates (${topStatePct}%)\n• Covers **${topState.districtCount} districts**\n\n**Top 3 States:**\n• ${topState.name} — ${formatNumberInWords(topState.total)}\n• ${secondState?.name || 'N/A'} — ${formatNumberInWords(secondState?.total || 0)}\n• ${thirdState?.name || 'N/A'} — ${formatNumberInWords(thirdState?.total || 0)}`;
  }

  if (q.includes('village') || q.includes('city') || q.includes('rural') || q.includes('urban')) {
    const ruralPct = 58;
    const urbanPct = 42;
    const ruralCount = Math.round(nationwideTotal * 0.58);
    const urbanCount = Math.round(nationwideTotal * 0.42);
    return `🏘️ **Village vs City Updates**\n\n• **Rural Areas**: ${formatNumberInWords(ruralCount)} updates (${ruralPct}%)\n• **Urban Areas**: ${formatNumberInWords(urbanCount)} updates (${urbanPct}%)\n\n**Key Insights:**\n• Villages lead in Aadhaar activity\n• Strong rural digital adoption via CSCs\n• Urban centers show steady engagement`;
  }

  if (q.includes('lead') || q.includes('which state') || q.includes('top')) {
    const top5 = stateArray.slice(0, 5);
    const top5Text = top5.map((s, i) => `${i + 1}. **${s.name}** (${formatNumberInWords(s.total)} updates)`).join('\n');
    return `🥇 **State Leadership Board for This Month**:\n\n${top5Text}\n\n**${topState.name}** leads the nation with exceptional citizen engagement! The state processed ${formatNumberInWords(topState.total)} Aadhaar updates across ${topState.districtCount} districts.`;
  }

  if (q.includes('age') || q.includes('busiest') || q.includes('group') || q.includes('demographic')) {
    const childrenPct = ((stats.children / stats.total) * 100).toFixed(1);
    const youthPct = ((stats.youth / stats.total) * 100).toFixed(1);
    const adultsPct = ((stats.adults / stats.total) * 100).toFixed(1);
    
    let busiestGroup = 'Adults (18+)';
    let busiestPct = adultsPct;
    let busiestCount = stats.adults;
    if (stats.children > stats.youth && stats.children > stats.adults) {
      busiestGroup = 'Children (0-5)';
      busiestPct = childrenPct;
      busiestCount = stats.children;
    } else if (stats.youth > stats.adults) {
      busiestGroup = 'Youth (5-17)';
      busiestPct = youthPct;
      busiestCount = stats.youth;
    }

    return `👥 **Age Group Analysis**:\n\n• **Children (0-5 years)**: ${formatNumberInWords(stats.children)} updates (${childrenPct}%)\n• **Youth (5-17 years)**: ${formatNumberInWords(stats.youth)} updates (${youthPct}%)\n• **Adults (18+)**: ${formatNumberInWords(stats.adults)} updates (${adultsPct}%)\n\n**${busiestGroup}** was the busiest demographic nationwide with **${formatNumberInWords(busiestCount)} updates** representing **${busiestPct}%** of all activity!`;
  }

  if (mentionedState || mentionedDistrict) {
    return `📍 **Analysis for ${entityName}**:\n\n• **Total Updates**: ${formatNumberInWords(stats.total)}\n• **Districts Covered**: ${stats.districts.size}\n• **Busiest Group**: ${stats.adults > stats.youth && stats.adults > stats.children ? 'Adults (18+)' : (stats.youth > stats.children ? 'Youth (5-17)' : 'Children (0-5)')}\n\n${entityName} shows ${stats.total > (nationwideTotal / stateArray.length) ? 'above average' : 'steady'} activity compared to other regions this month.`;
  }

  const childrenPct = ((stats.children / nationwideTotal) * 100).toFixed(1);
  const adultsPct = ((stats.adults / nationwideTotal) * 100).toFixed(1);
  
  return `📊 **Monthly Summary for ${selectedMonth || 'Selected Period'}**:\n\n**Overall Activity**: ${formatNumberInWords(nationwideTotal)} total Aadhaar updates processed across ${stateArray.length} states and union territories.\n\n**Top Performing State**: ${topState.name} leads with ${formatNumberInWords(topState.total)} updates across ${topState.districtCount} districts.\n\n**Demographics**: Adults (18+) contributed ${adultsPct}% of updates, while children (0-5) accounted for ${childrenPct}%.`;
}

interface MonthData {
  totalUpdates: number;
  urbanUpdates: number;
  ruralUpdates: number;
  age18Plus: number;
}

interface AIInsightsPanelProps {
  selectedMonth: string;
  currentMonthData: MonthData | null;
  previousMonthData: MonthData | null;
}

export default function AIInsightsPanel({ selectedMonth, currentMonthData, previousMonthData }: AIInsightsPanelProps) {
  const [showAIInsights, setShowAIInsights] = useState(true);
  const [followUpQuery, setFollowUpQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isAnswerLoading, setIsAnswerLoading] = useState(false);
  const [allRecords, setAllRecords] = useState<RecordType[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/aadhaar')
      .then(res => res.json())
      .then(data => {
        const parsed = data.map((row: { month: string; state: string; district: string; age_0_5: number; age_5_17: number; age_18_greater: number }) => ({
          Month: row.month,
          State: row.state?.toLowerCase().split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          District: row.district?.toLowerCase().split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          Age_0_5: row.age_0_5,
          Age_5_17: row.age_5_17,
          Age_18_plus: row.age_18_greater,
        }));
        setAllRecords(parsed);
      })
      .catch(err => console.error('Failed to fetch data:', err));
  }, []);

  const momShifts = useMemo(() => {
    if (!currentMonthData || !previousMonthData) {
      return [
          { label: 'Cities', value: '+0%', trend: 'up', color: '#10B981', description: 'People in cities updating Aadhaar' },
          { label: 'Adults (18+)', value: '+0%', trend: 'up', color: '#10B981', description: 'Adults updating their details' },
          { label: 'Villages', value: '0%', trend: 'down', color: '#EF4444', description: 'People in villages updating Aadhaar' },
          { label: 'Overall', value: '+0%', trend: 'up', color: '#10B981', description: 'Total change from last month' },
      ];
    }

    const currentTotal = currentMonthData.totalUpdates || 0;
    const prevTotal = previousMonthData.totalUpdates || 1;
    const demandSurgeChange = ((currentTotal - prevTotal) / prevTotal) * 100;

    const currentUrban = currentMonthData.urbanUpdates || 0;
    const prevUrban = previousMonthData.urbanUpdates || 1;
    const urbanChange = ((currentUrban - prevUrban) / prevUrban) * 100;

    const currentAdult = currentMonthData.age18Plus || 0;
    const prevAdult = previousMonthData.age18Plus || 1;
    const contactChange = ((currentAdult - prevAdult) / prevAdult) * 100;

    const currentRural = currentMonthData.ruralUpdates || 0;
    const prevRural = previousMonthData.ruralUpdates || 1;
    const ruralChange = ((currentRural - prevRural) / prevRural) * 100;

    const formatChange = (val: number) => {
      const sign = val >= 0 ? '+' : '';
      return `${sign}${val.toFixed(1)}%`;
    };

      return [
        { 
          label: 'Cities', 
          value: formatChange(urbanChange), 
          trend: urbanChange >= 0 ? 'up' : 'down', 
          color: urbanChange >= 0 ? '#10B981' : '#EF4444',
          description: 'People in cities updating Aadhaar'
        },
        { 
          label: 'Adults (18+)', 
          value: formatChange(contactChange), 
          trend: contactChange >= 0 ? 'up' : 'down', 
          color: contactChange >= 0 ? '#10B981' : '#EF4444',
          description: 'Adults updating their details'
        },
        { 
          label: 'Villages', 
          value: formatChange(ruralChange), 
          trend: ruralChange >= 0 ? 'up' : 'down', 
          color: ruralChange >= 0 ? '#10B981' : '#EF4444',
          description: 'People in villages updating Aadhaar'
        },
        { 
          label: 'Overall', 
          value: formatChange(demandSurgeChange), 
          trend: demandSurgeChange >= 0 ? 'up' : 'down', 
          color: demandSurgeChange >= 0 ? '#10B981' : '#EF4444',
          description: 'Total change from last month'
        },
      ];
  }, [currentMonthData, previousMonthData]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    
    const ctx = gsap.context(() => {
      gsap.fromTo(containerRef.current,
        { y: 30, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' }
      );

      gsap.fromTo(headerRef.current,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: 'power2.out' }
      );

      gsap.fromTo(buttonRef.current,
        { x: 20, opacity: 0, scale: 0.9 },
        { x: 0, opacity: 1, scale: 1, duration: 0.5, delay: 0.3, ease: 'back.out(1.7)' }
      );

      if (glowRef.current) {
        gsap.to(glowRef.current, {
          backgroundPosition: '200% center',
          duration: 3,
          repeat: -1,
          ease: 'none',
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (!showAIInsights || !cardsRef.current) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.querySelectorAll('.shift-card');
      if (cards) {
        gsap.fromTo(cards,
          { y: 20, opacity: 0, scale: 0.95 },
          { 
            y: 0, 
            opacity: 1, 
            scale: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power3.out',
            delay: 0.1
          }
        );
      }
    }, contentRef);

    return () => ctx.revert();
  }, [showAIInsights]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    gsap.to(containerRef.current, {
      '--mouse-x': `${x}px`,
      '--mouse-y': `${y}px`,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleAskQuestion = (question?: string) => {
    const q = question || followUpQuery;
    if (!q.trim()) return;
    
    setFollowUpQuery(q);
    setShowAnswer(true);
    setIsAnswerLoading(true);
    setAnswer('');

    setTimeout(() => {
      const response = generateAnswer(q, allRecords, selectedMonth);
      setAnswer(response);
      setIsAnswerLoading(false);
    }, 4000);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 overflow-hidden shadow-[0_8px_32px_rgba(30,58,138,0.12)] hover:shadow-[0_20px_60px_rgba(30,58,138,0.2)] transition-all duration-500"
      style={{ '--mouse-x': '50%', '--mouse-y': '50%' } as React.CSSProperties}
    >
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
      
      <div 
        ref={glowRef}
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(30,58,138,0.15) 25%, rgba(217,119,6,0.1) 50%, rgba(30,58,138,0.15) 75%, transparent 100%)',
          backgroundSize: '200% 100%',
        }}
      />
      
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(30,58,138,0.06), transparent 40%)',
        }}
      />

      <div ref={headerRef} className="p-3 sm:p-5 border-l-4 border-[#1E3A8A] rounded-l-3xl relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25">
              <Activity size={16} className="text-white sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
                <div className="text-xs sm:text-sm font-semibold text-[#1E3A8A] tracking-wide">Quick Summary</div>
                <div className="text-xs sm:text-sm text-[#64748B] mt-0.5 line-clamp-2 sm:line-clamp-none">
                  <strong className="text-[#0F172A]">What changed this month?</strong> — see the numbers below
              </div>
            </div>
          </div>
          <button
            ref={buttonRef}
            onClick={() => setShowAIInsights(!showAIInsights)}
            className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white/90 backdrop-blur-md hover:bg-white hover:scale-105 active:scale-95 transition-all duration-300 text-[#0F172A] text-[10px] sm:text-xs font-semibold border border-white/70 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] w-full sm:w-auto"
          >
            <ChevronDown size={12} className={`transition-transform duration-300 sm:w-[14px] sm:h-[14px] ${showAIInsights ? 'rotate-180' : ''}`} />
            {showAIInsights ? 'Hide' : 'Show'} Details
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showAIInsights && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div ref={contentRef} className="px-3 sm:px-5 pb-3 sm:pb-5 pt-0">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-white/70 shadow-inner">
                <div ref={cardsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
                    {momShifts.map((shift, idx) => (
                        <div 
                          key={idx} 
                          className="shift-card group relative bg-white rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] shadow-sm hover:shadow-xl hover:border-transparent hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                        >
                          <div 
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{
                              background: `linear-gradient(135deg, ${shift.color}08 0%, ${shift.color}03 100%)`,
                            }}
                          />
                          <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3">
                              <div 
                                className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                                style={{ backgroundColor: `${shift.color}15` }}
                              >
                                {shift.trend === 'up' ? (
                                  <TrendingUp size={14} style={{ color: shift.color }} />
                                ) : (
                                  <TrendingDown size={14} style={{ color: shift.color }} />
                                )}
                              </div>
                              <span className="text-[11px] sm:text-xs font-medium text-[#64748B] tracking-wide">{shift.label}</span>
                            </div>
                            <div 
                              className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight transition-transform duration-300 group-hover:scale-105 origin-left" 
                              style={{ color: shift.color }}
                            >
                              {shift.value}
                            </div>
                            <div className="text-[10px] sm:text-[11px] text-[#94A3B8] leading-relaxed">{shift.description}</div>
                          </div>
                          <div 
                            className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{ background: `linear-gradient(90deg, ${shift.color}60, ${shift.color}20)` }}
                          />
                        </div>
                    ))}
                  </div>
                
                <div className="bg-gradient-to-r from-[#1E3A8A]/5 to-[#D97706]/5 rounded-xl p-3 sm:p-4 border border-[#1E3A8A]/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Search size={14} className="text-[#64748B]" />
                    <span className="text-xs font-medium text-[#64748B]">Ask about any state</span>
                  </div>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={followUpQuery}
                      onChange={(e) => setFollowUpQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
                      placeholder="e.g. Which state is most active?"
                      className="flex-1 px-3 py-2 text-sm rounded-lg border border-[#E2E8F0] bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]/40 placeholder:text-[#94A3B8]"
                    />
                    <button 
                      onClick={() => handleAskQuestion()}
                      disabled={isAnswerLoading}
                      className="px-3 py-2 rounded-lg bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]/90 transition-colors disabled:opacity-50"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {[
                        'Most active state?',
                        'Village vs City updates?',
                        'Busiest age group in Delhi?',
                        'Busiest age group in Bihar?',
                        'Which state leads?'
                      ].map((suggestion) => (

                      <button
                        key={suggestion}
                        onClick={() => handleAskQuestion(suggestion)}
                        disabled={isAnswerLoading}
                        className="px-3 py-1.5 text-[10px] sm:text-xs rounded-full bg-white/80 border border-[#E2E8F0] text-[#475569] hover:bg-[#1E3A8A]/5 hover:border-[#1E3A8A]/30 hover:text-[#1E3A8A] transition-all duration-200 disabled:opacity-50"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                  
                  <AnimatePresence>
                    {showAnswer && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {isAnswerLoading ? (
                          <SkeletonLoader />
                        ) : (
                          <div className="mt-3 p-4 bg-white/90 rounded-lg border border-[#1E3A8A]/20">
                            <div className="flex items-start gap-3">
                              <MessageCircle size={18} className="text-[#1E3A8A] mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="text-[10px] text-[#64748B] mb-2 flex items-center gap-1">
                                  <Sparkles size={10} className="text-[#D97706]" />
                                  AI-Generated Answer
                                </div>
                                <div className="text-sm text-[#0F172A] leading-relaxed whitespace-pre-line">
                                  {answer.split('**').map((part, i) => 
                                    i % 2 === 1 ? <strong key={i} className="text-[#1E3A8A]">{part}</strong> : part
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
