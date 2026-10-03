'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getSession, clearSession, loginDemoAccount, UserSession } from '@/lib/auth';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { 
  Sparkles, 
  FileText, 
  LayoutDashboard, 
  Compass, 
  Map, 
  BookOpen, 
  Building2, 
  User as UserIcon, 
  Briefcase, 
  Users, 
  LogOut, 
  Menu, 
  X,
  Sliders,
  Home,
  ChevronRight,
  Globe,
  Bot
} from 'lucide-react';

export default function Navbar() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setSession(getSession());
  }, [pathname]);

  const handleLogout = () => {
    clearSession();
    setSession(null);
    router.push('/');
  };

  const handleQuickDemo = async (role: 'student' | 'recruiter' | 'admin') => {
    try {
      const sess = await loginDemoAccount(role);
      setSession(sess);
      if (role === 'student') router.push('/student/dashboard');
      else if (role === 'recruiter') router.push('/recruiter/dashboard');
      else router.push('/admin/dashboard');
    } catch (e) {
      alert("Error connecting to backend API.");
    }
  };

  const navLinkStyle = (path: string) => {
    const isActive = pathname === path;
    return `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
      isActive 
        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border border-indigo-500/40 shadow-md font-bold'
        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5'
    }`;
  };

  return (
    <>
      {/* -------------------------------------------------- */}
      {/* MOBILE TOP HEADER BAR (Only visible on small screens) */}
      {/* -------------------------------------------------- */}
      <div className="md:hidden sticky top-0 z-40 bg-[var(--nav-bg)] backdrop-blur-xl border-b border-[var(--card-border)] px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-base text-[var(--text-primary)]">CareerLens</span>
        </Link>

        <div className="flex items-center space-x-2">
          <ThemeSwitcher />
          <button 
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 text-[var(--text-primary)] bg-white/5 border border-white/10 rounded-xl"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* -------------------------------------------------- */}
      {/* DESKTOP & MOBILE VERTICAL SIDEBAR NAVIGATION */}
      {/* -------------------------------------------------- */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 glass-card border-r border-[var(--card-border)] shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{ background: 'var(--nav-bg)', backdropFilter: 'blur(28px)' }}
      >
        {/* TOP BRANDING & LOGO */}
        <div className="p-5 border-b border-[var(--card-border)]">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group" onClick={() => setIsMobileOpen(false)}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:rotate-6 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg text-[var(--text-primary)] tracking-tight leading-none group-hover:text-indigo-400 transition-colors">CareerLens</span>
                <span className="text-[9px] text-indigo-400 font-bold tracking-widest uppercase mt-1">ATS & Guidance</span>
              </div>
            </Link>

            <button 
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden text-gray-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Day / Night Theme Switcher Bar */}
          <div className="mt-4 pt-3 border-t border-[var(--card-border)] flex items-center justify-between">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Appearance</span>
            <ThemeSwitcher />
          </div>

          {/* Quick Demo Context Switcher */}
          <div className="mt-3 bg-slate-950/60 p-2 rounded-xl border border-white/10">
            <div className="text-[9px] font-bold text-indigo-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Switch Role Context:</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <button 
                onClick={() => { handleQuickDemo('student'); setIsMobileOpen(false); }}
                className={`py-1 rounded text-[10px] font-bold transition ${session?.role === 'student' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
              >
                Student
              </button>
              <button 
                onClick={() => { handleQuickDemo('recruiter'); setIsMobileOpen(false); }}
                className={`py-1 rounded text-[10px] font-bold transition ${session?.role === 'recruiter' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
              >
                Recruiter
              </button>
              <button 
                onClick={() => { handleQuickDemo('admin'); setIsMobileOpen(false); }}
                className={`py-1 rounded text-[10px] font-bold transition ${session?.role === 'admin' ? 'bg-cyan-600 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>

        {/* MIDDLE VERTICAL NAVIGATION LINKS */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-none">
          <div className="px-3 py-1.5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Main Navigation</div>

          <Link href="/" className={navLinkStyle('/')} onClick={() => setIsMobileOpen(false)}>
            <Home className="w-4 h-4 text-indigo-400" />
            <span>Home</span>
          </Link>

          <Link href="/student/dashboard" className={navLinkStyle('/student/dashboard')} onClick={() => setIsMobileOpen(false)}>
            <LayoutDashboard className="w-4 h-4 text-purple-400" />
            <span>Student Dashboard</span>
          </Link>

          <Link href="/student/analyze" className={navLinkStyle('/student/analyze')} onClick={() => setIsMobileOpen(false)}>
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Analyze Resume</span>
          </Link>

          {/* NEW JOB MARKET & CITY FINDER LINK */}
          <Link href="/student/job-market" className={navLinkStyle('/student/job-market')} onClick={() => setIsMobileOpen(false)}>
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Job Market & Cities</span>
            <span className="ml-auto text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded font-bold">NEW</span>
          </Link>

          <Link href="/student/career-guidance" className={navLinkStyle('/student/career-guidance')} onClick={() => setIsMobileOpen(false)}>
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Career Guidance</span>
          </Link>

          <Link href="/student/roadmap" className={navLinkStyle('/student/roadmap')} onClick={() => setIsMobileOpen(false)}>
            <Map className="w-4 h-4 text-pink-400" />
            <span>Learning Roadmap</span>
          </Link>

          <Link href="/student/resources" className={navLinkStyle('/student/resources')} onClick={() => setIsMobileOpen(false)}>
            <BookOpen className="w-4 h-4 text-teal-400" />
            <span>Verified Resources</span>
          </Link>

          <Link href="/student/companies" className={navLinkStyle('/student/companies')} onClick={() => setIsMobileOpen(false)}>
            <Building2 className="w-4 h-4 text-blue-400" />
            <span>Companies Hiring</span>
          </Link>

          <div className="pt-3 px-3 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Portals</div>

          <Link href="/recruiter/dashboard" className={navLinkStyle('/recruiter/dashboard')} onClick={() => setIsMobileOpen(false)}>
            <Briefcase className="w-4 h-4 text-indigo-400" />
            <span>Recruiter Portal</span>
          </Link>

          <Link href="/admin/dashboard" className={navLinkStyle('/admin/dashboard')} onClick={() => setIsMobileOpen(false)}>
            <Sliders className="w-4 h-4 text-rose-400" />
            <span>Admin Config</span>
          </Link>
        </div>

        {/* BOTTOM USER PROFILE & LOGOUT CARD */}
        <div className="p-3.5 border-t border-[var(--card-border)] bg-slate-950/40">
          {session ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
                  {session.full_name[0]}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-[var(--text-primary)] truncate">{session.full_name}</span>
                  <span className="text-[10px] text-indigo-400 capitalize font-mono">{session.role} Account</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <Link 
                href="/auth/login"
                className="w-full text-center text-xs font-bold bg-white/10 hover:bg-white/15 text-white py-2 rounded-xl transition"
                onClick={() => setIsMobileOpen(false)}
              >
                Log In
              </Link>
              <Link 
                href="/student/analyze"
                className="w-full text-center text-xs font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 rounded-xl shadow-md transition hover:scale-[1.02]"
                onClick={() => setIsMobileOpen(false)}
              >
                Analyze Resume
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
