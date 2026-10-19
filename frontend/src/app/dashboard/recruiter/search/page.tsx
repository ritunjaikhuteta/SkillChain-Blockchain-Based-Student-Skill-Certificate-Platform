"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest, CandidateRankDto } from "@/lib/api";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  Award,
  CheckCircle2,
  FolderGit2,
  X,
  ExternalLink,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

interface CandidateDisplay {
  id: string;
  name: string;
  course: string;
  gradYear: number;
  skills: string[];
  matchScore: number;
  avatarBg: string;
}

const SAMPLE_CANDIDATES: CandidateDisplay[] = [
  {
    id: "1",
    name: "Asha Sharma",
    course: "Computer Science Engineering",
    gradYear: 2025,
    skills: ["Python", "SQL", "Java", "React"],
    matchScore: 92,
    avatarBg: "from-amber-400 to-rose-400",
  },
  {
    id: "2",
    name: "Rohan Mehta",
    course: "Information Technology",
    gradYear: 2025,
    skills: ["Python", "SQL", "Data Analysis"],
    matchScore: 78,
    avatarBg: "from-blue-400 to-indigo-500",
  },
  {
    id: "3",
    name: "Sneha Patel",
    course: "Computer Science Engineering",
    gradYear: 2024,
    skills: ["Python", "Machine Learning", "Pandas"],
    matchScore: 72,
    avatarBg: "from-emerald-400 to-teal-500",
  },
  {
    id: "4",
    name: "Vikram Malhotra",
    course: "Software Engineering",
    gradYear: 2025,
    skills: ["React", "TypeScript", "Node.js", "GraphQL"],
    matchScore: 68,
    avatarBg: "from-purple-400 to-violet-500",
  },
  {
    id: "5",
    name: "Pooja Verma",
    course: "Data Science & AI",
    gradYear: 2026,
    skills: ["Python", "PyTorch", "NumPy", "SQL"],
    matchScore: 64,
    avatarBg: "from-pink-400 to-rose-500",
  },
];

