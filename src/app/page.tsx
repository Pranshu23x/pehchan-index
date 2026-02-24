'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, X, Database, BarChart3, Filter, LineChart, AlertTriangle, CheckCircle, ChevronRight, Github, Linkedin } from 'lucide-react';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { Menu } from 'lucide-react';

const BACKGROUND_IMAGE = 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/43ed4dcc-8142-4e16-9eb6-ac920ccad386/image-1768469527733.png?width=8000&height=8000&resize=contain';

const DASHBOARD_SCREENSHOT = 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/43ed4dcc-8142-4e16-9eb6-ac920ccad386/image-1768466947300.png?width=8000&height=8000&resize=contain';

const teamMembers = [
  {
    name: 'Pranshu Kumar',
    contributions: [
      'Developed the analytics dashboard',
      'Implemented maps, charts, and KPIs',
      'Integrated data into live insights',
      'Finalized the product for demo'
    ],
    github: 'https://github.com/Pranshu23x',
    linkedin: 'https://www.linkedin.com/in/pranshukumar23/'
  },
  {
    name: 'Harsha Darshita Ojha',
    contributions: [
      'Coded major dashboard sections',
      'Implemented insight logic and summaries',
      'Worked on data-driven components',
      'Helped stabilize the final build'
    ],
    github: 'https://github.com/HarshaDarshitaOjha',
    linkedin: 'https://www.linkedin.com/in/harsha-ojha-9530a4346/'
  },
  {
    name: 'Raj Verma',
    contributions: [
      'Coded the landing page',
      'Worked on frontend components',
      'Contributed to overall site build'
    ],
    github: 'https://github.com/raj-k-v',
    linkedin: 'https://www.linkedin.com/in/raj-verma-tech/'
  },
  {
    name: 'Abhishek Padhy',
    contributions: [
      'Worked with project datasets',
      'Supported data integration',
      'Contributed to presentation-related code'
    ],
    github: 'https://github.com/abhisekpadhy2244-dev',
    linkedin: 'https://www.linkedin.com/in/abhisek-padhy-126573334/'
  }
];

