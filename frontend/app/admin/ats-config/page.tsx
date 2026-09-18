'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api } from '@/lib/api';
import { Sliders, CheckCircle2, AlertCircle, Save } from 'lucide-react';

export default function ATSConfigPage() {
  const [structureWeight, setStructureWeight] = useState<number>(20);
  const [keywordWeight, setKeywordWeight] = useState<number>(30);
  const [experienceWeight, setExperienceWeight] = useState<number>(20);
  const [contentWeight, setContentWeight] = useState<number>(15);
  const [compatibilityWeight, setCompatibilityWeight] = useState<number>(15);

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/admin/ats-config')
      .then(res => {
        setStructureWeight(res.data.structure_weight);
        setKeywordWeight(res.data.keyword_weight);
        setExperienceWeight(res.data.experience_weight);
        setContentWeight(res.data.content_weight);
        setCompatibilityWeight(res.data.compatibility_weight);
      })
      .catch(() => {});
  }, []);

  const totalWeight = structureWeight + keywordWeight + experienceWeight + contentWeight + compatibilityWeight;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (Math.abs(totalWeight - 100) > 0.01) {
      setError(`Category weights must sum up to exactly 100 points (Current sum: ${totalWeight.toFixed(1)}).`);
      return;
    }

    setLoading(true);
    try {
      await api.put('/admin/ats-config', {
        structure_weight: structureWeight,
        keyword_weight: keywordWeight,
        experience_weight: experienceWeight,
        content_weight: contentWeight,
        compatibility_weight: compatibilityWeight
      });
      setMessage("Backend ATS Category Scoring Weights updated successfully!");
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to update configuration.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-[var(--text-primary)] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-10 w-full space-y-6">
        
        <div className="border-b border-gray-800 pb-6">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-xs text-blue-300 mb-2 font-semibold">
            <Sliders className="w-4 h-4 text-blue-400" />
            <span>Deterministic Scoring Algorithm Weights</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Live ATS Category Weight Configurator</h1>
          <p className="text-xs text-gray-400 mt-1">Adjust backend category weights dynamically. The total must equal exactly 100 points.</p>
        </div>

        {message && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-xl text-xs font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-card p-8 rounded-2xl border border-gray-800 space-y-6">
          
          {/* Total Weight Counter Header */}
          <div className="flex justify-between items-center bg-gray-900/60 p-4 rounded-xl border border-gray-800">
            <span className="text-sm font-bold text-white">Total Weight Sum:</span>
            <span className={`text-2xl font-black ${Math.abs(totalWeight - 100) < 0.01 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {totalWeight.toFixed(1)} / 100 pts
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-bold text-white mb-2">
                <span>1. Resume Structure & Parsing</span>
                <span className="text-blue-400">{structureWeight} Points</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={structureWeight}
                onChange={(e) => setStructureWeight(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-white mb-2">
                <span>2. Keyword & Skills Optimization</span>
                <span className="text-blue-400">{keywordWeight} Points</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={keywordWeight}
                onChange={(e) => setKeywordWeight(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-white mb-2">
                <span>3. Experience & Achievement Quality</span>
                <span className="text-blue-400">{experienceWeight} Points</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={experienceWeight}
                onChange={(e) => setExperienceWeight(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-white mb-2">
                <span>4. Content Quality & Conciseness</span>
                <span className="text-blue-400">{contentWeight} Points</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={contentWeight}
                onChange={(e) => setContentWeight(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-white mb-2">
                <span>5. ATS Compatibility & Readability</span>
                <span className="text-blue-400">{compatibilityWeight} Points</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={compatibilityWeight}
                onChange={(e) => setCompatibilityWeight(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || Math.abs(totalWeight - 100) > 0.01}
            className={`w-full py-3.5 rounded-xl font-bold text-sm transition flex items-center justify-center space-x-2 ${
              Math.abs(totalWeight - 100) < 0.01 
                ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>Save ATS Category Weight Configuration</span>
          </button>

        </form>

      </main>

      <Footer />
    </div>
  );
}
