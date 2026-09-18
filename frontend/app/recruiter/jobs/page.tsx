'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api } from '@/lib/api';
import { Briefcase, Plus, MapPin, Calendar, CheckCircle2 } from 'lucide-react';

export default function RecruiterJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/recruiter/my-jobs')
      .then(res => {
        setJobs(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen text-[var(--text-primary)] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Active Job Openings</h1>
            <p className="text-xs text-gray-400 mt-1">Manage active openings and define required skills for candidate matching.</p>
          </div>

          <Link
            href="/recruiter/jobs/new"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center space-x-2 w-fit"
          >
            <Plus className="w-4 h-4" />
            <span>Create Job Opening</span>
          </Link>
        </div>

        <div className="space-y-4">
          {jobs.map((j, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl border border-gray-800 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white">{j.title}</h3>
                <span className="text-xs text-gray-400">{j.company_name} • {j.location} ({j.work_type})</span>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {j.required_skills?.map((s: string, sIdx: number) => (
                    <span key={sIdx} className="bg-indigo-500/10 text-indigo-300 text-[10px] px-2 py-0.5 rounded border border-indigo-500/20">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                href={`/recruiter/candidates?job_id=${j.id}`}
                className="bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
              >
                Search Matches
              </Link>
            </div>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}
