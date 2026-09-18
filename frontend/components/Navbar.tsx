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
  ShieldAlert,
  ChevronRight
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
      alert("Error connecting to backend API. Please ensure backend is running.");
    }
  };

  const linkStyle = (path: string) => 
    pathname === path 
      ? 'text-indigo-400 font-semibold bg-indigo-500/15 border border-indigo-500/30 px-3 py-1.5 rounded-lg shadow-sm text-xs sm:text-sm transition-all'
      : 'text-gray-300 hover:text-white hover:bg-white/5 px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-all';

  const renderStudentLinks = () => (
    <>
      <Link href="/student/dashboard" className={linkStyle('/student/dashboard')}>
        Dashboard
      </Link>
      <Link href="/student/analyze" className={linkStyle('/student/analyze')}>
        Analyze Resume
      </Link>
      <Link href="/student/career-guidance" className={linkStyle('/student/career-guidance')}>
        Career Guidance
      </Link>
      <Link href="/student/roadmap" className={linkStyle('/student/roadmap')}>
        Roadmap
      </Link>
      <Link href="/student/resources" className={linkStyle('/student/resources')}>
        Resources
      </Link>
      <Link href="/student/companies" className={linkStyle('/student/companies')}>
        Companies
      </Link>
    </>
  );

  const renderRecruiterLinks = () => (
    <>
      <Link href="/recruiter/dashboard" className={linkStyle('/recruiter/dashboard')}>
        Recruiter Dashboard
      </Link>
      <Link href="/recruiter/jobs" className={linkStyle('/recruiter/jobs')}>
        Job Openings
      </Link>
      <Link href="/recruiter/candidates" className={linkStyle('/recruiter/candidates')}>
        Search Candidates
      </Link>
      <Link href="/recruiter/messages" className={linkStyle('/recruiter/messages')}>
        Contact Requests
      </Link>
    </>
  );

  const renderAdminLinks = () => (
    <>
      <Link href="/admin/dashboard" className={linkStyle('/admin/dashboard')}>
        Admin Overview
      </Link>
      <Link href="/admin/ats-config" className={linkStyle('/admin/ats-config')}>
        ATS Weights Config
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 glass-nav">
      {/* Demo Switcher Quick Banner */}
      <div className="bg-gradient-to-r from-slate-950/90 via-indigo-950/80 to-slate-950/90 border-b border-white/10 px-4 py-1.5 text-xs text-gray-300 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded-full font-mono font-bold text-[10px] tracking-wider uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span>
            LIVE DEMO
          </span>
          <span className="hidden sm:inline text-gray-400 text-xs">Switch role context:</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <button onClick={() => handleQuickDemo('student')} className="hover:text-white text-gray-300 bg-white/5 hover:bg-indigo-600/30 border border-white/10 px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all">
              Student
            </button>
            <button onClick={() => handleQuickDemo('recruiter')} className="hover:text-white text-gray-300 bg-white/5 hover:bg-purple-600/30 border border-white/10 px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all">
              Recruiter
            </button>
            <button onClick={() => handleQuickDemo('admin')} className="hover:text-white text-gray-300 bg-white/5 hover:bg-cyan-600/30 border border-white/10 px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all">
              Admin
            </button>
          </div>
          
          <div className="border-l border-white/20 pl-2">
            <ThemeSwitcher />
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
              <Sparkles className="w-5 h-5 text-white drop-shadow" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-[var(--text-primary)] tracking-tight leading-none group-hover:text-indigo-400 transition-colors">CareerLens</span>
              <span className="text-[9px] text-indigo-400 font-bold tracking-widest uppercase mt-0.5">ATS & Career Platform</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link href="/" className={linkStyle('/')}>
              Home
            </Link>
            {session?.role === 'student' && renderStudentLinks()}
            {session?.role === 'recruiter' && renderRecruiterLinks()}
            {session?.role === 'admin' && renderAdminLinks()}
          </nav>

          {/* User Status / Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {session ? (
              <div className="flex items-center space-x-3">
                <span className="text-xs bg-slate-900/90 text-gray-200 border border-indigo-500/30 px-3 py-1.5 rounded-full flex items-center space-x-2 shadow-inner">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-semibold text-white">{session.full_name}</span>
                  <span className="text-indigo-300 capitalize text-[10px] bg-indigo-500/20 px-1.5 py-0.5 rounded font-mono">({session.role})</span>
                </span>

                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition border border-transparent hover:border-rose-500/20"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  href="/auth/login" 
                  className="text-xs font-semibold text-gray-300 hover:text-white px-3.5 py-2 hover:bg-white/5 rounded-xl transition"
                >
                  Log In
                </Link>
                <Link 
                  href="/student/analyze" 
                  className="text-xs font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:scale-[1.02] flex items-center gap-1.5"
                >
                  <span>Analyze Resume</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button 
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="text-gray-300 hover:text-white p-2 rounded-lg bg-white/5 border border-white/10"
            >
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="md:hidden glass-card border-b border-white/10 px-4 pt-3 pb-6 space-y-2 rounded-none">
          <Link href="/" className="block py-2 px-3 text-sm rounded-lg text-gray-300 hover:bg-white/5 hover:text-white" onClick={() => setIsMobileOpen(false)}>Home</Link>
          {session?.role === 'student' && (
            <>
              <Link href="/student/dashboard" className="block py-2 px-3 text-sm rounded-lg text-gray-300 hover:bg-white/5 hover:text-white" onClick={() => setIsMobileOpen(false)}>Dashboard</Link>
              <Link href="/student/analyze" className="block py-2 px-3 text-sm rounded-lg text-gray-300 hover:bg-white/5 hover:text-white" onClick={() => setIsMobileOpen(false)}>Analyze Resume</Link>
              <Link href="/student/career-guidance" className="block py-2 px-3 text-sm rounded-lg text-gray-300 hover:bg-white/5 hover:text-white" onClick={() => setIsMobileOpen(false)}>Career Guidance</Link>
              <Link href="/student/roadmap" className="block py-2 px-3 text-sm rounded-lg text-gray-300 hover:bg-white/5 hover:text-white" onClick={() => setIsMobileOpen(false)}>Roadmap</Link>
              <Link href="/student/resources" className="block py-2 px-3 text-sm rounded-lg text-gray-300 hover:bg-white/5 hover:text-white" onClick={() => setIsMobileOpen(false)}>Resources</Link>
              <Link href="/student/companies" className="block py-2 px-3 text-sm rounded-lg text-gray-300 hover:bg-white/5 hover:text-white" onClick={() => setIsMobileOpen(false)}>Companies</Link>
            </>
          )}
          {session?.role === 'recruiter' && (
            <>
              <Link href="/recruiter/dashboard" className="block py-2 px-3 text-sm rounded-lg text-gray-300 hover:bg-white/5 hover:text-white" onClick={() => setIsMobileOpen(false)}>Recruiter Dashboard</Link>
              <Link href="/recruiter/jobs" className="block py-2 px-3 text-sm rounded-lg text-gray-300 hover:bg-white/5 hover:text-white" onClick={() => setIsMobileOpen(false)}>Job Openings</Link>
              <Link href="/recruiter/candidates" className="block py-2 px-3 text-sm rounded-lg text-gray-300 hover:bg-white/5 hover:text-white" onClick={() => setIsMobileOpen(false)}>Candidate Search</Link>
            </>
          )}
          {session ? (
            <button onClick={handleLogout} className="w-full text-left py-2 px-3 text-sm text-rose-400 font-semibold hover:bg-rose-500/10 rounded-lg">Logout ({session.full_name})</button>
          ) : (
            <Link href="/auth/login" className="block py-2 px-3 text-sm text-indigo-400 font-bold hover:bg-indigo-500/10 rounded-lg" onClick={() => setIsMobileOpen(false)}>Log In / Sign Up</Link>
          )}
        </div>
      )}
    </header>
  );
}
