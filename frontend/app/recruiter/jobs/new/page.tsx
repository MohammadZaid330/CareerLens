'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api } from '@/lib/api';
import { Briefcase, Plus, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function CreateJobPage() {
  const router = useRouter();
  const [title, setTitle] = useState("AI/ML Intern");
  const [location, setLocation] = useState("San Francisco, CA");
  const [workType, setWorkType] = useState("Hybrid");
  const [employmentType, setEmploymentType] = useState("Internship");
  const [experienceLevel, setExperienceLevel] = useState("Entry Level");
  const [salaryRange, setSalaryRange] = useState("$45 - $60 / hr");
  const [requiredSkillsStr, setRequiredSkillsStr] = useState("Python, Machine Learning, SQL");
  const [preferredSkillsStr, setPreferredSkillsStr] = useState("FastAPI, Docker, PyTorch");
  const [educationRequirement, setEducationRequirement] = useState("B.S. or M.S. in Computer Science / Data Science");
  const [description, setDescription] = useState("Join our engineering team to build scalable LLM pipelines and automated ML evaluation workflows.");
  const [deadline, setDeadline] = useState("2026-11-30");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const reqSkills = requiredSkillsStr.split(',').map(s => s.trim()).filter(Boolean);
    const prefSkills = preferredSkillsStr.split(',').map(s => s.trim()).filter(Boolean);

    try {
      await api.post('/recruiter/jobs', {
        title,
        location,
        work_type: workType,
        employment_type: employmentType,
        experience_level: experienceLevel,
        salary_range: salaryRange,
        required_skills: reqSkills,
        preferred_skills: prefSkills,
        education_requirement: educationRequirement,
        description,
        deadline
      });

      router.push('/recruiter/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to create job posting.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-[var(--text-primary)] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-10 w-full space-y-6">
        
        <div className="flex items-center space-x-3 border-b border-gray-800 pb-4">
          <button onClick={() => router.back()} className="p-2 text-gray-400 hover:text-white rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Create New Job Opening</h1>
            <p className="text-xs text-gray-400">Specify job requirements to match candidate profiles deterministically.</p>
          </div>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-xl text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-card p-8 rounded-2xl border border-gray-800 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Job Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Location *</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Work Type</label>
              <select
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-indigo-500"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Employment Type</label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-indigo-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Salary Range (Optional)</label>
              <input
                type="text"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Application Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Required Skills (Comma Separated) *</label>
            <input
              type="text"
              required
              value={requiredSkillsStr}
              onChange={(e) => setRequiredSkillsStr(e.target.value)}
              placeholder="Python, Machine Learning, SQL..."
              className="w-full bg-gray-900 border border-gray-700 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Preferred Skills (Comma Separated)</label>
            <input
              type="text"
              value={preferredSkillsStr}
              onChange={(e) => setPreferredSkillsStr(e.target.value)}
              placeholder="FastAPI, Docker, PyTorch..."
              className="w-full bg-gray-900 border border-gray-700 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Education Requirement</label>
            <input
              type="text"
              value={educationRequirement}
              onChange={(e) => setEducationRequirement(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Job Description *</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-xl font-bold text-sm transition"
          >
            {loading ? 'Creating Job Posting...' : 'Publish Job Opening'}
          </button>

        </form>

      </main>

      <Footer />
    </div>
  );
}
