'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api } from '@/lib/api';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  ArrowRight, 
  Download, 
  Compass, 
  Map, 
  Info,
  BarChart2,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function ATSReportPage() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) return;

    api.get(`/student/analysis/${params.id}`)
      .then((res) => {
        setReport(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load ATS report.");
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen text-[var(--text-primary)] flex flex-col justify-center items-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-gray-400">Loading stored ATS analysis report...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen text-[var(--text-primary)] flex flex-col justify-center items-center">
        <p className="text-rose-400 font-bold">{error || "Report not found"}</p>
        <button onClick={() => router.push('/student/analyze')} className="mt-4 bg-blue-600 px-4 py-2 rounded-xl text-sm">Upload New Resume</button>
      </div>
    );
  }

  const getStatusBadge = (score: number) => {
    if (score >= 85) return { label: 'Excellent', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
    if (score >= 70) return { label: 'Good', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
    if (score >= 55) return { label: 'Needs Improvement', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
    return { label: 'Poor', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' };
  };

  const status = getStatusBadge(report.ats_score);

  return (
    <div className="min-h-screen text-[var(--text-primary)] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        {/* Header Title & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
          <div>
            <span className="text-xs text-blue-400 font-semibold uppercase tracking-wider">ATS Audit Dashboard</span>
            <h1 className="text-3xl font-extrabold text-white mt-1">
              Resume Analysis Report {report.target_role ? `— ${report.target_role}` : ''}
            </h1>
            <p className="text-xs text-gray-400 mt-1">Analyzed on {new Date(report.created_at).toLocaleDateString()}</p>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => window.print()}
              className="glass-card hover:bg-white/10 text-gray-300 px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center space-x-2 transition"
            >
              <Download className="w-4 h-4" />
              <span>Download Report</span>
            </button>
            <button 
              onClick={() => router.push(`/student/career-guidance`)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center space-x-2 transition shadow-lg shadow-blue-600/20"
            >
              <span>Explore Career Guidance</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ATS Score & Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Score Gauge Box */}
          <div className="glass-card p-8 rounded-3xl border border-gray-800 text-center flex flex-col justify-center items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Overall ATS Score</span>
            
            <div className="relative my-4 flex items-center justify-center">
              <div className="w-44 h-44 rounded-full border-8 border-gray-800 flex items-center justify-center relative">
                <div className="text-center">
                  <span className="text-5xl font-black text-white tracking-tight">{report.ats_score}</span>
                  <span className="block text-sm text-gray-400 font-semibold">/ 100</span>
                </div>
              </div>
            </div>

            <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold border mt-2 ${status.color}`}>
              {status.label}
            </span>

            {/* ATS Disclaimer */}
            <div className="mt-6 text-[11px] text-gray-400 bg-gray-900/60 p-3 rounded-xl border border-gray-800 text-left flex items-start space-x-2">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                Your ATS score is calculated using our defined resume-analysis criteria. It is an estimate of resume compatibility and does not guarantee a score used by any specific employer’s ATS.
              </span>
            </div>
          </div>

          {/* Category Score Breakdown */}
          <div className="lg:col-span-2 glass-card p-8 rounded-3xl border border-gray-800">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
              <BarChart2 className="w-5 h-5 text-blue-400" />
              <span>Weighted Category Score Breakdown</span>
            </h2>

            <div className="space-y-5">
              {Object.entries(report.category_breakdown || {}).map(([catName, scores]: [string, any]) => {
                const percentage = (scores.earned / scores.max) * 100;
                return (
                  <div key={catName}>
                    <div className="flex justify-between items-center text-sm mb-1.5">
                      <span className="font-semibold text-gray-200">{catName}</span>
                      <span className="font-bold text-white">
                        {scores.earned} <span className="text-gray-400 font-normal">/ {scores.max} pts</span>
                      </span>
                    </div>
                    <div className="w-full bg-gray-900 rounded-full h-3 p-0.5 border border-gray-800">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          percentage >= 80 ? 'bg-emerald-500' : percentage >= 60 ? 'bg-blue-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Strengths & Problems Found Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Strengths List */}
          <div className="glass-card p-6 rounded-2xl border border-gray-800">
            <h3 className="text-base font-bold text-emerald-400 mb-4 flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Strengths Detected ({report.strengths?.length || 0})</span>
            </h3>
            <ul className="space-y-3 text-sm">
              {report.strengths?.map((str: string, idx: number) => (
                <li key={idx} className="flex items-start space-x-2.5 text-gray-300 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Problems Found List */}
          <div className="glass-card p-6 rounded-2xl border border-gray-800">
            <h3 className="text-base font-bold text-amber-400 mb-4 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Problems Found ({report.problems?.length || 0})</span>
            </h3>
            <ul className="space-y-3 text-sm">
              {report.problems?.map((prob: string, idx: number) => (
                <li key={idx} className="flex items-start space-x-2.5 text-gray-300 bg-amber-500/5 p-3 rounded-xl border border-amber-500/10">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{prob}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Actionable Recommendations Box */}
        <div className="glass-card p-8 rounded-3xl border border-gray-800">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <span>Recommended Actionable Improvements</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.suggestions?.map((sug: string, idx: number) => (
              <div key={idx} className="bg-gray-900/60 p-4 rounded-xl border border-gray-800 flex items-start space-x-3">
                <span className="w-6 h-6 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs text-gray-300 leading-relaxed">{sug}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps CTA Bar */}
        <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-purple-900/40 border border-blue-500/30 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-white">Ready for your personalized career roadmap?</h4>
            <p className="text-xs text-gray-300 mt-1">Discover skill gaps and tailored learning modules based on your parsed skills.</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => router.push('/student/roadmap')}
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center space-x-2 transition"
            >
              <Map className="w-4 h-4" />
              <span>View Career Roadmap</span>
            </button>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