export default function LandingPage() {
  const [expandedMember, setExpandedMember] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div
      className="min-h-screen text-[#1a1a2e]"
      style={{
        backgroundImage: `url(${BACKGROUND_IMAGE})`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center'
      }}>

      <nav className="sticky top-0 z-50 mx-2 sm:mx-4 lg:mx-6 pt-2">
        <div className="max-w-6xl mx-auto">
          <div className="backdrop-blur-xl bg-[#fffbf0]/80 rounded-2xl sm:rounded-[2rem] px-4 sm:px-5 lg:px-8 py-2.5 sm:py-3 lg:py-4 border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center">
                  <img
                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/f9017d5e-73bf-44cc-9774-6f7da4784972/image-1767439313415.png?width=8000&height=8000&resize=contain"
                    alt="Pehchaan Index Logo"
                    className="w-full h-full object-contain" />
                </div>
                <div>
                  <h1 className="text-base sm:text-lg lg:text-xl font-bold tracking-tight text-[#1E3A8A]">Pehchaan Index</h1>
                  <p className="text-[10px] sm:text-xs lg:text-sm text-[#4a5568] font-medium hidden sm:block">Evidence-Based Governance at Scale</p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => document.getElementById('problem-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-4 lg:px-5 py-2 lg:py-2.5 rounded-full text-sm font-semibold text-[#1E3A8A] bg-[#1E3A8A]/10 hover:bg-[#1E3A8A]/20 transition-all duration-200">
                  The Problem
                </button>
                <button
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-4 lg:px-5 py-2 lg:py-2.5 rounded-full text-sm font-semibold text-[#1E3A8A] bg-[#1E3A8A]/10 hover:bg-[#1E3A8A]/20 transition-all duration-200">
                  Workflow
                </button>
                <button
                  onClick={() => document.getElementById('meet-the-team')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-4 lg:px-5 py-2 lg:py-2.5 rounded-full text-sm font-semibold text-[#1E3A8A] bg-[#1E3A8A]/10 hover:bg-[#1E3A8A]/20 transition-all duration-200">
                  Built By
                </button>
                <div className="w-px h-6 bg-[#1E3A8A]/20 mx-2" />
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 lg:px-5 py-2 lg:py-2.5 rounded-full bg-[#1E3A8A] text-white text-sm font-semibold hover:bg-[#1E3A8A]/90 transition-all duration-200 shadow-md">
                  View Dashboard
                </Link>
              </div>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-[#1E3A8A]/10 hover:bg-[#1E3A8A]/20 transition-colors">
                {mobileMenuOpen ? <X className="w-5 h-5 text-[#1E3A8A]" /> : <Menu className="w-5 h-5 text-[#1E3A8A]" />}
              </button>
            </div>
            
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="md:hidden overflow-hidden">
                  <div className="pt-4 pb-2 flex flex-col gap-2">
                    <button
                      onClick={() => { document.getElementById('problem-section')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }}
                      className="w-full px-4 py-3 rounded-xl text-sm font-semibold text-[#1E3A8A] bg-[#1E3A8A]/10 hover:bg-[#1E3A8A]/20 transition-all duration-200 text-left">
                      The Problem
                    </button>
                    <button
                      onClick={() => { document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }}
                      className="w-full px-4 py-3 rounded-xl text-sm font-semibold text-[#1E3A8A] bg-[#1E3A8A]/10 hover:bg-[#1E3A8A]/20 transition-all duration-200 text-left">
                      Workflow
                    </button>
                    <button
                      onClick={() => { document.getElementById('meet-the-team')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }}
                      className="w-full px-4 py-3 rounded-xl text-sm font-semibold text-[#1E3A8A] bg-[#1E3A8A]/10 hover:bg-[#1E3A8A]/20 transition-all duration-200 text-left">
                      Built By
                    </button>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#1E3A8A] text-white text-sm font-semibold hover:bg-[#1E3A8A]/90 transition-all duration-200 shadow-md">
                      View Dashboard
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      <main>
        <section className="py-4 sm:py-6 lg:py-8 overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <motion.div
                className="order-2 lg:order-1"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}>

                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E3A8A]/10 border border-[#1E3A8A]/20 text-[#1E3A8A] text-sm font-medium mb-6">
                  <span className="w-2 h-2 bg-[#1E3A8A] rounded-full animate-pulse" />
                  UIDAI Data Hackathon
                </motion.div>

                <h1 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl lg:text-4xl xl:text-5xl leading-[1.2] mb-4 sm:mb-5 text-black tracking-tight font-bold">
                  Detecting demographic <em className="italic font-medium">stress</em> and 
                  <span className="block"><em className="italic font-medium">service gaps</em> from Aadhaar behaviour.</span>
                </h1>
                
                <p className="text-sm sm:text-base lg:text-lg text-[#4a5568] mb-6 sm:mb-8 leading-relaxed font-medium max-w-xl">
                  Data → Signal → Decision → Administrative Action. 
                  Converting 1.4 billion+ Aadhaar update records into measurable outcomes—enabling 
                  resource reallocation, trend forecasting, and real-time operational visibility for administrators.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link href="/dashboard">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-7 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-[#1a1a2e] to-[#2d2d44] hover:from-[#2d2d44] hover:to-[#1a1a2e] text-white font-semibold text-sm sm:text-base transition-all duration-300 shadow-[0_4px_24px_rgba(26,26,46,0.4)] border border-white/10 w-full sm:w-auto">
                      View Dashboard
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>
                  </Link>
                  <motion.button
                    onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 rounded-full bg-white/70 backdrop-blur-sm border border-[#1E3A8A]/20 text-[#1E3A8A] font-semibold text-sm sm:text-base transition-all duration-300 w-full sm:w-auto">
                    See Workflow
                  </motion.button>
                </div>

                <div className="mt-8 sm:mt-10 grid grid-cols-3 gap-2 sm:gap-4">
                  {[
                    { value: '36', label: 'States & UTs Covered' },
                    { value: '700+', label: 'Districts Analyzed' },
                    { value: '3', label: 'Demographic Segments' }
                  ].map((stat, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1, duration: 0.5 }}
                      className="text-center p-2 sm:p-3 rounded-xl bg-white/50 backdrop-blur-sm border border-white/60">
                      <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1E3A8A]">{stat.value}</div>
                      <div className="text-[10px] sm:text-xs lg:text-sm text-[#4a5568] font-medium">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="order-1 lg:order-2 lg:col-span-1 lg:-mr-20 xl:-mr-32"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}>

                <div className="relative lg:scale-110 lg:origin-left">
                  <div className="absolute -inset-4 bg-gradient-to-r from-[#1E3A8A]/20 via-[#D97706]/20 to-[#1E3A8A]/20 rounded-3xl blur-2xl opacity-60" />
                  <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-white/40">
                    <img
                      src={DASHBOARD_SCREENSHOT}
                      alt="Pehchaan Index Dashboard Preview"
                      className="w-full h-auto" />
                  </div>
                  
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="problem-section" className="py-8 sm:py-12">
          <div className="flex flex-col lg:flex-row items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-left px-6 lg:pl-[calc((100vw-72rem)/2+1.5rem)] lg:pr-12 w-full lg:w-1/2 flex-shrink-0">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a1a2e] mb-4 sm:mb-6 tracking-tight">
                The Problem We Solve
              </h2>
              <p className="text-sm sm:text-base text-[#4a5568] mb-4 sm:mb-6 leading-relaxed font-medium">
                Aadhaar enrolment and update demand shows strong regional and temporal variation, yet the absence of real-time demand visibility leads to reactive decision-making. Current systems lack the ability to convert large-scale Aadhaar data into predictive signals that enable proactive planning and system optimization.
              </p>
              <div className="space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 rounded-xl bg-white/50 border border-[#1E3A8A]/10">
                  <h3 className="text-[#1E3A8A] font-bold text-sm sm:text-base mb-1">Reactive Resource Deployment</h3>
                  <p className="text-xs sm:text-sm text-[#4a5568] font-medium">Mobile vans and enrolment centres are deployed after backlogs form—not before demand spikes occur.</p>
                </div>
                <div className="p-3 sm:p-4 rounded-xl bg-white/50 border border-[#1E3A8A]/10">
                  <h3 className="text-[#1E3A8A] font-bold text-sm sm:text-base mb-1">Invisible Migration Patterns</h3>
                  <p className="text-xs sm:text-sm text-[#4a5568] font-medium">Address update surges signal population movement, but this data sits unused for urban planning.</p>
                </div>
                <div className="p-3 sm:p-4 rounded-xl bg-white/50 border border-[#1E3A8A]/10">
                  <h3 className="text-[#1E3A8A] font-bold text-sm sm:text-base mb-1">Missed Early Warnings</h3>
                  <p className="text-xs sm:text-sm text-[#4a5568] font-medium">Age-group spikes and persistent anomalies indicate structural access issues—but without dashboards, they go unnoticed.</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full lg:w-1/2 flex-shrink-0 mt-8 lg:mt-0">
              <img
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/43ed4dcc-8142-4e16-9eb6-ac920ccad386/image-1768478737407.png?width=8000&height=8000&resize=contain"
                alt="Monthly Aadhaar Updates Trend Chart"
                className="w-full h-[250px] sm:h-[350px] lg:h-[480px] object-cover object-left rounded-2xl lg:rounded-l-2xl lg:rounded-r-none shadow-lg mx-auto lg:mx-0 px-6 lg:px-0" />
            </motion.div>
          </div>
        </section>

        <section id="how-it-works" className="py-10 sm:py-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16">
              <span className="inline-block px-4 py-2 rounded-full bg-[#1E3A8A]/10 text-[#1E3A8A] text-sm font-semibold mb-4">
                How It Works
              </span>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-[#1a1a2e] tracking-tight">
                The <em className="italic">Workflow</em>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 relative">
              <WorkflowCard
                number={1}
                icon={<Database className="w-5 h-5" />}
                title="Official UIDAI Datasets"
                lines={[
                  "All datasets sourced from UIDAI's official open data portal",
                  "Anonymised • Aggregated • Monthly releases"
                ]}
                note="(No personal or identifiable data)"
                delay={0}
              />
              <div className="hidden lg:flex absolute left-[calc(33.33%-12px)] top-[80px] text-[#1E3A8A]/40">
                <ChevronRight className="w-6 h-6" />
              </div>
              <WorkflowCard
                number={2}
                icon={<Filter className="w-5 h-5" />}
                title="Data Structuring"
                lines={[
                  "Datasets organised month-wise and region-wise",
                  "State • District • Age group • Update category"
                ]}
                delay={0.1}
              />
              <div className="hidden lg:flex absolute left-[calc(66.66%-12px)] top-[80px] text-[#1E3A8A]/40">
                <ChevronRight className="w-6 h-6" />
              </div>
              <WorkflowCard
                number={3}
                icon={<BarChart3 className="w-5 h-5" />}
                title="Comparative Analysis"
                lines={[
                  "District vs State baseline",
                  "State vs National average",
                  "Month-on-month comparison"
                ]}
                delay={0.2}
              />
              <WorkflowCard
                number={4}
                icon={<LineChart className="w-5 h-5" />}
                title="Pehchaan Index Dashboard"
                lines={[
                  "India heatmap",
                  "Rankings & trends",
                  "Decision-ready view for planners"
                ]}
                delay={0.3}
              />
              <div className="hidden lg:flex absolute left-[calc(33.33%-12px)] bottom-[80px] text-[#1E3A8A]/40">
                <ChevronRight className="w-6 h-6" />
              </div>
              <WorkflowCard
                number={5}
                icon={<CheckCircle className="w-5 h-5" />}
                title="Insight Generation"
                lines={[
                  "Operational hotspots",
                  "Coverage gaps",
                  "Consistent trend patterns"
                ]}
                delay={0.4}
              />
              <div className="hidden lg:flex absolute left-[calc(66.66%-12px)] bottom-[80px] text-[#1E3A8A]/40">
                <ChevronRight className="w-6 h-6" />
              </div>
              <WorkflowCard
                number={6}
                icon={<AlertTriangle className="w-5 h-5" />}
                title="Signal Detection"
                lines={[
                  "Normal activity",
                  "Above-normal spikes",
                  "Unusual drops or trends"
                ]}
                delay={0.5}
              />
            </div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-10 sm:mt-14 pt-8 sm:pt-10 border-t border-[#1E3A8A]/10">
              <div className="space-y-3 sm:space-y-4 text-left">
                <p className="text-sm sm:text-base text-[#1a1a2e] font-bold tracking-wide flex items-center gap-3 sm:gap-4">
                  <span className="w-2 h-2 rounded-full bg-[#1E3A8A]"></span>
                  Data sourced only from UIDAI official datasets
                </p>
                <p className="text-sm sm:text-base text-[#1a1a2e] font-bold tracking-wide flex items-center gap-3 sm:gap-4">
                  <span className="w-2 h-2 rounded-full bg-[#1E3A8A]"></span>
                  Fully anonymised & aggregated
                </p>
                <p className="text-sm sm:text-base text-[#1a1a2e] font-bold tracking-wide flex items-center gap-3 sm:gap-4">
                  <span className="w-2 h-2 rounded-full bg-[#1E3A8A]"></span>
                  Built for monitoring, planning & policy insights
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="meet-the-team" className="py-10 sm:py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}>

              <div className="text-left mb-8 sm:mb-10">
                <h2 className="font-[family-name:var(--font-dancing)] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a1a2e] tracking-tight">
                  Built By
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {teamMembers.map((member, idx) => (
                  <motion.div
                    key={idx}
                    layoutId={`card-${idx}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}
                    onClick={() => setExpandedMember(idx)}
                    className="p-4 sm:p-6 bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300 cursor-pointer">

                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <h3 className="text-base sm:text-lg font-black text-[#1a1a2e]">{member.name}</h3>
                      <div className="flex items-center gap-2">
                        <a href={member.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="w-8 h-8 rounded-full bg-[#1a1a2e]/10 hover:bg-[#1a1a2e]/20 flex items-center justify-center transition-colors">
                          <Github className="w-4 h-4 text-[#1a1a2e]" />
                        </a>
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="w-8 h-8 rounded-full bg-[#0077B5]/10 hover:bg-[#0077B5]/20 flex items-center justify-center transition-colors">
                          <Linkedin className="w-4 h-4 text-[#0077B5]" />
                        </a>
                      </div>
                    </div>
                    <ul className="space-y-1.5">
                      {member.contributions.map((item, i) => (
                        <li key={i} className="text-sm text-[#4a5568] leading-relaxed font-medium flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A8A] mt-1.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <AnimatePresence>
            {expandedMember !== null && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                  onClick={() => setExpandedMember(null)}
                />
                <motion.div
                  layoutId={`card-${expandedMember}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="fixed inset-4 sm:inset-8 md:inset-12 lg:inset-16 bg-white rounded-3xl z-50 overflow-hidden shadow-2xl flex flex-col"
                >
                  <div className="absolute top-4 right-4 z-10">
                    <button
                      onClick={() => setExpandedMember(null)}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors"
                    >
                      <X className="w-5 h-5 text-[#1a1a2e]" />
                    </button>
                  </div>
                  
                  <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 text-center">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#D97706] flex items-center justify-center mb-6"
                    >
                      <span className="text-4xl sm:text-5xl font-black text-white">
                        {teamMembers[expandedMember].name.charAt(0)}
                      </span>
                    </motion.div>
                    
                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1a1a2e] mb-4"
                    >
                      {teamMembers[expandedMember].name}
                    </motion.h3>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center gap-3 mb-8"
                    >
                      <a href={teamMembers[expandedMember].github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#1a1a2e]/10 hover:bg-[#1a1a2e]/20 flex items-center justify-center transition-colors">
                        <Github className="w-5 h-5 text-[#1a1a2e]" />
                      </a>
                      <a href={teamMembers[expandedMember].linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#0077B5]/10 hover:bg-[#0077B5]/20 flex items-center justify-center transition-colors">
                        <Linkedin className="w-5 h-5 text-[#0077B5]" />
                      </a>
                    </motion.div>
                    
                    <motion.ul
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      className="space-y-3 max-w-2xl text-left"
                    >
                      {teamMembers[expandedMember].contributions.map((item, i) => (
                        <li key={i} className="text-base sm:text-lg text-[#4a5568] leading-relaxed font-semibold flex items-start gap-3">
                          <span className="w-2 h-2 rounded-full bg-[#1E3A8A] mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </motion.ul>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </section>

        <section className="py-10 sm:py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1a1a2e] mb-3 sm:mb-4 tracking-tight">
                View Dashboard
              </h2>
              <p className="text-sm sm:text-base text-[#4a5568] mb-6 sm:mb-8 max-w-xl mx-auto font-medium">
                Explore national overviews, drill down to any district, 
                and discover signals that drive smarter governance.
              </p>
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gradient-to-r from-[#1a1a2e] to-[#2d2d44] hover:from-[#2d2d44] hover:to-[#1a1a2e] text-white font-semibold text-base sm:text-lg transition-all duration-300 shadow-[0_4px_24px_rgba(26,26,46,0.4)] border border-white/10">
                  View Dashboard
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function WorkflowCard({ number, icon, title, lines, note, delay }: { 
  number: number; 
  icon: React.ReactNode; 
  title: string; 
  lines: string[]; 
  note?: string; 
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white text-xs sm:text-sm font-bold">
          {number}
        </div>
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#1E3A8A]/10 flex items-center justify-center text-[#1E3A8A]">
          {icon}
        </div>
      </div>
      <h3 className="text-base sm:text-lg font-bold text-[#1a1a2e] mb-2 sm:mb-3">{title}</h3>
      <div className="space-y-1.5 sm:space-y-2">
        {lines.map((line, idx) => (
          <p key={idx} className="text-xs sm:text-sm text-[#64748B] font-medium">{line}</p>
        ))}
        {note && <p className="text-[10px] sm:text-xs text-[#94A3B8] mt-2 italic">{note}</p>}
      </div>
    </motion.div>
  );
}
