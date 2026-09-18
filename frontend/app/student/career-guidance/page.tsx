'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api } from '@/lib/api';
import { 
  Compass, 
  CheckCircle2, 
  ArrowRight, 
  Map, 
  Briefcase, 
  Info,
  ChevronRight
} from 'lucide-react';

export default function CareerGuidancePage() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/career/recommendations')
      .then(res => {
        setRecommendations(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getFitBadgeColor = (fit: string) => {
    switch (fit) {
      case 'Strong Fit': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Good Fit': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Potential Fit': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-gray-800 text-gray-400 border-gray-700';
    }
  };

  return (
    <div className="min-h-screen text-[var(--text-primary)] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        <div className="border-b border-gray-800 pb-6">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full text-xs text-indigo-300 mb-3 font-semibold">
            <Compass className="w-4 h-4 text-indigo-400" />
            <span>Explainable Career Recommendation Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Recommended Career Roles</h1>
          <p className="text-xs text-gray-400 mt-1 max-w-3xl">
            Evaluated based on skills, education, and project experience actually detected in your resume. No arbitrary percentage scores.
          </p>
        </div>

        {/* Roles List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl border border-gray-800 flex flex-col justify-between space-y-6">
              
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-white">{rec.title}</h3>
                    <span className="text-xs text-gray-400 font-medium">{rec.fit_score_estimate}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getFitBadgeColor(rec.qualitative_fit)}`}>
                    {rec.qualitative_fit}
                  </span>
                </div>

                {/* Evidence "Why" Section */}
                <div className="mt-4 bg-gray-900/60 p-4 rounded-xl border border-gray-800 space-y-2">
                  <span className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1">Why This Role Matches:</span>
                  {rec.why_reasons?.map((reason: string, rIdx: number) => (
                    <div key={rIdx} className="flex items-start space-x-2 text-xs text-gray-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>

                {/* Focus Next Section */}
                {rec.next_focus_skills?.length > 0 && (
                  <div className="mt-4">
                    <span className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2">Focus Next On:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {rec.next_focus_skills.map((s: string, sIdx: number) => (
                        <span key={sIdx} className="bg-amber-500/10 text-amber-300 text-xs px-2.5 py-1 rounded border border-amber-500/20">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-gray-800 flex justify-between items-center">
                <Link
                  href={`/student/roadmap?target_role=${encodeURIComponent(rec.title)}`}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center space-x-1.5"
                >
                  <Map className="w-3.5 h-3.5" />
                  <span>Generate Roadmap for {rec.title}</span>
                </Link>
              </div>

            </div>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}
