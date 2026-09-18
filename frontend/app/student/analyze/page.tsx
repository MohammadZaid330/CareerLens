'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api } from '@/lib/api';
import { getSession } from '@/lib/auth';
import { 
  UploadCloud, 
  FileText, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Briefcase,
  ChevronDown
} from 'lucide-react';

export default function AnalyzeResumePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState<string>("AI/ML Engineer");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [roles, setRoles] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    // Fetch available roles from backend
    api.get('/career/roles')
      .then(res => setRoles(res.data))
      .catch(() => {});
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      validateAndSetFile(selected);
    }
  };

  const validateAndSetFile = (f: File) => {
    setError(null);
    const ext = f.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx', 'doc'].includes(ext || '')) {
      setError('Invalid file format. Please upload a PDF or DOCX document.');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit.');
      return;
    }
    setFile(f);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select or drop a resume file to upload.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    if (targetRole) formData.append('target_role', targetRole);
    if (jobDescription) formData.append('job_description', jobDescription);

    try {
      // Ensure user session exists or log in demo student
      let session = getSession();
      if (!session) {
        const demoRes = await api.post('/auth/demo-login/student');
        localStorage.setItem('careerlens_token', demoRes.data.access_token);
        localStorage.setItem('careerlens_user', JSON.stringify(demoRes.data));
      }

      const res = await api.post('/student/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const analysisId = res.data.id;
      router.push(`/student/ats-report/${analysisId}`);
    } catch (err: any) {
      setIsAnalyzing(false);
      setError(err.response?.data?.detail || 'Failed to analyze resume. Please try again.');
    }
  };

  return (
    <div className="min-h-screen text-[var(--text-primary)] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-xs text-blue-300 mb-3">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Deterministic ATS Resume Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Upload Your Resume</h1>
          <p className="text-gray-400 text-sm mt-2">Get an explainable 100-point score, skill gap breakdown, and personalized roadmap.</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-xl text-sm flex items-center space-x-3 mb-6">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Target Role Selector */}
          <div className="glass-card p-6 rounded-2xl border border-gray-800">
            <label className="block text-sm font-bold text-white mb-1 flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-blue-400" />
              <span>What role are you targeting? (Optional)</span>
            </label>
            <p className="text-xs text-gray-400 mb-3">If you leave this as "I'm not sure yet", we will recommend suitable roles based on your resume evidence.</p>

            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition cursor-pointer"
            >
              <option value="I'm not sure yet">I’m not sure yet (Recommend roles for me)</option>
              {roles.map((r) => (
                <option key={r.id} value={r.title}>{r.title}</option>
              ))}
            </select>
          </div>

          {/* Drag & Drop File Upload Box */}
          <div className="glass-card p-8 rounded-2xl border border-gray-800">
            <label className="block text-sm font-bold text-white mb-2">Upload Resume File (PDF or DOCX)</label>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition cursor-pointer ${
                dragActive 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : file 
                  ? 'border-emerald-500/50 bg-emerald-500/5' 
                  : 'border-gray-700 hover:border-blue-500/60 bg-gray-900/40'
              }`}
            >
              <input
                type="file"
                id="file-upload"
                accept=".pdf,.docx,.doc"
                onChange={handleFileChange}
                className="hidden"
              />

              <label htmlFor="file-upload" className="cursor-pointer block">
                {file ? (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-white text-sm">{file.name}</span>
                    <span className="text-xs text-emerald-400">{(file.size / 1024).toFixed(1)} KB — Ready to analyze</span>
                    <span className="text-xs text-gray-400 underline mt-1">Click to replace file</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                      <UploadCloud className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Click to upload or drag & drop</p>
                      <p className="text-xs text-gray-400 mt-1">PDF or DOCX format (Max 10MB)</p>
                    </div>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Optional Job Description Box */}
          <div className="glass-card p-6 rounded-2xl border border-gray-800">
            <label className="block text-sm font-bold text-white mb-1">
              Target Job Description (Optional)
            </label>
            <p className="text-xs text-gray-400 mb-3">Paste a specific job posting text to compare keyword coverage directly.</p>

            <textarea
              rows={4}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job description keywords, requirements, or responsibilities here..."
              className="w-full bg-gray-900 border border-gray-700 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isAnalyzing || !file}
            className={`w-full py-4 rounded-xl font-bold text-base transition flex items-center justify-center space-x-2 shadow-xl ${
              isAnalyzing || !file 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/25'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Running Parsing & ATS Rules Engine...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Analyze Resume Now</span>
              </>
            )}
          </button>

        </form>

      </main>

      <Footer />
    </div>
  );
}
