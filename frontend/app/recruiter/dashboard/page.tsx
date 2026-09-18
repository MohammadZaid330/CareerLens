'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api } from '@/lib/api';
import { getSession } from '@/lib/auth';
import { 
  Briefcase, 
  Users, 
  Plus, 
  MessageSquare, 
  Search, 
  Building2, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let session = getSession();
    if (!session || session.role !== 'recruiter') {
      api.post('/auth/demo-login/recruiter').then((res) => {
        localStorage.setItem('careerlens_token', res.data.access_token);
        localStorage.setItem('careerlens_user', JSON.stringify(res.data));
        fetchRecruiterData();
      });
    } else {
      fetchRecruiterData();
    }
  }, []);

  const fetchRecruiterData = async () => {
    try {
      const [jobsRes, candRes, contRes] = await Promise.all([
        api.get('/recruiter/my-jobs'),
        api.get('/recruiter/candidates/search'),
        api.get('/recruiter/contact-requests')
      ]);

      setJobs(jobsRes.data);
      setCandidates(candRes.data);
      setContacts(contRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-[var(--text-primary)] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        {/* Recruiter Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-6">
          <div>
            <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Employer Platform</span>
            <h1 className="text-3xl font-extrabold text-white mt-1">Recruiter & HR Portal</h1>
            <p className="text-xs text-gray-400 mt-1">Manage job openings, search verified candidate profiles, and track candidate contacts.</p>
          </div>

          <Link
            href="/recruiter/jobs/new"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 transition flex items-center space-x-2 w-fit"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Job Opening</span>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-gray-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-gray-400 uppercase">Active Jobs</span>
              <Briefcase className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-3xl font-extrabold text-white">{jobs.length}</span>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-gray-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-gray-400 uppercase">Matched Candidates</span>
              <Users className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="text-3xl font-extrabold text-white">{candidates.length}</span>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-gray-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-gray-400 uppercase">Contact Requests</span>
              <MessageSquare className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-3xl font-extrabold text-white">{contacts.length}</span>
          </div>
        </div>

        {/* Candidate Search & Top Matches */}
        <div className="glass-card p-6 rounded-2xl border border-gray-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-white text-lg flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span>Top Candidate Profile Matches</span>
            </h3>
            <Link href="/recruiter/candidates" className="text-xs text-blue-400 hover:underline font-semibold flex items-center space-x-1">
              <span>View All Candidates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {candidates.slice(0, 4).map((cand, idx) => (
              <div key={idx} className="bg-gray-900/60 p-4 rounded-xl border border-gray-800 flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-white text-sm">{cand.full_name}</h4>
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded">
                      {cand.match_score}% Job Profile Match
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{cand.headline}</p>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {cand.matched_skills?.map((s: string, sIdx: number) => (
                      <span key={sIdx} className="bg-blue-500/10 text-blue-300 text-[10px] px-2 py-0.5 rounded">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
