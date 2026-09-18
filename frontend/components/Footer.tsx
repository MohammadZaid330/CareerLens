import React from 'react';
import Link from 'next/link';
import { Sparkles, Shield, Lock, FileText, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--card-border)] bg-[var(--nav-bg)] text-gray-400 text-sm mt-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-lg text-[var(--text-primary)] tracking-tight">CareerLens</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              Production-grade ATS scoring engine, explainable career intelligence, skill gap roadmaps, and recruiter candidate matching platform.
            </p>
          </div>

          <div>
            <h4 className="text-indigo-400 font-bold text-xs uppercase tracking-widest mb-4">Student Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/student/analyze" className="hover:text-[var(--text-primary)] hover:translate-x-0.5 inline-block transition-transform">ATS Resume Analyzer</Link></li>
              <li><Link href="/student/career-guidance" className="hover:text-[var(--text-primary)] hover:translate-x-0.5 inline-block transition-transform">Career Role Fit Engine</Link></li>
              <li><Link href="/student/roadmap" className="hover:text-[var(--text-primary)] hover:translate-x-0.5 inline-block transition-transform">Personalized Career Roadmaps</Link></li>
              <li><Link href="/student/resources" className="hover:text-[var(--text-primary)] hover:translate-x-0.5 inline-block transition-transform">Verified Learning Resources</Link></li>
              <li><Link href="/student/companies" className="hover:text-[var(--text-primary)] hover:translate-x-0.5 inline-block transition-transform">Companies Hiring</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-purple-400 font-bold text-xs uppercase tracking-widest mb-4">Recruiter / HR</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/recruiter/dashboard" className="hover:text-[var(--text-primary)] hover:translate-x-0.5 inline-block transition-transform">Recruiter Portal</Link></li>
              <li><Link href="/recruiter/jobs" className="hover:text-[var(--text-primary)] hover:translate-x-0.5 inline-block transition-transform">Create Job Posting</Link></li>
              <li><Link href="/recruiter/candidates" className="hover:text-[var(--text-primary)] hover:translate-x-0.5 inline-block transition-transform">Candidate Profile Search</Link></li>
              <li><Link href="/recruiter/messages" className="hover:text-[var(--text-primary)] hover:translate-x-0.5 inline-block transition-transform">Candidate Pipeline & Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-cyan-400 font-bold text-xs uppercase tracking-widest mb-4">Trust & Security</h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-[var(--text-secondary)]">Deterministic 100-point rule engine (No random score hallucinations)</span>
              </div>
              <div className="flex items-start space-x-2">
                <Shield className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span className="text-[var(--text-secondary)]">Privacy-first resume handling & customizable recruiter discovery</span>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-[var(--card-border)] pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400">
          <p>© {new Date().getFullYear()} CareerLens SaaS Platform. Built with Next.js 16 & Python FastAPI.</p>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
            <span className="text-indigo-400/80 font-mono text-[11px] bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">100% Deterministic Engine</span>
            <span className="text-purple-400/80 font-mono text-[11px] bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full">Auditable ATS Breakdown</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
