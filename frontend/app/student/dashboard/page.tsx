'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api } from '@/lib/api';
import { getSession } from '@/lib/auth';
import { 
  Sparkles, 
  FileText, 
  Compass, 
  Map, 
  BookOpen, 
  Building2, 
  BarChart2, 
  CheckCircle2, 
  ArrowRight,
  UserCheck,
  Plus
} from 'lucide-react';

export default function StudentDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensure session or default to student demo
    let session = getSession();
    if (!session) {
      api.post('/auth/demo-login/student').then((res) => {
        localStorage.setItem('careerlens_token', res.data.access_token);
        localStorage.setItem('careerlens_user', JSON.stringify(res.data));
        fetchDashboardData();
      });
    } else {
      fetchDashboardData();
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [profRes, anaRes, recRes, jobRes] = await Promise.all([
        api.get('/student/profile'),
        api.get('/student/analyses'),
        api.get('/career/recommendations'),
        api.get('/companies/matching-jobs')
      ]);

      setProfile(profRes.data);
      setAnalyses(anaRes.data);
      setRecommendations(recRes.data);
      setJobs(jobRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const latestAnalysis = analyses[0];

  return (
    <div className="min-h-screen text-[var(--text-primary)] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Student Career Dashboard</h1>
            <p className="text-xs text-gray-400 mt-1">Track your ATS resume readiness, skill progress, and active hiring opportunities.</p>
          </div>

          <Link
            href="/student/analyze"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 transition flex items-center space-x-2 w-fit"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Resume</span>
          </Link>
        </div>

        {/* Dashboard Top Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Widget 1: Resume Health & ATS Score */}
          <div className="glass-card p-6 rounded-2xl border border-gray-800 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Resume Health</span>
                <FileText className="w-5 h-5 text-blue-400" />
              </div>

              {latestAnalysis ? (
                <div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-black text-white">{latestAnalysis.ats_score}</span>
                    <span className="text-sm text-gray-400 font-semibold">/ 100</span>
                  </div>
                  <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Target: {latestAnalysis.target_role || 'General Profile'}
                  </span>
                </div>
              ) : (
                <p className="text-xs text-gray-400">No resume analyzed yet.</p>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-800">
              {latestAnalysis ? (
                <Link href={`/student/ats-report/${latestAnalysis.id}`} className="text-xs font-semibold text-blue-400 hover:underline flex items-center space-x-1">
                  <span>View Full ATS Breakdown</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <Link href="/student/analyze" className="text-xs font-semibold text-blue-400 hover:underline">Upload Resume Now</Link>
              )}
            </div>
          </div>

          {/* Widget 2: Roadmap Progress */}
          <div className="glass-card p-6 rounded-2xl border border-gray-800 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Roadmap Progress</span>
                <Map className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="text-2xl font-extrabold text-white">Phase 2 of 5</span>
              <p className="text-xs text-gray-400 mt-1">Core Technical Competencies & FastAPI / ML Workflows</p>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-800">
              <Link href="/student/roadmap" className="text-xs font-semibold text-indigo-400 hover:underline flex items-center space-x-1">
                <span>View Full Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Widget 3: Skill Progress */}
          <div className="glass-card p-6 rounded-2xl border border-gray-800 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Skill Inventory</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(profile?.skills || ['Python', 'SQL', 'FastAPI', 'Machine Learning']).slice(0, 5).map((s: string, idx: number) => (
                  <span key={idx} className="bg-emerald-500/10 text-emerald-400 text-[11px] font-medium px-2 py-0.5 rounded border border-emerald-500/20">
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-800">
              <Link href="/student/resources" className="text-xs font-semibold text-emerald-400 hover:underline flex items-center space-x-1">
                <span>Explore Skill Resources</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

        {/* Recommended Roles & Hiring Opportunities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recommended Roles Box */}
          <div className="glass-card p-6 rounded-2xl border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white text-base flex items-center space-x-2">
                <Compass className="w-5 h-5 text-indigo-400" />
                <span>Recommended Roles For You</span>
              </h3>
              <Link href="/student/career-guidance" className="text-xs text-blue-400 hover:underline font-semibold">View All</Link>
            </div>

            <div className="space-y-3">
              {recommendations.slice(0, 3).map((rec, idx) => (
                <div key={idx} className="bg-gray-900/60 p-4 rounded-xl border border-gray-800 flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-white text-sm">{rec.title}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        rec.qualitative_fit === 'Strong Fit' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {rec.qualitative_fit}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{rec.why_reasons[0] || 'Good skill alignment.'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hiring Opportunities Box */}
          <div className="glass-card p-6 rounded-2xl border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white text-base flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <span>Companies Hiring For Your Profile</span>
              </h3>
              <Link href="/student/companies" className="text-xs text-emerald-400 hover:underline font-semibold">View All Jobs</Link>
            </div>

            <div className="space-y-3">
              {jobs.slice(0, 3).map((j, idx) => (
                <div key={idx} className="bg-gray-900/60 p-4 rounded-xl border border-gray-800 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-white text-sm">{j.title}</h4>
                    <span className="text-xs text-gray-400">{j.company_name} • {j.location}</span>
                  </div>
                  <span className="text-[10px] bg-gray-800 text-gray-300 px-2 py-1 rounded">
                    Verified {new Date(j.last_verified_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
