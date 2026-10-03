'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  User, 
  ChevronDown, 
  Minimize2, 
  Maximize2, 
  Lightbulb, 
  Building2, 
  Compass, 
  FileText, 
  RefreshCw 
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  "⚡ How to get a 90+ ATS score?",
  "🏙️ Top tech skills in Bengaluru & Mumbai?",
  "📝 What are strong action verbs for resumes?",
  "🎯 How does CareerLens fit matching work?",
  "💼 Which companies are hiring for Python?"
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: "👋 Hi there! I'm **CareerLens AI Assistant**. Ask me anything about your resume ATS score, missing skills, career roadmaps, or tech jobs by city!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const generateBotResponse = (userQuery: string): string => {
    const query = userQuery.toLowerCase();

    if (query.includes('ats') || query.includes('score') || query.includes('improve')) {
      return "🎯 **To maximize your ATS score on CareerLens:**\n\n1. **Structure (20 pts):** Include your full Name, Email, Phone, LinkedIn, and GitHub at the top.\n2. **Keywords (30 pts):** Explicitly list required technical skills (e.g. Python, React, PostgreSQL, Docker).\n3. **Experience (20 pts):** Start bullet points with strong action verbs (*Engineered, Optimized, Built*) and add metrics (*Improved latency by 35%*).\n4. **Education (15 pts):** Use clear headings like `Education` or `Academic Qualifications`.\n5. **Conciseness (15 pts):** Keep word count between 300 to 900 words.";
    }

    if (query.includes('bengaluru') || query.includes('mumbai') || query.includes('city') || query.includes('skill') || query.includes('demand')) {
      return "🏙️ **Job Market & City Demand Insights:**\n\n• **Bengaluru (Silicon Valley):** High demand for *Python, FastAPI, System Design, Docker, PyTorch, React*.\n• **Mumbai:** High demand for *FinTech Full Stack, Java Spring Boot, SQL, Cloud Architecture, Data Engineering*.\n• **Delhi NCR:** High demand for *Data Science, AI/ML, Cloud DevOps, Full Stack Web*.\n• **Remote:** High demand for *Next.js, TypeScript, Python Microservices, Rust, AWS*.\n\nCheck out our new **Job Market & City Finder** tab in the sidebar for full details!";
    }

    if (query.includes('action verb') || query.includes('verb') || query.includes('resume')) {
      return "📝 **Top High-Impact Action Verbs for Engineers:**\n\n• **Engineering:** *Engineered, Architected, Refactored, Scaled, Automated, Deployed*\n• **Performance:** *Optimized, Reduced, Accelerated, Streamlined, Enhanced*\n• **Leadership:** *Orchestrated, Spearheaded, Mentored, Transformed, Led*\n\nAvoid weak phrases like *'worked on'*, *'responsible for'*, or *'hardworking team player'*!";
    }

    if (query.includes('company') || query.includes('hiring') || query.includes('job')) {
      return "🏢 **Featured Hiring Partners on CareerLens:**\n\n1. **Nexus AI Labs** (Bengaluru) — Hiring AI/ML Engineers & Python Backend Developers\n2. **CloudScale Systems** (Mumbai) — Hiring Full Stack (React/Node) & DevOps Engineers\n3. **Quantum Analytics** (Delhi NCR) — Hiring Data Scientists & Data Engineers\n4. **FinTech Global** (Pune) — Hiring Java Microservices & Security Engineers\n\nVisit the **Companies** page in the left sidebar to explore direct job listings!";
    }

    if (query.includes('fit') || query.includes('match') || query.includes('recommend')) {
      return "🧭 **How CareerLens Qualitative Fit Matching Works:**\n\nUnlike generic AI tools that guess random percentages, CareerLens parses actual evidence in your resume:\n• **Strong Fit:** Matches >= 75% required skills + relevant projects.\n• **Good Fit:** Matches >= 50% required skills.\n• **Potential Fit:** Matches foundational skills with identified gaps.\n\nCheck **Career Guidance** in the sidebar to see your custom recommendations!";
    }

    return `💡 **CareerLens AI Answer:**\n\nThank you for asking about "${userQuery}".\n\nTo achieve the best career outcomes, ensure your resume includes updated technical skills, verified project links, and quantitative achievements. You can also explore our **Resume Analyzer**, **Learning Roadmap**, and **Job Market Finder** directly from the left sidebar!`;
  };

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponseText = generateBotResponse(query);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Bot Button */}
      {!isOpen && (
        <button
          onClick={() => { setIsOpen(true); setIsMinimized(false); }}
          className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white px-4 py-3.5 rounded-full shadow-2xl shadow-indigo-500/50 hover:scale-105 transition-all duration-300 group border border-white/20"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full"></span>
          </div>
          <span className="font-extrabold text-sm tracking-wide hidden sm:inline">AI Career Assistant</span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div 
          className={`fixed bottom-6 right-6 z-50 w-full sm:w-96 glass-card border border-indigo-500/30 shadow-2xl transition-all duration-300 overflow-hidden flex flex-col rounded-3xl ${
            isMinimized ? 'h-16' : 'h-[530px]'
          }`}
          style={{ background: 'var(--card-bg)', backdropFilter: 'blur(28px)' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 p-3.5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-sm text-white">CareerLens AI</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <span className="text-[10px] text-indigo-300 font-mono">Live Resume & Career Guide</span>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-400 hover:text-rose-400 rounded-lg hover:bg-white/10 transition"
                title="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Message History */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none shadow-md font-medium'
                          : 'bg-slate-900/80 border border-indigo-500/25 text-[var(--text-primary)] rounded-tl-none leading-relaxed'
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.text}</div>
                    </div>
                    <span className="text-[9px] text-gray-400 mt-1 px-1">{msg.timestamp}</span>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center space-x-2 text-indigo-400 text-xs bg-indigo-500/10 border border-indigo-500/20 px-3 py-2 rounded-2xl w-fit">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>AI Assistant is analyzing...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Chips */}
              <div className="px-3 py-2 border-t border-white/10 bg-slate-950/40 overflow-x-auto flex space-x-1.5 scrollbar-none">
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    className="shrink-0 text-[10px] font-semibold bg-white/5 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-full transition-all whitespace-nowrap"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input Footer */}
              <div className="p-3 border-t border-white/10 bg-slate-950/80 flex items-center space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask AI about ATS, skills, jobs in city..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:opacity-40 text-white rounded-xl transition shadow-md"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
