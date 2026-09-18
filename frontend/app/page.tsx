'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  FileCheck, 
  Compass, 
  Map, 
  BookOpen, 
  Building2, 
  Briefcase, 
  Users, 
  Target, 
  BarChart2, 
  Cpu, 
  Lock, 
  HelpCircle,
  ChevronRight
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen text-[var(--text-primary)] flex flex-col selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-24 pb-28 overflow-hidden border-b border-[var(--card-border)]">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-gradient-to-tr from-[var(--mesh-1)] via-[var(--mesh-2)] to-[var(--mesh-3)] rounded-full blur-[140px] pointer-events-none opacity-80"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            
            <div className="inline-flex items-center space-x-2 bg-[var(--badge-bg)] border border-[var(--badge-border)] px-4 py-2 rounded-full text-xs text-[var(--badge-text)] mb-8 font-semibold shadow-inner">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span>100% Deterministic ATS Scoring & Career Intelligence SaaS</span>
            </div>

            <h1 className="text-4xl sm:text-7xl font-extrabold text-[var(--text-primary)] tracking-tight max-w-5xl mx-auto leading-[1.12]">
              Turn Your Resume Into Your <span className="gradient-text-primary">Career Roadmap.</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
              Analyze your resume, understand your ATS readiness, discover suitable career paths, identify skill gaps, follow a personalized roadmap, and find opportunities that match your profile.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/student/analyze"
                className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] hover:shadow-indigo-500/50 flex items-center justify-center space-x-2 text-base"
              >
                <span>Analyze My Resume</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/recruiter/dashboard"
                className="w-full sm:w-auto glass-card-interactive text-[var(--text-primary)] font-bold px-8 py-4 rounded-xl border border-[var(--card-border)] hover:border-indigo-500/40 transition flex items-center justify-center space-x-2 text-base"
              >
                <Briefcase className="w-5 h-5 text-indigo-400" />
                <span>For Recruiters</span>
              </Link>
            </div>

            {/* Feature Highlights Badges */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-left max-w-5xl mx-auto">
              <div className="glass-card p-5 rounded-2xl border border-[var(--card-border)]">
                <div className="text-indigo-400 font-bold text-sm mb-1.5 flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <BarChart2 className="w-4 h-4" />
                  </div>
                  <span>100-Point ATS Engine</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">Deterministic rule-based scoring out of 100 with category breakdowns.</p>
              </div>

              <div className="glass-card p-5 rounded-2xl border border-[var(--card-border)]">
                <div className="text-purple-400 font-bold text-sm mb-1.5 flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Compass className="w-4 h-4" />
                  </div>
                  <span>Qualitative Career Fit</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">Evidence-based Strong/Good/Potential Fit role recommendations.</p>
              </div>

              <div className="glass-card p-5 rounded-2xl border border-[var(--card-border)]">
                <div className="text-cyan-400 font-bold text-sm mb-1.5 flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Map className="w-4 h-4" />
                  </div>
                  <span>Adaptive Roadmaps</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">Phased learning timelines tailored to your exact missing skills.</p>
              </div>

              <div className="glass-card p-5 rounded-2xl border border-[var(--card-border)]">
                <div className="text-emerald-400 font-bold text-sm mb-1.5 flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span>Recruiter Matching</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">Direct job posting and transparent job-candidate match scores.</p>
              </div>
            </div>

          </div>
        </section>

        {/* 2. HOW IT WORKS */}
        <section className="py-24 border-b border-[var(--card-border)] bg-[var(--card-bg)]/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full w-fit mx-auto border border-indigo-500/20">End-to-End Workflow</h2>
              <p className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] mt-3">How CareerLens Works</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              <div className="glass-card-interactive p-6 rounded-2xl relative border border-[var(--card-border)]">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-lg mb-5 flex items-center justify-center shadow-lg shadow-indigo-500/25">1</div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Upload Resume</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">Drag & drop your PDF or DOCX file. Optionally choose a target role or leave blank for career discovery.</p>
              </div>

              <div className="glass-card-interactive p-6 rounded-2xl relative border border-[var(--card-border)]">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white font-bold text-lg mb-5 flex items-center justify-center shadow-lg shadow-purple-500/25">2</div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Get ATS Report</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">Receive a reproducible 100-point score, category breakdowns, detected strengths, and actionable fixes.</p>
              </div>

              <div className="glass-card-interactive p-6 rounded-2xl relative border border-[var(--card-border)]">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-bold text-lg mb-5 flex items-center justify-center shadow-lg shadow-cyan-500/25">3</div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Skill Gap & Roadmap</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">View missing core skills categorized by priority alongside an adaptive 5-phase learning roadmap with verified resources.</p>
              </div>

              <div className="glass-card-interactive p-6 rounded-2xl relative border border-[var(--card-border)]">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white font-bold text-lg mb-5 flex items-center justify-center shadow-lg shadow-emerald-500/25">4</div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Get Recruiter Found</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">Discover hiring companies or get discovered by verified recruiters looking for your skill profile.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ATS ANALYSIS PREVIEW */}
        <section className="py-24 border-b border-[var(--card-border)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              <div>
                <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-bold mb-4">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Rule-Based & Reproducible</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] leading-tight">
                  Transparent 100-Point ATS Scoring Engine
                </h2>
                <p className="text-[var(--text-secondary)] mt-4 text-sm sm:text-base leading-relaxed">
                  No mystery AI percentages. CareerLens uses backend-configurable weighted categories to evaluate your document structure, technical keyword coverage, achievement quality, content conciseness, and ATS compatibility.
                </p>

                <div className="mt-8 space-y-3.5">
                  <div className="flex items-center space-x-3 text-sm text-[var(--text-primary)]">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Resume Structure & Parsing — 20 Points</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-[var(--text-primary)]">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Keyword & Skills Optimization — 30 Points</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-[var(--text-primary)]">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Experience & Achievement Quality — 20 Points</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-[var(--text-primary)]">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Content Quality & Conciseness — 15 Points</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-[var(--text-primary)]">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>ATS Compatibility & Readability — 15 Points</span>
                  </div>
                </div>
              </div>

              {/* Sample Score Card */}
              <div className="glass-card p-8 rounded-3xl border border-[var(--card-border)] shadow-2xl relative glow-emerald">
                <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-6 mb-6">
                  <div>
                    <span className="text-xs text-indigo-400 uppercase tracking-widest font-bold">Sample Analysis Report</span>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mt-1">Alex Mercer — Target: AI/ML Engineer</h3>
                  </div>
                  <div className="text-right bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-2xl">
                    <span className="text-3xl font-black text-emerald-400">82 <span className="text-xs text-[var(--text-secondary)] font-semibold">/ 100</span></span>
                    <span className="block text-[10px] text-emerald-400 font-bold uppercase tracking-wider mt-0.5">Good ATS Readiness</span>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-[var(--text-primary)] font-semibold">Keyword Optimization</span>
                      <span className="text-indigo-400 font-bold">23 / 30</span>
                    </div>
                    <div className="w-full bg-[var(--bg-primary)]/80 rounded-full h-2.5 p-0.5 border border-[var(--card-border)]">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full" style={{ width: '76.6%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-[var(--text-primary)] font-semibold">Structure & Contact Info</span>
                      <span className="text-purple-400 font-bold">17 / 20</span>
                    </div>
                    <div className="w-full bg-[var(--bg-primary)]/80 rounded-full h-2.5 p-0.5 border border-[var(--card-border)]">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-[var(--text-primary)] font-semibold">Experience & Impact Verbs</span>
                      <span className="text-cyan-400 font-bold">16 / 20</span>
                    </div>
                    <div className="w-full bg-[var(--bg-primary)]/80 rounded-full h-2.5 p-0.5 border border-[var(--card-border)]">
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--card-border)] text-xs text-[var(--text-secondary)] bg-[var(--bg-primary)]/40 p-3.5 rounded-xl border border-[var(--card-border)]">
                  ⚠️ <strong>Disclaimer:</strong> Your score is calculated using our transparent rule engine. It provides a reliable compatibility estimate across standard corporate ATS platforms.
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 4. CAREER GUIDANCE & QUALITATIVE ROLE RECOMMENDATIONS */}
        <section className="py-24 border-b border-[var(--card-border)] bg-[var(--card-bg)]/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-xs font-bold text-purple-400 uppercase tracking-widest bg-purple-500/10 px-3 py-1 rounded-full w-fit mx-auto border border-purple-500/20">Evidence-Based Career Guidance</h2>
              <p className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] mt-3">Qualitative Role Fit Recommendations</p>
              <p className="text-[var(--text-secondary)] text-sm mt-3">We never invent fake percentages. CareerLens analyzes actual extracted resume evidence to categorize your role fit and explain exactly WHY.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card-interactive p-6 rounded-2xl border border-[var(--card-border)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">Good Fit</span>
                  <Briefcase className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Python Developer</h3>
                <div className="mt-4 space-y-2 text-xs text-[var(--text-secondary)]">
                  <p className="font-bold text-[var(--text-primary)] uppercase tracking-wider text-[10px]">Evidence Analysis:</p>
                  <p>✓ Python & FastAPI detected in technical skills.</p>
                  <p>✓ REST API backend project experience present.</p>
                  <p>✓ PostgreSQL database queries detected.</p>
                </div>
              </div>

              <div className="glass-card-interactive p-6 rounded-2xl border border-[var(--card-border)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-amber-500/20 text-amber-400 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/30">Potential Fit</span>
                  <Cpu className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)]">AI/ML Engineer</h3>
                <div className="mt-4 space-y-2 text-xs text-[var(--text-secondary)]">
                  <p className="font-bold text-[var(--text-primary)] uppercase tracking-wider text-[10px]">Evidence Analysis:</p>
                  <p>✓ Python & NumPy/Pandas present.</p>
                  <p>✓ Machine Learning image classifier project detected.</p>
                  <p className="text-rose-400 font-medium">🔴 Needs PyTorch and Deep Learning frameworks.</p>
                </div>
              </div>

              <div className="glass-card-interactive p-6 rounded-2xl border border-[var(--card-border)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-indigo-500/20 text-indigo-400 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/30">Good Fit</span>
                  <BarChart2 className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Data Analyst</h3>
                <div className="mt-4 space-y-2 text-xs text-[var(--text-secondary)]">
                  <p className="font-bold text-[var(--text-primary)] uppercase tracking-wider text-[10px]">Evidence Analysis:</p>
                  <p>✓ SQL data querying experience.</p>
                  <p>✓ Pandas & data cleaning pipeline experience.</p>
                  <p>✓ Statistical analysis coursework.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. RECRUITER PLATFORM */}
        <section className="py-24 border-b border-[var(--card-border)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              <div className="order-2 lg:order-1 glass-card p-8 rounded-3xl border border-[var(--card-border)]">
                <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3">Recruiter Candidate Search</h3>
                <div className="space-y-4">
                  <div className="bg-[var(--bg-primary)]/80 p-4.5 rounded-2xl border border-[var(--card-border)]">
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="font-bold text-[var(--text-primary)] text-sm">Alex Mercer — Candidate Profile</span>
                      <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold px-2.5 py-0.5 rounded-full text-[11px]">92.5% Profile Match</span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)]">Headline: Aspiring AI/ML Engineer & Full Stack Python Developer</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-2 py-0.5 rounded-full font-medium">✓ Python</span>
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-2 py-0.5 rounded-full font-medium">✓ SQL</span>
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-2 py-0.5 rounded-full font-medium">✓ Machine Learning</span>
                      <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] px-2 py-0.5 rounded-full font-medium">⚠ Docker missing</span>
                    </div>
                  </div>

                  <div className="bg-[var(--bg-primary)]/80 p-4.5 rounded-2xl border border-[var(--card-border)]">
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="font-bold text-[var(--text-primary)] text-sm">Sarah Chen — Candidate Profile</span>
                      <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold px-2.5 py-0.5 rounded-full text-[11px]">88.0% Profile Match</span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)]">Headline: Senior Backend Python & FastAPI Developer</p>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 px-3.5 py-1.5 rounded-full text-xs font-bold mb-4">
                  <Briefcase className="w-4 h-4" />
                  <span>Employer & Recruiter Portal</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] leading-tight">
                  Connect Talent with Verified Job Openings
                </h2>
                <p className="text-[var(--text-secondary)] mt-4 text-sm sm:text-base leading-relaxed">
                  Recruiters can create targeted job postings, specify required and preferred skills, search candidates with multi-attribute filters, inspect candidate profile match scores, and initiate contact requests.
                </p>
                <div className="mt-8">
                  <Link href="/recruiter/dashboard" className="inline-flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 font-bold text-sm bg-indigo-500/10 border border-indigo-500/20 px-5 py-2.5 rounded-xl hover:bg-indigo-500/20 transition-all">
                    <span>Explore Recruiter Platform</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 6. FAQ SECTION */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)]">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-4">
              <div className="glass-card p-6 rounded-2xl border border-[var(--card-border)]">
                <h3 className="font-bold text-[var(--text-primary)] text-base">Is the ATS score generated randomly by AI?</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">No! CareerLens uses a 100% deterministic, rule-based algorithm. The exact same resume uploaded with the same target role will yield the exact same score every time.</p>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-[var(--card-border)]">
                <h3 className="font-bold text-[var(--text-primary)] text-base">What file formats are supported for resume analysis?</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">We support PDF and Microsoft Word (DOCX) files up to 10MB.</p>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-[var(--card-border)]">
                <h3 className="font-bold text-[var(--text-primary)] text-base">Can candidates control recruiter visibility?</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">Yes. Candidates have full privacy control to toggle whether recruiters can discover their profile in candidate searches.</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
