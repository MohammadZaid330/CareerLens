'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api } from '@/lib/api';
import { UserCheck, Shield, CheckCircle2, Save } from 'lucide-react';

export default function StudentProfilePage() {
  const [headline, setHeadline] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [education, setEducation] = useState("");
  const [experienceYears, setExperienceYears] = useState(1.5);
  const [allowRecruiterDiscovery, setAllowRecruiterDiscovery] = useState(true);
  
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/student/profile')
      .then(res => {
        const p = res.data;
        setHeadline(p.headline || "");
        setPhone(p.phone || "");
        setLocation(p.location || "");
        setEducation(p.education || "");
        setExperienceYears(p.experience_years || 0);
        setAllowRecruiterDiscovery(p.allow_recruiter_discovery ?? true);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      await api.put('/student/profile', {
        headline,
        phone,
        location,
        education,
        experience_years: experienceYears,
        allow_recruiter_discovery: allowRecruiterDiscovery
      });
      setMessage("Profile updated successfully!");
    } catch (e) {
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="min-h-screen text-[var(--text-primary)] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-10 w-full space-y-6">
        
        <div className="border-b border-gray-800 pb-6">
          <h1 className="text-3xl font-extrabold text-white">Student Profile & Privacy</h1>
          <p className="text-xs text-gray-400 mt-1">Manage your headline, contact details, and recruiter discovery settings.</p>
        </div>

        {message && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-card p-8 rounded-2xl border border-gray-800 space-y-6">
          
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Professional Headline</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Education Background</label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Years of Experience</label>
              <input
                type="number"
                step="0.5"
                value={experienceYears}
                onChange={(e) => setExperienceYears(parseFloat(e.target.value))}
                className="w-full bg-gray-900 border border-gray-700 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Privacy Toggle Box */}
          <div className="bg-gray-900/60 p-4 rounded-xl border border-gray-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-white text-xs block">Allow Recruiter Candidate Discovery</span>
              <span className="text-[11px] text-gray-400">When enabled, verified employers can discover your profile in candidate searches.</span>
            </div>

            <input
              type="checkbox"
              checked={allowRecruiterDiscovery}
              onChange={(e) => setAllowRecruiterDiscovery(e.target.checked)}
              className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold text-xs transition flex items-center justify-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Update Profile Settings</span>
          </button>

        </form>

      </main>

      <Footer />
    </div>
  );
}
