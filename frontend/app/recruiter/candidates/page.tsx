'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api } from '@/lib/api';
import { 
  Users, 
  Search, 
  Filter, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  Briefcase,
  MapPin,
  GraduationCap
} from 'lucide-react';

export default function CandidateSearchPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [skillFilter, setSkillFilter] = useState<string>("");
  const [contactModalUser, setContactModalUser] = useState<any | null>(null);
  const [contactMessage, setContactMessage] = useState<string>("");
  const [contactSuccess, setContactSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/recruiter/my-jobs').then(res => setJobs(res.data)).catch(() => {});
    fetchCandidates();
  }, []);

  const fetchCandidates = (jobId?: string, role?: string, skill?: string) => {
    setLoading(true);
    let queryParams = [];
    if (jobId) queryParams.push(`job_id=${jobId}`);
    if (role) queryParams.push(`role=${encodeURIComponent(role)}`);
    if (skill) queryParams.push(`skill=${encodeURIComponent(skill)}`);

    const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
    api.get(`/recruiter/candidates/search${queryString}`)
      .then(res => {
        setCandidates(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCandidates(selectedJobId, roleFilter, skillFilter);
  };

  const handleSendContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactModalUser || !contactMessage) return;

    try {
      await api.post('/recruiter/contact', {
        student_id: contactModalUser.student_id,
        job_id: selectedJobId ? parseInt(selectedJobId) : null,
        message: contactMessage
      });
      setContactSuccess(`Contact request sent to ${contactModalUser.full_name}!`);
      setTimeout(() => {
        setContactModalUser(null);
        setContactMessage("");
        setContactSuccess(null);
      }, 2000);
    } catch (e) {
      alert("Failed to send contact request.");
    }
  };

  return (
    <div className="min-h-screen text-[var(--text-primary)] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        <div className="border-b border-gray-800 pb-6">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full text-xs text-indigo-300 mb-2 font-semibold">
            <Users className="w-4 h-4 text-indigo-400" />
            <span>Candidate Intelligence & Matching Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Search Candidate Profiles</h1>
          <p className="text-xs text-gray-400 mt-1">Filter candidates by skill, experience, and transparent Job-Profile Match score.</p>
        </div>

        {/* Filters Form */}
        <form onSubmit={handleFilterSubmit} className="glass-card p-6 rounded-2xl border border-gray-800 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Select Active Job:</label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="">General Candidate Search</option>
              {jobs.map(j => (
                <option key={j.id} value={j.id}>{j.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Role Keyword:</label>
            <input
              type="text"
              placeholder="e.g. AI/ML, Developer..."
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Skill Keyword:</label>
            <input
              type="text"
              placeholder="e.g. Python, SQL..."
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2.5 rounded-xl transition flex items-center justify-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>Apply Filters</span>
            </button>
          </div>
        </form>

        {/* Candidates Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {candidates.map((cand, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl border border-gray-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-white">{cand.full_name}</h3>
                    <p className="text-xs text-gray-400">{cand.headline}</p>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                    {cand.match_score}% Profile Match
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300 mt-3">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-500" />
                    <span>{cand.location}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <GraduationCap className="w-3.5 h-3.5 text-gray-500" />
                    <span>{cand.education}</span>
                  </span>
                  <span className="flex items-center space-x-1 text-indigo-400">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>{cand.experience_years} Years Exp.</span>
                  </span>
                </div>

                {/* Relevant Experience Note */}
                <p className="text-xs text-gray-300 bg-gray-900/60 p-3 rounded-xl border border-gray-800 mt-3">
                  💡 {cand.relevant_experience_note}
                </p>

                {/* Matched & Missing Skills Badges */}
                <div className="mt-3 space-y-1.5">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-semibold text-gray-400">Matched Skills:</span>
                    {cand.matched_skills?.map((s: string, sIdx: number) => (
                      <span key={sIdx} className="bg-emerald-500/10 text-emerald-300 text-[10px] px-2 py-0.5 rounded border border-emerald-500/20 font-medium">
                        ✓ {s}
                      </span>
                    ))}
                  </div>

                  {cand.missing_skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[10px] font-semibold text-gray-400">Missing Skills:</span>
                      {cand.missing_skills?.map((s: string, sIdx: number) => (
                        <span key={sIdx} className="bg-amber-500/10 text-amber-300 text-[10px] px-2 py-0.5 rounded border border-amber-500/20">
                          ⚠ {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-800">
                <button
                  onClick={() => {
                    setContactModalUser(cand);
                    setContactMessage(`Hi ${cand.full_name}, we reviewed your profile on CareerLens and would love to connect regarding an opportunity at our organization.`);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2.5 rounded-xl transition flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Contact Candidate</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Candidate Modal */}
        {contactModalUser && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="glass-card max-w-lg w-full p-6 rounded-2xl border border-gray-700 relative">
              <h3 className="text-lg font-bold text-white mb-2">Send Contact Request to {contactModalUser.full_name}</h3>
              <p className="text-xs text-gray-400 mb-4">The candidate will receive this message in their CareerLens dashboard notifications.</p>

              {contactSuccess ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-xs font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{contactSuccess}</span>
                </div>
              ) : (
                <form onSubmit={handleSendContact} className="space-y-4">
                  <textarea
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-indigo-500"
                  />

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setContactModalUser(null)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-xs font-semibold"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
