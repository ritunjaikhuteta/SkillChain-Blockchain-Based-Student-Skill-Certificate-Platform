"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { apiRequest, StudentProfileData, StudentStats, CertificateItem } from "@/lib/api";
import {
  Sparkles,
  FolderGit2,
  Award,
  ChevronDown,
  CheckCircle2,
  Clock,
  PlusCircle,
  RefreshCw,
  Network,
  ExternalLink,
  Code2,
  BarChart2,
  Cpu,
  Layers,
  Check,
} from "lucide-react";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfileData | null>(null);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profData, statsData, certsData] = await Promise.all([
          apiRequest<StudentProfileData>("/student/profile").catch(() => null),
          apiRequest<StudentStats>("/student/stats").catch(() => null),
          apiRequest<CertificateItem[]>("/student/certificates").catch(() => []),
        ]);
        if (profData) setProfile(profData);
        if (statsData) setStats(statsData);
        if (certsData) setCertificates(certsData);
      } catch (e) {
        console.error("Dashboard data load error:", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const studentName = profile?.fullName || user?.fullName || "Asha Sharma";
  const totalSkillsCount = stats?.skillsCount ?? 8;
  const certsCount = stats?.certificatesCount ?? 3;
  const projectsCount = stats?.projectsCount ?? 2;
  const completionPct = stats?.profileCompletionPercentage ?? 75;

  // Fallback sample certificates if none in database yet matching screenshot
  const displayCerts = certificates.length > 0
    ? certificates.slice(0, 3).map((c) => ({
        name: c.title,
        issuer: c.issuingOrganization || "Institution",
        status: c.verified ? "Verified" : "Pending",
        date: new Date(c.issueDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      }))
    : [
        { name: "Python Programming", issuer: "Demo Training Institute", status: "Verified", date: "12 Mar 2025" },
        { name: "Web Development", issuer: "ABC Academy", status: "Verified", date: "10 Jan 2025" },
        { name: "Data Science Basics", issuer: "XYZ Learning", status: "Pending", date: "05 Dec 2024" },
      ];

  const topSkills = [
    { name: "Data Visualization", demand: "High Demand", level: "high" },
    { name: "Machine Learning", demand: "High Demand", level: "high" },
    { name: "Pandas", demand: "Medium", level: "medium" },
    { name: "Power BI", demand: "Medium", level: "medium" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center space-x-2">
            <span>Welcome back, {studentName}</span>
            <span className="text-2xl">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Build your skills. Verify your credentials. Grow your future.
          </p>
        </div>

        {/* User Profile Pill matching screenshot top-right */}
        <div className="flex items-center space-x-3 bg-white px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-xs self-start sm:self-auto">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
            <span className="text-xs font-semibold">{studentName[0]}</span>
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-slate-800 leading-tight">{studentName}</p>
            <p className="text-[10px] text-slate-400">Student</p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>

      {/* 4 Colorful Summary Stat Cards (Exact match to screenshot 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Skills - Sky Blue */}
        <Link href="/dashboard/student/skills" className="block group">
          <div className="bg-[#EBF3FF] border border-[#BFDBFE] rounded-2xl p-5 transition-all duration-200 hover:shadow-md hover:border-blue-400">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-400/30 flex items-center justify-center text-blue-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-xs font-medium text-slate-600">Total Skills</div>
            </div>
            <div className="mt-4 text-3xl font-extrabold text-slate-900">{totalSkillsCount}</div>
          </div>
        </Link>

        {/* Certificates - Mint Green */}
        <Link href="/dashboard/student/certificates" className="block group">
          <div className="bg-[#EAFBF3] border border-[#A7F3D0] rounded-2xl p-5 transition-all duration-200 hover:shadow-md hover:border-emerald-400">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-600">
                <Award className="w-5 h-5" />
              </div>
              <div className="text-xs font-medium text-slate-600">Certificates</div>
            </div>
            <div className="mt-4 text-3xl font-extrabold text-slate-900">{certsCount}</div>
          </div>
        </Link>

        {/* Projects - Lavender / Purple */}
        <Link href="/dashboard/student/projects" className="block group">
          <div className="bg-[#F5F0FF] border border-[#DDD6FE] rounded-2xl p-5 transition-all duration-200 hover:shadow-md hover:border-purple-400">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-400/30 flex items-center justify-center text-purple-600">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <div className="text-xs font-medium text-slate-600">Projects</div>
            </div>
            <div className="mt-4 text-3xl font-extrabold text-slate-900">{projectsCount}</div>
          </div>
        </Link>

        {/* Profile Completion - Warm Gold / Amber */}
        <Link href="/dashboard/student/profile" className="block group">
          <div className="bg-[#FFF9EA] border border-[#FDE68A] rounded-2xl p-5 transition-all duration-200 hover:shadow-md hover:border-amber-400">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-xs font-medium text-slate-600">Profile Completion</div>
            </div>
            <div className="mt-4 text-3xl font-extrabold text-slate-900">{completionPct}%</div>
          </div>
        </Link>
      </div>

      {/* Middle Grid: Recent Certificates | Top Recommended Skills | Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Certificates (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">Recent Certificates</h2>
              <Link href="/dashboard/student/certificates" className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                View All
              </Link>
            </div>

            <div className="mt-4 space-y-3.5">
              {displayCerts.map((cert, idx) => (
                <div key={idx} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{cert.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{cert.issuer}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        cert.status === "Verified"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {cert.status}
                    </span>
                    <span className="text-[10px] text-slate-400 hidden sm:inline">{cert.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Recommended Skills (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">Top Recommended Skills</h2>
              <Link href="/dashboard/student/recommendations" className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                View All
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {topSkills.map((skill, idx) => (
                <div key={idx} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 text-xs font-medium">
                      {idx === 0 ? <BarChart2 className="w-3.5 h-3.5 text-blue-500" /> : idx === 1 ? <Cpu className="w-3.5 h-3.5 text-purple-500" /> : <Layers className="w-3.5 h-3.5 text-emerald-500" />}
                    </div>
                    <span className="text-xs font-medium text-slate-800">{skill.name}</span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${
                      skill.level === "high"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {skill.demand}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions (3 Cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">Quick Actions</h2>
            </div>

            <div className="mt-4 space-y-2.5">
              <Link
                href="/dashboard/student/certificates"
                className="w-full flex items-center space-x-2.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/40 text-xs font-medium transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5 text-blue-500" />
                <span>Add Certificate</span>
              </Link>

              <Link
                href="/dashboard/student/projects"
                className="w-full flex items-center space-x-2.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:border-purple-500 hover:text-purple-600 hover:bg-purple-50/40 text-xs font-medium transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5 text-purple-500" />
                <span>Add Project</span>
              </Link>

              <Link
                href="/dashboard/student/skills"
                className="w-full flex items-center space-x-2.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50/40 text-xs font-medium transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-500" />
                <span>Update Skills</span>
              </Link>

              <Link
                href="/dashboard/student/network"
                className="w-full flex items-center space-x-2.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50/40 text-xs font-medium transition-all"
              >
                <Network className="w-3.5 h-3.5 text-indigo-500" />
                <span>View 3D Network</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Your Skill Progress */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-2.5">
          <span>Your Skill Progress</span>
          <span className="text-slate-500 font-normal">{totalSkillsCount} / 15 Skills</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.round((totalSkillsCount / 15) * 100))}%` }}
          />
        </div>
      </div>
    </div>
  );
}
