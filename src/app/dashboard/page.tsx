'use client';

import { useState, useEffect, useMemo, Suspense, useRef, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { GeographicActivityMap, MapTooltip } from '@/components/GeographicActivityMap';
import { MonthNavigator } from '@/components/MonthNavigator';
import { LoadingSkeleton } from '@/components/UIPatterns';
import LanguageCarousel from '@/components/LanguageCarousel';
import AIInsightsPanel from '@/components/AIInsightsPanel';
import { 
  aggregateByState, 
  getUniqueMonths, 
  getTopDistricts,
  formatMonth,
  formatNumber
} from '@/lib/aadhaarDataService';
import { 
  COLORS, 
  PIE_COLORS, 
  cardHoverProps, 
  amberCardHoverProps, 
  mobileCardProps 
} from '@/lib/config';
import { TrendingUp, MapPin, ChevronRight, FileText, BarChart2 } from 'lucide-react';
import Footer from '@/components/Footer';

function Dashboard() {
  const router = useRouter();
  const [records, setRecords] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [hoveredState, setHoveredState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const mainRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef(null);
  const statsCardsRef = useRef(null);
  const chartsRef = useRef(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);

    fetch('/api/aadhaar')
      .then(res => res.json())
      .then(data => {
        const parsed = data.map((row: { month: string; state: string; district: string; age_0_5: number; age_5_17: number; age_18_greater: number }) => ({
          Month: row.month,
          State: row.state.toLowerCase().split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          District: row.district.toLowerCase().split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          Age_0_5: row.age_0_5,
          Age_5_17: row.age_5_17,
          Age_18_plus: row.age_18_greater,
        }));
        setRecords(parsed);
        const months = getUniqueMonths(parsed);
        const septemberMonth = months.find((m: string) => m.includes('-09')) || months[0] || '';
        setSelectedMonth(septemberMonth);
        setIsLoading(false);
      });
  }, []);

  useLayoutEffect(() => {
    if (isLoading || showIntro || !mainRef.current || isMobile) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );

      if (statsCardsRef.current) {
        const cards = statsCardsRef.current.querySelectorAll('.stat-card');
        gsap.fromTo(cards,
          { y: 40, opacity: 0, scale: 0.95 },
          { 
            y: 0, 
            opacity: 1, 
            scale: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
            delay: 0.3
          }
        );
      }

      if (chartsRef.current) {
        const chartCards = chartsRef.current.querySelectorAll('.chart-card');
        gsap.fromTo(chartCards,
          { y: 60, opacity: 0, scale: 0.96 },
          { 
            y: 0, 
            opacity: 1, 
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            delay: 0.6
          }
        );
      }
    }, mainRef);

    return () => ctx.revert();
  }, [isLoading, showIntro, isMobile]);

  const months = useMemo(() => getUniqueMonths(records), [records]);
  
  const stateData = useMemo(() => {
    if (!selectedMonth) return [];
    return aggregateByState(records, selectedMonth);
  }, [records, selectedMonth]);

  const topDistricts = useMemo(() => getTopDistricts(stateData, 12), [stateData]);

  const summaryStats = useMemo(() => {
    const totalUpdates = stateData.reduce((sum: number, s: { totalUpdates: number }) => sum + s.totalUpdates, 0);
    const totalDistricts = stateData.reduce((sum: number, s: { districts: unknown[] }) => sum + s.districts.length, 0);
    const highActivityCount = stateData.flatMap((s: { districts: { intensity: string }[] }) => s.districts).filter((d: { intensity: string }) => d.intensity === 'high').length;
    return { totalUpdates, totalStates: stateData.length, totalDistricts, highActivityCount };
  }, [stateData]);

  const ageData = useMemo(() => {
    const total0_5 = stateData.reduce((sum: number, s: { age0_5: number }) => sum + s.age0_5, 0);
    const total5_17 = stateData.reduce((sum: number, s: { age5_17: number }) => sum + s.age5_17, 0);
    const total18Plus = stateData.reduce((sum: number, s: { age18Plus: number }) => sum + s.age18Plus, 0);
    return [
      { name: 'Children (0-5)', value: total0_5, color: PIE_COLORS[0] },
      { name: 'Youth (5-17)', value: total5_17, color: PIE_COLORS[1] },
      { name: 'Adults (18+)', value: total18Plus, color: PIE_COLORS[2] },
    ];
  }, [stateData]);

  const barChartData = useMemo(() => {
    return stateData.slice(0, 10).map((s: { state: string; totalUpdates: number }) => ({
      name: s.state.length > 14 ? s.state.slice(0, 14) + '...' : s.state,
      updates: s.totalUpdates,
      fullName: s.state,
    }));
  }, [stateData]);

  const trendData = useMemo(() => {
    const monthlyTotals = months.slice(0, 6).reverse().map((m: string) => {
      const data = aggregateByState(records, m);
      return {
        month: formatMonth(m).split(' ')[0].slice(0, 3),
        updates: data.reduce((sum: number, s: { totalUpdates: number }) => sum + s.totalUpdates, 0),
      };
    });
    return monthlyTotals;
  }, [records, months]);

  const totalAll = ageData.reduce((sum, d) => sum + d.value, 0);

  const currentMonthData = useMemo(() => {
    if (!selectedMonth || !stateData.length) return null;
    const totalUpdates = stateData.reduce((sum: number, s: { totalUpdates: number }) => sum + s.totalUpdates, 0);
    const age18Plus = stateData.reduce((sum: number, s: { age18Plus: number }) => sum + s.age18Plus, 0);
    const urbanUpdates = Math.round(totalUpdates * 0.42);
    const ruralUpdates = Math.round(totalUpdates * 0.58);
    return { totalUpdates, age18Plus, urbanUpdates, ruralUpdates };
  }, [selectedMonth, stateData]);

  const previousMonthData = useMemo(() => {
    if (!selectedMonth || months.length < 2) return null;
    const currentIdx = months.indexOf(selectedMonth);
    let prevMonth = currentIdx < months.length - 1 ? months[currentIdx + 1] : null;
    if (!prevMonth && currentIdx > 0) {
      prevMonth = months[currentIdx - 1];
    }
    if (!prevMonth) {
      prevMonth = months.find((m: string) => m !== selectedMonth) || null;
    }
    if (!prevMonth) return null;
    const prevStateData = aggregateByState(records, prevMonth);
    const totalUpdates = prevStateData.reduce((sum: number, s: { totalUpdates: number }) => sum + s.totalUpdates, 0);
    const age18Plus = prevStateData.reduce((sum: number, s: { age18Plus: number }) => sum + s.age18Plus, 0);
    const urbanUpdates = Math.round(totalUpdates * 0.42);
    const ruralUpdates = Math.round(totalUpdates * 0.58);
    return { totalUpdates, age18Plus, urbanUpdates, ruralUpdates };
  }, [selectedMonth, months, records]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div ref={mainRef} className="min-h-screen text-[#0F172A] overflow-y-auto" style={{ fontFamily: "'Inter', 'Source Sans 3', system-ui, sans-serif", backgroundImage: 'url(/bg-gradient.jpg)', backgroundSize: 'cover', backgroundAttachment: 'fixed', backgroundPosition: 'center' }}>
      <header ref={headerRef} className="sticky top-0 z-50 mx-3 sm:mx-6 mt-2 sm:mt-4 rounded-2xl sm:rounded-full bg-white/70 backdrop-blur-md px-3 sm:px-6 py-2 sm:py-3 border border-white/50 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 max-w-[1800px] mx-auto">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img 
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/f9017d5e-73bf-44cc-9774-6f7da4784972/image-1767439313415.png?width=8000&height=8000&resize=contain" 
                alt="Pehchaan Index Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <LanguageCarousel />
              <p className="text-[10px] sm:text-[11px] text-[#64748B] max-w-[200px] sm:max-w-lg leading-tight">Transforming 1.4B identities into actionable intelligence for India's digital future</p>
            </div>
          </div>
          <MonthNavigator 
            months={months} 
            selectedMonth={selectedMonth} 
            onMonthChange={setSelectedMonth} 
          />
        </div>
      </header>

      <main className="p-3 sm:p-6 max-w-[1800px] mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedMonth}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="space-y-4 sm:space-y-5"
          >
            <AIInsightsPanel 
              selectedMonth={selectedMonth}
              currentMonthData={currentMonthData}
              previousMonthData={previousMonthData}
            />

            <div ref={statsCardsRef} className="grid grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4">
                <motion.div 
                  className="stat-card col-span-1 lg:col-span-3 bg-white/80 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
                  {...(isMobile ? mobileCardProps : cardHoverProps)}
                >
                  <div className="flex items-center gap-2 text-[#64748B] mb-1 sm:mb-2">
                    <FileText size={12} className="sm:w-[14px] sm:h-[14px]" />
                    <span className="text-[9px] sm:text-[11px] uppercase tracking-wider font-medium">Live Pulse</span>
                  </div>
                  <div className="text-xl sm:text-3xl font-semibold tracking-tight text-[#0F172A]">{formatNumber(summaryStats.totalUpdates)}</div>
                  <div className="text-[9px] sm:text-[11px] text-[#64748B] mt-1 hidden sm:block">Citizens actively updating identities this month</div>
                </motion.div>

                <motion.div 
                  className="stat-card col-span-1 lg:col-span-3 bg-white/80 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
                  {...(isMobile ? mobileCardProps : cardHoverProps)}
                >
                  <div className="flex items-center gap-2 text-[#64748B] mb-1 sm:mb-2">
                    <MapPin size={12} className="sm:w-[14px] sm:h-[14px]" />
                    <span className="text-[9px] sm:text-[11px] uppercase tracking-wider font-medium">Pan-India Coverage</span>
                  </div>
                  <div className="text-xl sm:text-3xl font-semibold tracking-tight text-[#0F172A]">{summaryStats.totalStates}</div>
                  <div className="text-[9px] sm:text-[11px] text-[#64748B] mt-1"><span className="hidden sm:inline">States/UTs · </span>{summaryStats.totalDistricts} districts monitored</div>
                </motion.div>

                <motion.div 
                  className="stat-card col-span-1 lg:col-span-3 bg-white/80 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-[#D97706]/40 shadow-[0_8px_30px_rgba(217,119,6,0.15)]"
                  {...(isMobile ? mobileCardProps : amberCardHoverProps)}
                >
                  <div className="flex items-center gap-2 text-[#D97706] mb-1 sm:mb-2">
                    <TrendingUp size={12} className="sm:w-[14px] sm:h-[14px]" />
                    <span className="text-[9px] sm:text-[11px] uppercase tracking-wider font-medium">Priority Zones</span>
                  </div>
                  <div className="text-xl sm:text-3xl font-semibold tracking-tight text-[#D97706]">{summaryStats.highActivityCount}</div>
                  <div className="text-[9px] sm:text-[11px] text-[#64748B] mt-1 hidden sm:block">High-demand districts flagged for immediate action</div>
                </motion.div>

                <motion.div 
                  className="stat-card col-span-1 lg:col-span-3 bg-white/80 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
                  {...(isMobile ? mobileCardProps : cardHoverProps)}
                >
                <div className="mb-2 sm:mb-3">
                  <span className="text-[9px] sm:text-[11px] uppercase tracking-wider text-[#64748B] font-medium">Momentum Tracker</span>
                </div>
                <div className="h-[50px] sm:h-[60px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorUpdates" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.accent} stopOpacity={0.2}/>
                          <stop offset="95%" stopColor={COLORS.accent} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" tick={{ fontSize: 8, fill: '#64748B' }} axisLine={false} tickLine={false} hide />
                      <Area type="monotone" dataKey="updates" stroke={COLORS.accent} fill="url(#colorUpdates)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            <div ref={chartsRef} className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
              <motion.div 
                className="chart-card col-span-1 lg:col-span-5 bg-white/80 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.12)] relative"
                {...cardHoverProps}
              >
                <div className="mb-3 sm:mb-4">
                  <h3 className="text-xs sm:text-sm font-medium text-[#0F172A]">India at a Glance — Live Demand Map</h3>
                  <p className="text-[10px] sm:text-[11px] text-[#64748B]">Tap any state to reveal granular district intelligence</p>
                </div>
                <div className="h-[300px] sm:h-[480px]">
