'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api } from '@/lib/api';
import { getSession } from '@/lib/auth';
import { 
  BarChart2, 
  Users, 
  FileText, 
  Briefcase, 
  Sliders, 
  MessageSquare,
  ShieldAlert
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let session = getSession();
    if (!session || session.role !== 'admin') {
      api.post('/auth/demo-login/admin').then((res) => {
        localStorage.setItem('careerlens_token', res.data.access_token);
        localStorage.setItem('careerlens_user', JSON.stringify(res.data));
        fetchStats();
      });
    } else {
      fetchStats();
    }
  }, []);

  const fetchStats = () => {
    api.get('/admin/stats')
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  return (
    <div className="min-h-screen text-[var(--text-primary)] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-6">
          <div>
            <span className="text-xs text-rose-400 font-semibold uppercase tracking-wider">System Administration</span>
            <h1 className="text-3xl font-extrabold text-white mt-1">Admin Operations Dashboard</h1>
            <p className="text-xs text-gray-400 mt-1">System health, platform metrics, and live ATS category weight configuration.</p>
          </div>

          <Link
            href="/admin/ats-config"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 transition flex items-center space-x-2 w-fit"
          >
            <Sliders className="w-4 h-4" />
            <span>Configure ATS Weights</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-gray-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-gray-400 uppercase">Total Platform Users</span>
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-3xl font-extrabold text-white">{stats?.total_users || 0}</span>
            <span className="block text-[11px] text-gray-400 mt-1">{stats?.students_count || 0} Students, {stats?.recruiters_count || 0} Recruiters</span>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-gray-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-gray-400 uppercase">Resumes Analyzed</span>
              <FileText className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="text-3xl font-extrabold text-white">{stats?.total_analyses || 0}</span>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-gray-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-gray-400 uppercase">Average ATS Score</span>
              <BarChart2 className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-3xl font-extrabold text-emerald-400">{stats?.average_ats_score || 75.0} <span className="text-sm font-normal text-gray-400">/ 100</span></span>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-gray-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-gray-400 uppercase">Active Jobs</span>
              <Briefcase className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-3xl font-extrabold text-white">{stats?.active_jobs || 0}</span>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
