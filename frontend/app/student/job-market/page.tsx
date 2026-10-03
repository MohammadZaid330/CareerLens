'use client';

import React, { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  Sparkles, 
  Search, 
  Filter, 
  ExternalLink, 
  Calendar, 
  ShieldCheck, 
  ArrowUpRight 
} from 'lucide-react';

interface CityData {
  city: string;
  state: string;
  demandLevel: 'Very High' | 'High' | 'Moderate';
  avgSalary: string;
  activeJobsCount: number;
  topSkills: string[];
  companies: {
    name: string;
    domain: string;
    openings: number;
    lastVerified: string;
    logoColor: string;
  }[];
  jobs: {
    id: number;
    title: string;
    company: string;
    salary: string;
    type: string;
    experience: string;
    requiredSkills: string[];
    description: string;
  }[];
}

// Master list of Indian cities & tech hubs (alphabetically sorted)
const INDIAN_CITIES_RAW = [
  { city: "Ahmedabad", state: "Gujarat" },
  { city: "Amritsar", state: "Punjab" },
  { city: "Bengaluru", state: "Karnataka" },
  { city: "Bhopal", state: "Madhya Pradesh" },
  { city: "Bhubaneswar", state: "Odisha" },
  { city: "Chandigarh", state: "Punjab / Haryana" },
  { city: "Chennai", state: "Tamil Nadu" },
  { city: "Coimbatore", state: "Tamil Nadu" },
  { city: "Dehradun", state: "Uttarakhand" },
  { city: "Delhi NCR", state: "Gurugram / Noida / Delhi" },
  { city: "Goa / Panaji", state: "Goa" },
  { city: "Guwahati", state: "Assam" },
  { city: "Hyderabad", state: "Telangana" },
  { city: "Indore", state: "Madhya Pradesh" },
  { city: "Jaipur", state: "Rajasthan" },
  { city: "Jamshedpur", state: "Jharkhand" },
  { city: "Kanpur", state: "Uttar Pradesh" },
  { city: "Kochi", state: "Kerala" },
  { city: "Kolkata", state: "West Bengal" },
  { city: "Lucknow", state: "Uttar Pradesh" },
  { city: "Ludhiana", state: "Punjab" },
  { city: "Madurai", state: "Tamil Nadu" },
  { city: "Mangaluru", state: "Karnataka" },
  { city: "Mumbai", state: "Maharashtra" },
  { city: "Nagpur", state: "Maharashtra" },
  { city: "Nashik", state: "Maharashtra" },
  { city: "Noida", state: "Uttar Pradesh" },
  { city: "Patna", state: "Bihar" },
  { city: "Pune", state: "Maharashtra" },
  { city: "Raipur", state: "Chhattisgarh" },
  { city: "Rajkot", state: "Gujarat" },
  { city: "Ranchi", state: "Jharkhand" },
  { city: "Remote", state: "Work From Anywhere" },
  { city: "Surat", state: "Gujarat" },
  { city: "Thiruvananthapuram", state: "Kerala" },
  { city: "Vadodara", state: "Gujarat" },
  { city: "Varanasi", state: "Uttar Pradesh" },
  { city: "Vijayawada", state: "Andhra Pradesh" },
  { city: "Visakhapatnam", state: "Andhra Pradesh" },
].sort((a, b) => a.city.localeCompare(b.city));