export default function CandidateSearchPage() {
  const [query, setQuery] = useState("Python, SQL");
  const [candidates, setCandidates] = useState<CandidateDisplay[]>(SAMPLE_CANDIDATES);
  const [loading, setLoading] = useState(false);

  // Filter states matching Screen 6 dropdowns
  const [collegeFilter, setCollegeFilter] = useState("All Colleges");
  const [courseFilter, setCourseFilter] = useState("All Courses");
  const [gradYearFilter, setGradYearFilter] = useState("All Years");
  const [skillsFilter, setSkillsFilter] = useState("Python, SQL");
  const [certFilter, setCertFilter] = useState("Required");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Compared candidates tracker
  const [comparedList, setComparedList] = useState<string[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cleanSkills = query
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const endpoint = cleanSkills.length > 0
        ? `/recruiter/candidates/ranked?skills=${encodeURIComponent(cleanSkills.join(","))}&limit=25`
        : "/recruiter/candidates/ranked?skills=Python&limit=25";

      const data = await apiRequest<CandidateRankDto[]>(endpoint);
      if (data && data.length > 0) {
        const mapped: CandidateDisplay[] = data.map((c, i) => ({
          id: String(c.studentId),
          name: c.studentName || "Student",
          course: "Computer Science Engineering",
          gradYear: 2025,
          skills: c.matchingSkills && c.matchingSkills.length > 0 ? c.matchingSkills : ["Python", "SQL"],
          matchScore: Math.round((c.compositeScore ?? 0.85) * 100),
          avatarBg: i % 2 === 0 ? "from-blue-400 to-indigo-500" : "from-emerald-400 to-teal-500",
        }));
        setCandidates(mapped);
      } else {
        // Fallback filter on sample
        filterSample();
      }
    } catch {
      filterSample();
    } finally {
      setLoading(false);
    }
  };

  const filterSample = () => {
    const qLower = query.toLowerCase();
    const filtered = SAMPLE_CANDIDATES.filter((c) => {
      const matchesSkill = c.skills.some((s) => qLower.includes(s.toLowerCase()));
      const matchesYear = gradYearFilter === "All Years" || c.gradYear.toString() === gradYearFilter;
      const matchesCourse = courseFilter === "All Courses" || c.course === courseFilter;
      return matchesSkill && matchesYear && matchesCourse;
    });
    setCandidates(filtered.length > 0 ? filtered : SAMPLE_CANDIDATES);
  };

  const handleClearAll = () => {
    setQuery("");
    setCollegeFilter("All Colleges");
    setCourseFilter("All Courses");
    setGradYearFilter("All Years");
    setSkillsFilter("All Skills");
    setCertFilter("All");
    setCandidates(SAMPLE_CANDIDATES);
  };

  const toggleCompare = (name: string) => {
    if (comparedList.includes(name)) {
      setComparedList(comparedList.filter((n) => n !== name));
    } else {
      if (comparedList.length >= 3) {
        alert("You can compare up to 3 candidates simultaneously.");
        return;
      }
      setComparedList([...comparedList, name]);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto w-full space-y-7">
      {/* Header matching Screen 6 */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Search Students
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Find the best candidates based on skills, filters and preferences.
        </p>
      </div>

      {/* Main Search Input & Advanced Filters Button */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by skill, project, certificate or keyword..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-blue-600 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/25 hover:bg-blue-700 active:scale-95 transition-all shrink-0"
        >
          {loading ? "Searching..." : "Search"}
        </button>

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs sm:text-sm font-medium hover:bg-slate-50 flex items-center justify-center space-x-2 shrink-0 shadow-xs transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4 text-slate-500" />
          <span>Advanced Filters</span>
        </button>
      </form>

      {/* Dropdown Filters Row (Exact Match to Screen 6) */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        {/* College */}
        <div className="flex flex-col space-y-1">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">College</span>
          <div className="relative">
            <select
              value={collegeFilter}
              onChange={(e) => setCollegeFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-slate-800 text-xs font-medium rounded-xl pl-3.5 pr-8 py-2 shadow-xs focus:outline-none focus:border-blue-500"
            >
              <option>All Colleges</option>
              <option>Stanford University</option>
              <option>MIT</option>
              <option>IIT Delhi</option>
              <option>UC Berkeley</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Course */}
        <div className="flex flex-col space-y-1">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Course</span>
          <div className="relative">
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-slate-800 text-xs font-medium rounded-xl pl-3.5 pr-8 py-2 shadow-xs focus:outline-none focus:border-blue-500"
            >
              <option>All Courses</option>
              <option>Computer Science Engineering</option>
              <option>Information Technology</option>
              <option>Data Science & AI</option>
              <option>Software Engineering</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Graduation Year */}
        <div className="flex flex-col space-y-1">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Graduation Year</span>
          <div className="relative">
            <select
              value={gradYearFilter}
              onChange={(e) => setGradYearFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-slate-800 text-xs font-medium rounded-xl pl-3.5 pr-8 py-2 shadow-xs focus:outline-none focus:border-blue-500"
            >
              <option>All Years</option>
              <option>2026</option>
              <option>2025</option>
              <option>2024</option>
              <option>2023</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-col space-y-1">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Skills</span>
          <div className="relative">
            <select
              value={skillsFilter}
              onChange={(e) => {
                setSkillsFilter(e.target.value);
                setQuery(e.target.value);
              }}
              className="appearance-none bg-white border border-slate-200 text-slate-800 text-xs font-medium rounded-xl pl-3.5 pr-8 py-2 shadow-xs focus:outline-none focus:border-blue-500"
            >
              <option value="Python, SQL">Python, SQL</option>
              <option value="Java, Spring">Java, Spring</option>
              <option value="React, TypeScript">React, TypeScript</option>
              <option value="Machine Learning">Machine Learning</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Certificates */}
        <div className="flex flex-col space-y-1">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Certificates</span>
          <div className="relative">
            <select
              value={certFilter}
              onChange={(e) => setCertFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-slate-800 text-xs font-medium rounded-xl pl-3.5 pr-8 py-2 shadow-xs focus:outline-none focus:border-blue-500"
            >
              <option>Required</option>
              <option>Optional</option>
              <option>Blockchain Verified Only</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Clear All Link */}
        <div className="self-end pb-2 sm:ml-auto">
          <button
            onClick={handleClearAll}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Comparison Drawer if any candidates selected */}
      {comparedList.length > 0 && (
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-900">
            <span>Comparing ({comparedList.length}/3):</span>
            <span className="text-blue-700 font-normal">{comparedList.join(", ")}</span>
          </div>
          <button
            onClick={() => alert(`Comparing: ${comparedList.join(" vs ")}`)}
            className="px-4 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-xs hover:bg-blue-700"
          >
            Launch Head-to-Head Comparison
          </button>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-2">
        <span>Showing {candidates.length} results (sorted by match score)</span>
      </div>

      {/* Candidate Cards List (Exact Match to Screen 6) */}
      <div className="space-y-4">
        {candidates.map((cand) => (
          <div
            key={cand.id}
            className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all hover:border-blue-400/60 hover:shadow-sm"
          >
            {/* Left: Avatar + Details */}
            <div className="flex items-center space-x-4 min-w-0">
              <div
                className={`w-12 h-12 rounded-full bg-gradient-to-tr ${cand.avatarBg} text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm`}
              >
                {cand.name[0]}
              </div>

              <div className="min-w-0 space-y-1.5">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                    {cand.name}
                  </h3>
                  <span title="Verified Credentials" className="text-emerald-500">
                    <ShieldCheck className="w-4 h-4" />
                  </span>
                </div>

                <p className="text-xs text-slate-500">
                  {cand.course} • {cand.gradYear}
                </p>

                {/* Skill Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cand.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full bg-blue-50/80 border border-blue-200/70 text-[11px] font-medium text-blue-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Match Score + Action Buttons */}
            <div className="flex items-center space-x-6 shrink-0 self-end md:self-auto">
              {/* Match Score Display */}
              <div className="text-right">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
                  Match Score
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-emerald-600">
                  {cand.matchScore}%
                </span>
              </div>

              {/* Buttons: View Profile & Compare */}
              <div className="flex items-center space-x-2.5">
                <Link
                  href={`/dashboard/recruiter/candidate/${cand.id}`}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-md shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all"
                >
                  View Profile
                </Link>

                <button
                  onClick={() => toggleCompare(cand.name)}
                  className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-all ${
                    comparedList.includes(cand.name)
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  {comparedList.includes(cand.name) ? "Selected" : "Compare"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
