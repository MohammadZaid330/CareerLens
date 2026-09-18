'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api } from '@/lib/api';
import { saveSession } from '@/lib/auth';
import { Sparkles, Lock, Mail, User, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'student' | 'recruiter'>('student');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister ? { email, password, full_name: fullName, role } : { email, password };
      
      const res = await api.post(endpoint, payload);
      saveSession(res.data);

      if (res.data.role === 'recruiter') router.push('/recruiter/dashboard');
      else if (res.data.role === 'admin') router.push('/admin/dashboard');
      else router.push('/student/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Authentication failed. Please check credentials.');
      setLoading(false);
    }
  };

  const handleDemo = async (demoRole: 'student' | 'recruiter' | 'admin') => {
    try {
      const res = await api.post(`/auth/demo-login/${demoRole}`);
      saveSession(res.data);
      if (demoRole === 'recruiter') router.push('/recruiter/dashboard');
      else if (demoRole === 'admin') router.push('/admin/dashboard');
      else router.push('/student/dashboard');
    } catch (e) {
      setError("Demo login error. Please check if backend is running.");
    }
  };

  return (
    <div className="min-h-screen text-[var(--text-primary)] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-md mx-auto px-4 py-12 w-full flex flex-col justify-center">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-blue-500/25">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white">{isRegister ? 'Create Platform Account' : 'Welcome Back to CareerLens'}</h1>
          <p className="text-xs text-gray-400 mt-1">Sign in to access your ATS reports, roadmaps, or recruitment pipeline.</p>
        </div>

        {/* Demo Quick Logins Box */}
        <div className="glass-card p-4 rounded-xl border border-gray-800 mb-6 bg-gradient-to-br from-blue-900/20 to-indigo-900/20">
          <span className="text-xs font-bold text-blue-300 uppercase tracking-wider block mb-2 text-center">1-Click Demo Login</span>
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => handleDemo('student')} className="bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-white text-xs font-medium py-2 rounded-lg transition">
              Student Demo
            </button>
            <button onClick={() => handleDemo('recruiter')} className="bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-white text-xs font-medium py-2 rounded-lg transition">
              Recruiter Demo
            </button>
            <button onClick={() => handleDemo('admin')} className="bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-white text-xs font-medium py-2 rounded-lg transition">
              Admin Demo
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-xl text-xs mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-card p-6 rounded-2xl border border-gray-800 space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Account Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full bg-gray-900 border border-gray-700 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500"
                >
                  <option value="student">Student / Job Seeker</option>
                  <option value="recruiter">Recruiter / Employer</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs py-3 rounded-xl transition mt-2 shadow-lg shadow-blue-600/20"
          >
            {loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs text-blue-400 hover:underline"
            >
              {isRegister ? 'Already have an account? Sign In' : 'Need an account? Register Now'}
            </button>
          </div>
        </form>

      </main>

      <Footer />
    </div>
  );
}