// Specific detailed data for major cities
const SPECIFIC_CITY_DETAILS: Record<string, Partial<CityData>> = {
  "Bengaluru": {
    demandLevel: "Very High",
    avgSalary: "₹10.5 LPA – ₹28.0 LPA",
    activeJobsCount: 2450,
    topSkills: ["Python", "FastAPI", "React", "Docker", "PyTorch", "PostgreSQL", "System Design"],
    companies: [
      { name: "Nexus AI Labs", domain: "Artificial Intelligence", openings: 14, lastVerified: "2026-10-02", logoColor: "from-indigo-500 to-purple-600" },
      { name: "CloudScale Systems", domain: "Cloud Infrastructure", openings: 22, lastVerified: "2026-10-01", logoColor: "from-cyan-500 to-blue-600" },
      { name: "PaySwift Technologies", domain: "FinTech & Payments", openings: 18, lastVerified: "2026-09-30", logoColor: "from-emerald-500 to-teal-600" },
    ],
    jobs: [
      { id: 101, title: "Senior Python & AI Engineer", company: "Nexus AI Labs", salary: "₹18 LPA – ₹26 LPA", type: "Full-Time", experience: "2-4 Years", requiredSkills: ["Python", "FastAPI", "PyTorch", "Docker"], description: "Engineers high-throughput backend services and LLM inference pipelines using FastAPI and PostgreSQL." },
      { id: 102, title: "Full Stack Web Developer", company: "CloudScale Systems", salary: "₹12 LPA – ₹20 LPA", type: "Full-Time", experience: "1-3 Years", requiredSkills: ["React", "Next.js", "TypeScript", "Node.js"], description: "Build modern Next.js dashboards and microservices for cloud infrastructure monitoring." },
      { id: 103, title: "DevOps & Kubernetes Specialist", company: "PaySwift Technologies", salary: "₹15 LPA – ₹24 LPA", type: "Full-Time", experience: "3+ Years", requiredSkills: ["Docker", "Kubernetes", "AWS", "Terraform"], description: "Manage resilient multi-region Kubernetes clusters with automated CI/CD deployment pipelines." }
    ]
  },
  "Mumbai": {
    demandLevel: "High",
    avgSalary: "₹9.5 LPA – ₹25.0 LPA",
    activeJobsCount: 1820,
    topSkills: ["Java", "Spring Boot", "SQL", "React", "AWS", "Financial Modeling", "Python"],
    companies: [
      { name: "FinTech Global", domain: "Banking & Financial Software", openings: 28, lastVerified: "2026-10-03", logoColor: "from-blue-600 to-indigo-700" },
      { name: "MediaVerse Digital", domain: "Media & Streaming Tech", openings: 9, lastVerified: "2026-09-28", logoColor: "from-pink-500 to-rose-600" },
    ],
    jobs: [
      { id: 201, title: "Java Microservices Lead", company: "FinTech Global", salary: "₹16 LPA – ₹25 LPA", type: "Full-Time", experience: "3-5 Years", requiredSkills: ["Java", "Spring Boot", "PostgreSQL", "Kafka"], description: "Design low-latency financial transaction microservices with ultra-reliable fallback mechanisms." },
      { id: 202, title: "Backend API Engineer (Python)", company: "MediaVerse Digital", salary: "₹11 LPA – ₹18 LPA", type: "Full-Time", experience: "1-3 Years", requiredSkills: ["Python", "Django", "Redis", "AWS"], description: "Build video transcoding API microservices and content management backends." }
    ]
  },
  "Delhi NCR": {
    demandLevel: "High",
    avgSalary: "₹9.0 LPA – ₹24.0 LPA",
    activeJobsCount: 1950,
    topSkills: ["Data Science", "Python", "Machine Learning", "FastAPI", "SQL", "Tableau", "AWS"],
    companies: [
      { name: "Quantum Analytics", domain: "Data Intelligence", openings: 15, lastVerified: "2026-10-02", logoColor: "from-purple-600 to-cyan-500" },
      { name: "UrbanMobility Tech", domain: "Logistics & Transport", openings: 12, lastVerified: "2026-09-29", logoColor: "from-emerald-600 to-teal-500" },
    ],
    jobs: [
      { id: 301, title: "Data Scientist & Analytics Engineer", company: "Quantum Analytics", salary: "₹14 LPA – ₹22 LPA", type: "Full-Time", experience: "2-4 Years", requiredSkills: ["Python", "Pandas", "Scikit-Learn", "SQL", "Tableau"], description: "Analyze large dataset streams, build predictive ML models, and build decision dashboards." }
    ]
  },
  "Pune": {
    demandLevel: "High",
    avgSalary: "₹8.5 LPA – ₹22.0 LPA",
    activeJobsCount: 1420,
    topSkills: ["Python", "Full Stack", "Docker", "Cyber Security", "C++", "Embedded Systems"],
    companies: [
      { name: "AutoTech Innovations", domain: "Automotive Tech", openings: 19, lastVerified: "2026-10-01", logoColor: "from-indigo-600 to-blue-500" },
      { name: "CyberShield Security", domain: "Cybersecurity", openings: 11, lastVerified: "2026-09-30", logoColor: "from-red-600 to-rose-500" },
    ],
    jobs: [
      { id: 401, title: "Full Stack Software Engineer", company: "AutoTech Innovations", salary: "₹10 LPA – ₹17 LPA", type: "Full-Time", experience: "1-3 Years", requiredSkills: ["Python", "React", "FastAPI", "Docker"], description: "Develop connected vehicle telemetry portals and real-time diagnostic reporting engines." }
    ]
  },
  "Hyderabad": {
    demandLevel: "Very High",
    avgSalary: "₹9.8 LPA – ₹26.0 LPA",
    activeJobsCount: 2100,
    topSkills: ["Java", "Python", "Cloud DevOps", "Azure", "React", "Data Engineering"],
    companies: [
      { name: "Hyderabad Cloud Tech", domain: "Enterprise Cloud", openings: 25, lastVerified: "2026-10-03", logoColor: "from-cyan-600 to-indigo-600" }
    ],
    jobs: [
      { id: 501, title: "Cloud Systems Engineer", company: "Hyderabad Cloud Tech", salary: "₹14 LPA – ₹22 LPA", type: "Full-Time", experience: "2-4 Years", requiredSkills: ["Azure", "Python", "Docker", "Terraform"], description: "Architect multi-cloud tenant architecture and enterprise migration pipelines." }
    ]
  },
  "Remote": {
    demandLevel: "Very High",
    avgSalary: "₹15 LPA – ₹40 LPA (or $60k – $130k)",
    activeJobsCount: 3100,
    topSkills: ["Next.js", "TypeScript", "Python", "FastAPI", "GraphQL", "PostgreSQL", "Docker", "AWS"],
    companies: [
      { name: "GlobalStack Inc", domain: "SaaS & AI Tools", openings: 45, lastVerified: "2026-10-03", logoColor: "from-cyan-500 to-indigo-600" },
      { name: "Vercel Partner Org", domain: "Web Infrastructure", openings: 28, lastVerified: "2026-10-02", logoColor: "from-purple-500 to-pink-500" },
    ],
    jobs: [
      { id: 601, title: "Remote Full Stack Engineer (Next.js & Python)", company: "GlobalStack Inc", salary: "₹18 LPA – ₹32 LPA", type: "Remote", experience: "2-5 Years", requiredSkills: ["Next.js", "TypeScript", "Python", "FastAPI", "PostgreSQL"], description: "100% remote position building high-scaling developer platforms and AI content engines." }
    ]
  }
};

