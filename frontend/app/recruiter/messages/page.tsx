'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api } from '@/lib/api';
import { MessageSquare, Clock, CheckCircle2, User } from 'lucide-react';

export default function RecruiterMessagesPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/recruiter/contact-requests')
      .then(res => {
        setContacts(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen text-[var(--text-primary)] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        <div className="border-b border-gray-800 pb-6">
          <h1 className="text-3xl font-extrabold text-white">Contact Requests & Pipeline</h1>
          <p className="text-xs text-gray-400 mt-1">Track outreach messages sent to candidates and response statuses.</p>
        </div>

        <div className="space-y-4">
          {contacts.map((c, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl border border-gray-800 space-y-3">
              <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-blue-400" />
                  <span className="font-bold text-white text-sm">Recipient ID #{c.student_id}</span>
                  <span className="text-xs text-gray-400">— {c.job_title || 'General Opportunity Inquiry'}</span>
                </div>
                <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2.5 py-0.5 rounded border border-amber-500/30 uppercase">
                  {c.status}
                </span>
              </div>

              <p className="text-xs text-gray-300 bg-gray-900/60 p-3 rounded-xl border border-gray-800">
                "{c.message}"
              </p>

              <div className="text-[11px] text-gray-500">
                Sent on {new Date(c.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}
