'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api } from '@/lib/api';
import { 
  Map, 
  Clock, 
} from 'lucide-react';

function RoadmapContent() {
  const searchParams = useSearchParams();
  const targetRoleParam = searchParams.get('target_role') || 'AI/ML Engineer';

  const [targetRole, setTargetRole] = useState(targetRoleParam);
  const [roadmap, setRoadmap] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/career/roles').then(res => setRoles(res.data)).catch(() => {});
    fetchRoadmap(targetRole);
  }, [targetRole]);

  const fetchRoadmap = (role: string) => {
    setLoading(true);
    api.get(`/career/roadmap?target_role=${encodeURIComponent(role)}`)
      .then(res => {
        setRoadmap(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  return (
    <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Header & Role Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full text-xs text-purple-300 mb-2 font-semibold">
            <Map className="w-4 h-4 text-purple-400" />
            <span>Adaptive Career Roadmap Generator</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Personalized Learning Roadmap</h1>
          <p className="text-xs text-gray-400 mt-1">Adaptive schedule tailored to your current skill gaps. Already mastered topics are automatically skipped.</p>
        </div>

        <div className="w-full sm:w-64">
          <label className="block text-xs font-semibold text-gray-400 mb-1">Target Role:</label>
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500"
          >
            {roles.map(r => (
              <option key={r.id} value={r.title}>{r.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Roadmap Timeline Phases */}
      <div className="space-y-6 relative before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-gradient-to-b before:from-blue-600 before:via-indigo-600 before:to-purple-600 md:before:left-8">
        {roadmap.map((step, idx) => (
          <div key={idx} className="relative pl-14 md:pl-20">
            
            {/* Phase Number Badge */}
            <div className="absolute left-2 md:left-4 top-0 w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-lg shadow-blue-500/20 border-2 border-[#0b0f17]">
              {step.phase_number}
            </div>

            <div className="glass-card p-6 rounded-2xl border border-gray-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800/80 pb-3">
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <span>Phase {step.phase_number} — {step.phase_title}</span>
                </h3>
                <span className="text-xs bg-indigo-500/20 text-indigo-300 font-medium px-3 py-1 rounded-full border border-indigo-500/30 flex items-center space-x-1.5 w-fit">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Duration: {step.duration}</span>
                </span>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed">{step.description}</p>

              <div className="pt-2">
                <span className="text-xs font-semibold text-gray-400 block mb-2">Skills & Topics To Master:</span>
                <div className="flex flex-wrap gap-2">
                  {step.skills_to_learn?.map((s: string, sIdx: number) => (
                    <span key={sIdx} className="bg-blue-500/10 text-blue-300 text-xs px-3 py-1 rounded-lg border border-blue-500/20 font-medium">
                      • {s}
                    </span>
                  ))}
                </div>
              </div>

            </div>

          </div>
        ))}
      </div>
    </main>
  );
}

export default function RoadmapPage() {
  return (
    <div className="min-h-screen text-[var(--text-primary)] flex flex-col">
      <Navbar />
      <Suspense fallback={
        <div className="flex-1 flex justify-center items-center text-gray-400 text-sm">
          Loading personalized roadmap...
        </div>
      }>
        <RoadmapContent />
      </Suspense>
      <Footer />
    </div>
  );
}
