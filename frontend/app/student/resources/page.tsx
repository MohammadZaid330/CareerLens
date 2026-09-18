'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api } from '@/lib/api';
import { 
  BookOpen, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  Search,
  Tag
} from 'lucide-react';

export default function LearningResourcesPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = (skillQuery?: string) => {
    setLoading(true);
    const url = skillQuery ? `/career/resources?skill=${encodeURIComponent(skillQuery)}` : '/career/resources';
    api.get(url)
      .then(res => {
        setResources(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResources(search);
  };

  return (
    <div className="min-h-screen text-[var(--text-primary)] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-xs text-emerald-300 mb-2 font-semibold">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Verified Learning Resources Library</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Course & Learning Resource Guidance</h1>
            <p className="text-xs text-gray-400 mt-1">Official documentation and verified learning links for your target skill gaps.</p>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearch} className="flex items-center space-x-2 w-full sm:w-80">
            <input
              type="text"
              placeholder="Search skill (e.g. FastAPI, Docker)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-white text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500"
            />
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-xl">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resources.map((res, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl border border-gray-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-blue-500/10 text-blue-300 text-[10px] font-bold px-2.5 py-1 rounded border border-blue-500/20 uppercase">
                    {res.skill_name}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${res.is_free ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {res.is_free ? 'FREE' : 'PAID'}
                  </span>
                </div>

                <h3 className="font-bold text-white text-base leading-snug">{res.title}</h3>
                <p className="text-xs text-gray-400 mt-1">Platform: <span className="text-gray-300 font-semibold">{res.platform}</span></p>

                <div className="mt-4 flex items-center space-x-4 text-xs text-gray-400">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-gray-500" />
                    <span>{res.estimated_duration}</span>
                  </span>
                  <span className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded text-[10px]">
                    {res.level}
                  </span>
                </div>
              </div>

              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gray-900 hover:bg-gray-800 border border-gray-700 text-white text-xs font-semibold py-2.5 rounded-xl transition flex items-center justify-center space-x-2"
              >
                <span>Access Course Resource</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              </a>
            </div>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}
