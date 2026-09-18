'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api } from '@/lib/api';
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  Calendar,
  ExternalLink
} from 'lucide-react';

export default function CompaniesHiringPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/companies/matching-jobs')
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
        
        <div className="border-b border-gray-800 pb-6">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-xs text-blue-300 mb-2 font-semibold">
            <Building2 className="w-4 h-4 text-blue-400" />
            <span>Profile-Matched Opportunity Discovery</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Companies Hiring For You</h1>
          <p className="text-xs text-gray-400 mt-1">Verified company job listings matching your extracted skills and career profile.</p>
        </div>

        {/* Job Cards List */}
        <div className="space-y-4">
          {jobs.map((j, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-base">
                    {j.company_name?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white leading-tight">{j.title}</h3>
                    <span className="text-xs text-gray-400 font-medium">{j.company_name}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-500" />
                    <span>{j.location} ({j.work_type})</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Briefcase className="w-3.5 h-3.5 text-gray-500" />
                    <span>{j.employment_type}</span>
                  </span>
                  {j.salary_range && (
                    <span className="flex items-center space-x-1 text-emerald-400 font-semibold">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{j.salary_range}</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-300 max-w-3xl leading-relaxed">{j.description}</p>

                {/* Required Skills Badges */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-gray-400">Required:</span>
                  {j.required_skills?.map((s: string, sIdx: number) => (
                    <span key={sIdx} className="bg-emerald-500/10 text-emerald-300 text-[11px] px-2.5 py-0.5 rounded border border-emerald-500/20 font-medium">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:items-end justify-between space-y-3 shrink-0 border-t md:border-t-0 border-gray-800 pt-4 md:pt-0">
                <span className="bg-gray-800 text-gray-300 text-[11px] px-3 py-1 rounded-full border border-gray-700 flex items-center space-x-1.5">
                  <Calendar className="w-3 h-3 text-blue-400" />
                  <span>Last verified: {new Date(j.last_verified_at).toLocaleDateString()}</span>
                </span>

                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition shadow-lg shadow-blue-600/20 flex items-center space-x-1.5">
                  <span>Apply Now</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}