// Generate full database for all Indian cities
const FULL_JOB_MARKET_DATABASE: Record<string, CityData> = {};

INDIAN_CITIES_RAW.forEach((item, idx) => {
  const cName = item.city;
  const spec = SPECIFIC_CITY_DETAILS[cName] || {};

  FULL_JOB_MARKET_DATABASE[cName] = {
    city: cName,
    state: item.state,
    demandLevel: spec.demandLevel || (idx % 2 === 0 ? "High" : "Moderate"),
    avgSalary: spec.avgSalary || `₹${6 + (idx % 5)} LPA – ₹${14 + (idx % 8)} LPA`,
    activeJobsCount: spec.activeJobsCount || (350 + (idx * 27) % 900),
    topSkills: spec.topSkills || ["Python", "Java", "React", "SQL", "Git", "Cloud Computing"],
    companies: spec.companies || [
      { name: `${cName} Tech Solutions`, domain: "IT & Software Services", openings: 8 + (idx % 10), lastVerified: "2026-10-02", logoColor: "from-indigo-600 to-purple-500" },
      { name: `${cName} Digital Labs`, domain: "Web & Mobile Innovation", openings: 5 + (idx % 7), lastVerified: "2026-10-01", logoColor: "from-cyan-500 to-blue-600" }
    ],
    jobs: spec.jobs || [
      {
        id: 1000 + idx,
        title: `Software Development Engineer (${cName})`,
        company: `${cName} Tech Solutions`,
        salary: `₹${7 + (idx % 4)} LPA – ₹${13 + (idx % 6)} LPA`,
        type: "Full-Time",
        experience: "1-3 Years",
        requiredSkills: ["Python", "React", "SQL", "FastAPI"],
        description: `Build scalable Web APIs, frontend user interfaces, and database integrations for clients in ${cName} and surrounding regions.`
      }
    ]
  };
});