<GeographicActivityMap 
                      stateData={stateData} 
                      onStateHover={setHoveredState}
                      selectedState={hoveredState}
                      selectedMonth={selectedMonth}
                      onStateClick={(state: { state: string }) => {
                        router.push(`/dashboard/details?state=${encodeURIComponent(state.state)}&month=${selectedMonth}`);
                      }}
                    />
                </div>
                <MapTooltip state={hoveredState} month={formatMonth(selectedMonth)} />
              </motion.div>

              <div className="col-span-1 lg:col-span-4 space-y-3 sm:space-y-4">
                <motion.div 
                  className="chart-card bg-white/80 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
                  {...cardHoverProps}
                >
                  <div className="mb-3 sm:mb-4 flex items-center gap-2">
                    <BarChart2 size={12} className="text-[#64748B] sm:w-[14px] sm:h-[14px]" />
                    <span className="text-[9px] sm:text-[11px] uppercase tracking-wider text-[#64748B] font-medium">State Leaderboard</span>
                  </div>
                  <div className="h-[200px] sm:h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barChartData} layout="vertical" margin={{ top: 0, right: 5, left: 0, bottom: 15 }}>
                        <XAxis 
                          type="number" 
                          tick={{ fontSize: 8, fill: '#64748B' }} 
                          axisLine={false} 
                          tickLine={false} 
                          tickFormatter={(v) => formatNumber(v)}
                          label={{ value: 'Monthly Aadhaar updates', position: 'bottom', offset: 0, fontSize: 9, fill: '#64748B' }}
                        />
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          tick={{ fontSize: 9, fill: '#0F172A' }} 
                          axisLine={false} 
                          tickLine={false}
                          width={70}
                        />
                        <Tooltip 
                          contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '11px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                          formatter={(value) => [formatNumber(value as number) + ' updates', 'Total']}
                        />
                        <Bar dataKey="updates" fill={COLORS.accent} radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                <motion.div 
                  className="chart-card bg-white/80 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
                  {...cardHoverProps}
                >
                  <div className="mb-2 sm:mb-3">
                    <span className="text-[9px] sm:text-[11px] uppercase tracking-wider text-[#64748B] font-medium">Demographic Breakdown</span>
                    <p className="text-[9px] sm:text-[10px] text-[#64748B] mt-1 hidden sm:block">Reveals migration & life-stage transitions</p>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 h-[100px] sm:h-[140px]">
                    <div className="w-1/2 h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={ageData}
                            cx="50%"
                            cy="50%"
                            innerRadius="50%"
                            outerRadius="85%"
                            dataKey="value"
                            stroke="none"
                          >
                            {ageData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="w-1/2 space-y-2 sm:space-y-3">
                      {ageData.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-sm" style={{ background: item.color }} />
                            <span className="text-[9px] sm:text-xs text-[#0F172A] truncate max-w-[60px] sm:max-w-none">{item.name}</span>
                          </div>
                          <span className="text-[9px] sm:text-xs font-medium text-[#0F172A]">{totalAll > 0 ? Math.round((item.value / totalAll) * 100) : 0}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="col-span-1 lg:col-span-3 space-y-3 sm:space-y-4">
                <motion.div 
                  className="chart-card bg-white/80 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
                  {...cardHoverProps}
                >
                  <div className="mb-2 sm:mb-3">
                    <span className="text-[9px] sm:text-[11px] uppercase tracking-wider text-[#64748B] font-medium">Emerging Hotspots</span>
                    <span className="text-[9px] sm:text-[10px] text-[#64748B] block mt-0.5 hidden sm:block">Where citizen activity is surging now</span>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2 max-h-[200px] sm:max-h-[320px] overflow-y-auto pr-1">
                    {topDistricts.slice(0, 8).map((district: { state: string; district: string; totalUpdates: number }, idx: number) => (
                      <div key={`${district.state}-${district.district}`} className="flex items-center justify-between py-1.5 sm:py-2 border-b border-[#E5E7EB] last:border-0">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          <span className={`text-[9px] sm:text-[10px] w-4 h-4 sm:w-5 sm:h-5 rounded flex items-center justify-center font-medium ${idx < 3 ? 'bg-[#D97706]/10 text-[#D97706]' : 'bg-[#F1F5F9] text-[#64748B]'}`}>{idx + 1}</span>
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm text-[#0F172A] truncate max-w-[100px] sm:max-w-none">{district.district}</div>
                            <div className="text-[9px] sm:text-[10px] text-[#64748B] truncate">{district.state}</div>
                          </div>
                        </div>
                        <div className="text-xs sm:text-sm font-medium text-[#0F172A] text-right flex-shrink-0">
                          {formatNumber(district.totalUpdates)}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div 
                  className="chart-card bg-white/80 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hidden lg:block"
                  {...cardHoverProps}
                >
                  <div className="mb-2 sm:mb-3">
                    <span className="text-[9px] sm:text-[11px] uppercase tracking-wider text-[#64748B] font-medium">Key Insights</span>
                  </div>
                  <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                    <div className="flex items-start gap-2">
                      <ChevronRight size={12} className="text-[#1E3A8A] mt-0.5 flex-shrink-0 sm:w-[14px] sm:h-[14px]" />
                      <span className="text-[#0F172A]">
                        <strong>{formatNumber(summaryStats.totalUpdates)}</strong> citizens served
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <ChevronRight size={12} className="text-[#1E3A8A] mt-0.5 flex-shrink-0 sm:w-[14px] sm:h-[14px]" />
                      <span className="text-[#0F172A]">
                        Working-age adults: <strong>{totalAll > 0 ? Math.round((ageData[2].value / totalAll) * 100) : 0}%</strong> majority
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <ChevronRight size={12} className="text-[#D97706] mt-0.5 flex-shrink-0 sm:w-[14px] sm:h-[14px]" />
                      <span className="text-[#0F172A]">
                        <strong>{summaryStats.highActivityCount}</strong> surge districts detected
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
          </AnimatePresence>
        </main>

        <Footer />

      </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <Dashboard />
    </Suspense>
  );
}
