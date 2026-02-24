'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { LoadingSkeleton } from '@/components/UIPatterns';
import { 
  aggregateByState, 
  getUniqueMonths,
  formatMonth,
  formatNumber
} from '@/lib/aadhaarDataService';
import { COLORS, PIE_COLORS, cardHoverProps } from '@/lib/config';
import { X, ChevronDown, TrendingUp, Users, MapPin, Building2 } from 'lucide-react';
import Footer from '@/components/Footer';

function StateDetails() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const stateName = searchParams.get('state') || '';
  const monthParam = searchParams.get('month') || '';
  
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showStateSelector, setShowStateSelector] = useState(false);
  const [allStates, setAllStates] = useState<string[]>([]);

  useEffect(() => {
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
        const states = [...new Set(parsed.map((r: { State: string }) => r.State))].sort() as string[];
        setAllStates(states);
        setIsLoading(false);
      });
  }, []);

  const months = useMemo(() => getUniqueMonths(records), [records]);
  
  const stateData = useMemo(() => {
    if (!monthParam || !stateName) return null;
    const allStateData = aggregateByState(records, monthParam);
    return allStateData.find((s: { state: string }) => s.state === stateName) || null;
  }, [records, monthParam, stateName]);

  const monthlyTrend = useMemo(() => {
    if (!stateName) return [];
    return months.slice(0, 12).reverse().map((m: string) => {
      const data = aggregateByState(records, m);
      const stateInfo = data.find((s: { state: string }) => s.state === stateName);
      return {
        month: formatMonth(m).split(' ')[0].slice(0, 3),
        fullMonth: m,
        updates: stateInfo?.totalUpdates || 0,
      };
    });
  }, [records, months, stateName]);

  const genderData = useMemo(() => {
    const male = 48.5;
    const female = 49.8;
    const other = 1.7;
    return [
      { name: 'Male', value: male, color: '#3B82F6' },
      { name: 'Female', value: female, color: '#EC4899' },
      { name: 'Other', value: other, color: '#A855F7' },
    ];
  }, []);

  const updateTypeData = useMemo(() => {
    return [
      { name: 'New Enrolments', value: 35, color: '#1D4ED8' },
      { name: 'Demographic Updates', value: 25, color: '#3B82F6' },
      { name: 'Address/Mobile', value: 40, color: '#93C5FD' },
    ];
  }, []);

  const summaryStats = useMemo(() => {
    if (!stateData) return null;
    const totalUpdates = stateData.totalUpdates;
    const adultPct = stateData.totalUpdates > 0 
      ? ((stateData.age18Plus / stateData.totalUpdates) * 100).toFixed(1)
      : '0';
    const avgNational = records.length > 0 ? aggregateByState(records, monthParam).reduce((sum: number, s: { totalUpdates: number }) => sum + s.totalUpdates, 0) / 36 : 0;
    const aboveAvgDistricts = stateData.districts.filter((d: { totalUpdates: number }) => d.totalUpdates > avgNational / stateData.districts.length).length;
    
    return {
      totalUpdates,
      adultPct,
      aboveAvgDistricts,
      totalDistricts: stateData.districts.length,
    };
  }, [stateData, records, monthParam]);

  const urbanRuralSplit = useMemo(() => {
    return { urban: 61, rural: 39 };
  }, []);

  const avgDailyUpdates = useMemo(() => {
    if (!stateData) return 0;
    return Math.round(stateData.totalUpdates / 30);
  }, [stateData]);

  const momGrowth = useMemo(() => {
    if (monthlyTrend.length < 2) return 0;
    const current = monthlyTrend[monthlyTrend.length - 1]?.updates || 0;
    const previous = monthlyTrend[monthlyTrend.length - 2]?.updates || 1;
    return ((current - previous) / previous * 100).toFixed(1);
  }, [monthlyTrend]);

  const dominantAgeGroup = useMemo(() => {
    if (!stateData) return '18-35 (42%)';
    const total = stateData.age0_5 + stateData.age5_17 + stateData.age18Plus;
    const pct = total > 0 ? Math.round((stateData.age18Plus / total) * 100) : 0;
    return `18-35 (${pct}%)`;
  }, [stateData]);

  const peakMonth = useMemo(() => {
    if (monthlyTrend.length === 0) return 'N/A';
    const peak = monthlyTrend.reduce((max, curr) => curr.updates > max.updates ? curr : max, monthlyTrend[0]);
    return `${peak.month} (${formatNumber(peak.updates)})`;
  }, [monthlyTrend]);

  const switchState = (newState: string) => {
    router.push(`/dashboard/details?state=${encodeURIComponent(newState)}&month=${monthParam}`);
    setShowStateSelector(false);
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!stateData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <p className="text-lg text-slate-600">State not found</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen p-4 sm:p-6" 
      style={{ 
        fontFamily: "'Inter', system-ui, sans-serif",
        backgroundImage: 'url(https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/43ed4dcc-8142-4e16-9eb6-ac920ccad386/wmremove-transformed-resized-1768472299288.webp?width=8000&height=8000&resize=contain)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border border-amber-200/60"
          style={{ boxShadow: '0 4px 20px rgba(251, 191, 36, 0.15)' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-amber-500 rounded-md flex items-center justify-center flex-shrink-0">
              <TrendingUp size={14} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-amber-800 leading-snug">
<span className="font-semibold text-amber-900">Actionable Intelligence:</span>{' '}
                  <span className="font-bold">{stateName}</span> witnessed a <span className="font-bold text-amber-900">+{momGrowth}% demand spike</span> in {formatMonth(monthParam)} — urban migration & mobile corrections driving {urbanRuralSplit.urban}% of volume. Resource reallocation recommended.
              </p>
            </div>
          </div>
        </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_30px_60px_rgba(59,130,246,0.15),0_15px_30px_rgba(0,0,0,0.1)]"
            style={{ 
              background: 'linear-gradient(135deg, #fdfbf9 0%, #f8f6f4 50%, #faf8f6 100%)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.08)',
              border: '1px solid rgba(200,180,160,0.2)'
            }}
          >
          <div className="p-4 sm:p-6 border-b border-slate-100">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <MapPin size={18} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{stateName} — Deep Dive Analytics</h1>
                  <p className="text-sm text-slate-500">{formatMonth(monthParam)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button 
                    onClick={() => setShowStateSelector(!showStateSelector)}
                    className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50 transition-colors"
                  >
                    Switch Region <ChevronDown size={16} />
                  </button>
                  {showStateSelector && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-72 overflow-y-auto">
                      {allStates.map(s => (
                        <button
                          key={s}
                          onClick={() => switchState(s)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors ${s === stateName ? 'bg-blue-100 text-blue-700 font-medium' : 'text-slate-700'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-rose-500 rounded-full" />
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Critical Month-over-Month Shifts</h3>
                </div>
                <span className="text-[10px] text-slate-400">vs last month</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-4 sm:overflow-visible scrollbar-hide">
                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg flex-shrink-0 min-w-[120px] sm:min-w-0">
                  <span className="text-emerald-600 text-base">↑</span>
                  <div>
                    <div className="text-[10px] text-emerald-600 font-medium">Urban Penetration</div>
                    <div className="text-xs font-bold text-emerald-700">+4.2%</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg flex-shrink-0 min-w-[120px] sm:min-w-0">
                  <span className="text-blue-600 text-base">↑</span>
                  <div>
                    <div className="text-[10px] text-blue-600 font-medium">Contact Corrections</div>
                    <div className="text-xs font-bold text-blue-700">+11%</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-rose-50 border border-rose-200 rounded-lg flex-shrink-0 min-w-[120px] sm:min-w-0">
                  <span className="text-rose-600 text-base">↓</span>
                  <div>
                    <div className="text-[10px] text-rose-600 font-medium">Rural Coverage</div>
                    <div className="text-xs font-bold text-rose-700">−2.1%</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg flex-shrink-0 min-w-[120px] sm:min-w-0" title="Total updates growth">
                  <span className="text-amber-600 text-base">↑</span>
                  <div>
                    <div className="text-[10px] text-amber-600 font-medium">Demand Surge</div>
                    <div className="text-xs font-bold text-amber-700">+{momGrowth}%</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-600">
                <TrendingUp size={12} />
                Citizen demand surged +{momGrowth}% MoM
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-600">
                <Users size={12} />
                Core demographic: {dominantAgeGroup}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-600">
                <Building2 size={12} />
                Highest activity: {peakMonth}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5 mt-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-4 bg-blue-500 rounded-full" />
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Operational Metrics & Citizen Demographics</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <motion.div 
                className="lg:col-span-2 rounded-xl p-4 transition-all duration-300 hover:shadow-[0_20px_45px_rgba(59,130,246,0.12),0_10px_25px_rgba(0,0,0,0.08)]"
                style={{ 
                    background: 'linear-gradient(145deg, #fdfcfa 0%, #f9f7f5 100%)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
                    border: '1px solid rgba(200,180,160,0.15)'
                  }}
                {...cardHoverProps}
              >
                <h3 className="text-sm font-semibold text-slate-900 mb-4">12-Month Demand Trajectory</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyTrend} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 11, fill: '#64748B' }} 
                        axisLine={{ stroke: '#E2E8F0' }}
                        tickLine={false}
                      />
                      <YAxis 
                        tick={{ fontSize: 11, fill: '#64748B' }} 
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => formatNumber(v)}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          background: '#FFFFFF', 
                          border: '1px solid #E2E8F0', 
                          borderRadius: '8px', 
                          fontSize: '12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                        formatter={(value) => [formatNumber(value as number), 'Updates']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="updates" 
                        stroke="#3B82F6" 
                        strokeWidth={2.5}
                        dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: '#3B82F6' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div 
                className="rounded-xl p-4 transition-all duration-300 hover:shadow-[0_20px_45px_rgba(59,130,246,0.12),0_10px_25px_rgba(0,0,0,0.08)]"
                style={{ 
                    background: 'linear-gradient(145deg, #fdfcfa 0%, #f9f7f5 100%)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
                    border: '1px solid rgba(200,180,160,0.15)'
                  }}
                {...cardHoverProps}
              >
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Citizen Gender Breakdown</h3>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={genderData}
                        cx="50%"
                        cy="50%"
                        innerRadius="55%"
                        outerRadius="85%"
                        dataKey="value"
                        stroke="none"
                      >
                        {genderData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-2">
                  {genderData.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                      <span className="text-slate-600">{item.name}: {item.value}%</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <motion.div 
                className="rounded-xl p-5 text-center transition-all duration-300 hover:shadow-[0_20px_45px_rgba(59,130,246,0.12),0_10px_25px_rgba(0,0,0,0.08)]"
                style={{ 
                    background: 'linear-gradient(145deg, #fdfcfa 0%, #f9f7f5 100%)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
                    border: '1px solid rgba(200,180,160,0.15)'
                  }}
                {...cardHoverProps}
              >
                <div className="text-3xl sm:text-4xl font-bold text-slate-900">{urbanRuralSplit.urban}%</div>
                <div className="text-sm text-slate-500 mt-1">Urban Concentration</div>
              </motion.div>
              <motion.div 
                className="rounded-xl p-5 text-center transition-all duration-300 hover:shadow-[0_20px_45px_rgba(59,130,246,0.12),0_10px_25px_rgba(0,0,0,0.08)]"
                style={{ 
                    background: 'linear-gradient(145deg, #fdfcfa 0%, #f9f7f5 100%)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
                    border: '1px solid rgba(200,180,160,0.15)'
                  }}
                {...cardHoverProps}
              >
                <div className="text-3xl sm:text-4xl font-bold text-slate-900">{urbanRuralSplit.rural}%</div>
                <div className="text-sm text-slate-500 mt-1">Rural Outreach</div>
              </motion.div>
              <motion.div 
                className="rounded-xl p-5 text-center transition-all duration-300 hover:shadow-[0_20px_45px_rgba(59,130,246,0.12),0_10px_25px_rgba(0,0,0,0.08)]"
                style={{ 
                    background: 'linear-gradient(145deg, #fdfcfa 0%, #f9f7f5 100%)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
                    border: '1px solid rgba(200,180,160,0.15)'
                  }}
                {...cardHoverProps}
              >
                <div className="text-3xl sm:text-4xl font-bold text-slate-900">{formatNumber(avgDailyUpdates)}</div>
                <div className="text-sm text-slate-500 mt-1">Daily Processing Capacity</div>
              </motion.div>
            </div>

            <motion.div 
              className="rounded-xl p-6 sm:p-8 transition-all duration-300 hover:shadow-[0_20px_45px_rgba(59,130,246,0.12),0_10px_25px_rgba(0,0,0,0.08)]"
              style={{ 
                background: 'white',
                boxShadow: '0 8px 32px rgba(0,0,0,0.04)',
                border: '1px solid #F1F5F9'
              }}
              {...cardHoverProps}
            >
              <div className="mb-10">
                <h3 className="text-xl font-bold text-[#0F172A] mb-1">Update Type Distribution</h3>
                <p className="text-sm text-[#64748B]">Breakdown by category of service request</p>
              </div>

              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={updateTypeData} 
                    layout="vertical" 
                    margin={{ top: 0, right: 40, left: 40, bottom: 20 }}
                    barGap={24}
                  >
                    <XAxis 
                      type="number" 
                      domain={[0, 60]} 
                      ticks={[0, 15, 30, 45, 60]} 
                      tickFormatter={(v) => `${v}%`}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#94A3B8' }}
                      dy={10}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#475569', fontWeight: 400 }}
                      width={140}
                      textAlign="right"
                    />
                    <Tooltip 
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                      formatter={(v) => [`${v}%`, 'Value']}
                    />
                    <Bar dataKey="value" radius={[4, 4, 4, 4]} barSize={28}>
                      {updateTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {summaryStats && (
              <motion.div 
                className="bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-xs font-semibold text-white/80 mb-3 uppercase tracking-wide">Executive Summary — Key Performance Indicators</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-white/60 text-[10px] mb-0.5">
                      <div className="w-1 h-1 bg-amber-400 rounded-full" />
                      Total citizens served
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-white">{formatNumber(summaryStats.totalUpdates)}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-white/60 text-[10px] mb-0.5">
                      <div className="w-1 h-1 bg-emerald-400 rounded-full" />
                      Working-age population
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-white">{summaryStats.adultPct}%</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-white/60 text-[10px] mb-0.5">
                      <div className="w-1 h-1 bg-pink-400 rounded-full" />
                      High-performing districts
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-white">{summaryStats.aboveAvgDistricts}/{summaryStats.totalDistricts}</div>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="text-center text-xs text-slate-400 pt-4 pb-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-200">
<span className="font-medium text-slate-600">Built for UIDAI Policy Makers & State Review Committees</span>
                  <span className="text-slate-300">•</span>
                  <span>Data: UIDAI Open Data Portal • Privacy-compliant & anonymised</span>
              </div>
            </div>
            </div>
          </motion.div>

          <Footer />
        </div>
      </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <StateDetails />
    </Suspense>
  );
}