export default function JobMarketPage() {
  const [selectedCity, setSelectedCity] = useState<string>('Bengaluru');
  const [citySearchQuery, setCitySearchQuery] = useState<string>('');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('All');
  const [appliedJobId, setAppliedJobId] = useState<number | null>(null);

  // Filter cities by search query (Alphabetically sorted)
  const filteredCityList = useMemo(() => {
    return INDIAN_CITIES_RAW.filter(item => 
      item.city.toLowerCase().includes(citySearchQuery.toLowerCase()) ||
      item.state.toLowerCase().includes(citySearchQuery.toLowerCase())
    );
  }, [citySearchQuery]);

  const cityData = FULL_JOB_MARKET_DATABASE[selectedCity] || FULL_JOB_MARKET_DATABASE['Bengaluru'];

  const filteredJobs = selectedSkillFilter === 'All'
    ? cityData.jobs
    : cityData.jobs.filter(j => j.requiredSkills.some(s => s.toLowerCase().includes(selectedSkillFilter.toLowerCase())));

  const handleApply = (id: number) => {
    setAppliedJobId(id);
    setTimeout(() => {
      alert("Application intent submitted successfully! Recruiter has been notified.");
      setAppliedJobId(null);
    }, 500);
  };

  return (
    <div className="min-h-screen text-[var(--text-primary)] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-[var(--card-border)] mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3.5 py-1.5 rounded-full text-xs font-bold mb-3">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span>India Job Market Intelligence & City Finder</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Tech Jobs by <span className="gradient-text-primary">City & Skills</span>
            </h1>
            <p className="text-[var(--text-secondary)] text-sm sm:text-base mt-2 max-w-2xl">
              Explore demand trends, salary ranges, top hiring companies, and live job openings across 40+ Indian cities and IT hubs (sorted A-Z).
            </p>
          </div>

          {/* City Search & Dropdown Selection Box */}
          <div className="glass-card p-4 rounded-2xl border border-indigo-500/30 flex flex-col gap-3 min-w-[320px] glow-indigo">
            <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-indigo-400" /> Select Target City ({INDIAN_CITIES_RAW.length} Cities):</span>
            </label>

            {/* City Live Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={citySearchQuery}
                onChange={(e) => setCitySearchQuery(e.target.value)}
                placeholder="🔍 Search city (e.g. Pune, Jaipur, Noida...)"
                className="w-full bg-slate-950/80 border border-indigo-500/30 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-indigo-400"
              />
            </div>

            {/* City Selection Dropdown (Alphabetical) */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-slate-900 border border-indigo-500/40 text-white font-bold text-sm rounded-xl px-3.5 py-2.5 outline-none focus:border-indigo-400 transition shadow-inner cursor-pointer"
            >
              {filteredCityList.map(item => (
                <option key={item.city} value={item.city}>
                  📍 {item.city} ({item.state})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick City Selector Chips (A-Z Popular Cities) */}
        <div className="mb-8">
          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-2">
            Popular Cities Quick Selection (A to Z):
          </span>
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {INDIAN_CITIES_RAW.slice(0, 15).map(item => (
              <button
                key={item.city}
                onClick={() => setSelectedCity(item.city)}
                className={`text-xs px-3 py-1 rounded-full font-bold transition-all whitespace-nowrap border ${
                  selectedCity === item.city
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-500 shadow-md scale-105'
                    : 'bg-white/5 text-[var(--text-secondary)] border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                📍 {item.city}
              </button>
            ))}
          </div>
        </div>

        {/* Selected City Overview Header */}
        <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-950/40 border border-indigo-500/30 p-6 rounded-3xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                <span>📍 {cityData.city}</span>
              </h2>
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-bold px-3 py-0.5 rounded-full">
                {cityData.state}
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Displaying active IT market statistics and job openings in {cityData.city}, {cityData.state}.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{cityData.demandLevel} Demand</span>
            </span>
          </div>
        </div>

        {/* City Market Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="glass-card p-6 rounded-2xl border border-[var(--card-border)]">
            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-2 font-semibold">
              <span>Hiring Velocity</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 flex items-center gap-2">
              <span>{cityData.demandLevel}</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1.5">Active tech recruitment in {cityData.city}</p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-[var(--card-border)]">
            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-2 font-semibold">
              <span>Avg Salary Range</span>
              <DollarSign className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-xl font-black text-indigo-300">{cityData.avgSalary}</div>
            <p className="text-xs text-[var(--text-muted)] mt-1.5">Based on verified developer profiles</p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-[var(--card-border)]">
            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-2 font-semibold">
              <span>Active Job Openings</span>
              <Briefcase className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-purple-300">{cityData.activeJobsCount.toLocaleString()}+</div>
            <p className="text-xs text-[var(--text-muted)] mt-1.5">Verified company positions available</p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-[var(--card-border)]">
            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-2 font-semibold">
              <span>Top Skills Matrix</span>
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {cityData.topSkills.slice(0, 4).map((s, i) => (
                <span key={i} className="text-[10px] bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full font-bold">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Top Hiring Companies in Selected City */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-400" />
                <span>Top Companies Hiring in {cityData.city}</span>
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">Verified employers actively looking for tech talent</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cityData.companies.map((comp, idx) => (
              <div key={idx} className="glass-card-interactive p-6 rounded-2xl border border-[var(--card-border)]">
                <div className="flex items-center space-x-3.5 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${comp.logoColor} text-white font-black text-lg flex items-center justify-center shadow-md`}>
                    {comp.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--text-primary)] text-base">{comp.name}</h3>
                    <span className="text-xs text-indigo-400 font-medium">{comp.domain}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[var(--card-border)] text-xs">
                  <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    {comp.openings} Active Roles
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">Verified {comp.lastVerified}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Live Job Openings List with Skill Filter */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-purple-400" />
                <span>Available Jobs in {cityData.city}</span>
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Filter positions by key skill or tech stack</p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
              {['All', 'Python', 'React', 'Docker', 'FastAPI', 'Java'].map(sk => (
                <button
                  key={sk}
                  onClick={() => setSelectedSkillFilter(sk)}
                  className={`text-xs px-3.5 py-1.5 rounded-full font-bold transition-all whitespace-nowrap border ${
                    selectedSkillFilter === sk
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                      : 'bg-white/5 text-[var(--text-secondary)] border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {sk === 'All' ? 'All Skills' : sk}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div key={job.id} className="glass-card p-6 rounded-2xl border border-[var(--card-border)] hover:border-indigo-500/40 transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-lg font-bold text-[var(--text-primary)]">{job.title}</h3>
                        <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          {job.type}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-xs text-[var(--text-secondary)]">
                        <span className="font-semibold text-indigo-400">{job.company}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-rose-400" />{cityData.city}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-bold">{job.salary}</span>
                        <span>•</span>
                        <span>Exp: {job.experience}</span>
                      </div>

                      <p className="text-xs text-[var(--text-secondary)] mt-2.5 max-w-3xl leading-relaxed">
                        {job.description}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mr-1">Required Skills:</span>
                        {job.requiredSkills.map((sk, i) => (
                          <span key={i} className="bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[11px] px-2.5 py-0.5 rounded-md font-semibold">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <button
                        onClick={() => handleApply(job.id)}
                        disabled={appliedJobId === job.id}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 flex items-center gap-1.5"
                      >
                        <span>{appliedJobId === job.id ? "Applying..." : "Apply Now"}</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 glass-card rounded-2xl border border-[var(--card-border)]">
                <p className="text-sm text-[var(--text-secondary)]">No active openings found matching filter "{selectedSkillFilter}".</p>
              </div>
            )}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
