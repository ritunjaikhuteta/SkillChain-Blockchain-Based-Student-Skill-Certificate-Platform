"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest, SkillItem, SkillRecommendationDto, ShortestPathDto } from "@/lib/api";
import {
  Compass,
  Sparkles,
  ArrowRight,
  Lightbulb,
  CheckCircle2,
  Route,
  Zap,
  BookOpen,
  ChevronRight,
  ExternalLink,
  Layers,
  BarChart2,
  Cpu,
  Database,
  Code,
} from "lucide-react";

interface RecommendedSkill {
  name: string;
  relevance: "High relevance" | "Medium relevance";
  level: "high" | "medium";
  description: string;
  category: string;
}

export default function StudentRecommendationsPage() {
  const [currentSkills, setCurrentSkills] = useState<string[]>(["Python", "SQL", "Statistics"]);
  const [loading, setLoading] = useState(true);

  // Load real student skills if available
  useEffect(() => {
    apiRequest<SkillItem[]>("/student/skills")
      .then((data) => {
        if (data && data.length > 0) {
          const names = data.map((s) => s.name);
          // Combine or prioritize default showcase skills
          setCurrentSkills(Array.from(new Set([...names, "Python", "SQL", "Statistics"])).slice(0, 5));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const recommendedSkills: RecommendedSkill[] = [
    {
      name: "Pandas",
      relevance: "High relevance",
      level: "high",
      description: "Data manipulation and analysis library offering high-performance dataframe structures.",
      category: "Data Science",
    },
    {
      name: "Data Visualization",
      relevance: "High relevance",
      level: "high",
      description: "Create communicative plots, interactive dashboards using Matplotlib, Seaborn or D3.",
      category: "Analytics",
    },
    {
      name: "Machine Learning",
      relevance: "Medium relevance",
      level: "medium",
      description: "Predictive modeling, supervised/unsupervised algorithms with Scikit-Learn.",
      category: "AI & ML",
    },
    {
      name: "NumPy",
      relevance: "Medium relevance",
      level: "medium",
      description: "Fundamental package for scientific computing with multi-dimensional arrays.",
      category: "Mathematics",
    },
  ];

  const learningPathSteps = [
    {
      step: 1,
      title: "Pandas",
      subtitle: "Data manipulation",
      details: "Learn data structures, filtering, grouping, merging, and time-series aggregations.",
    },
    {
      step: 2,
      title: "Data Visualization",
      subtitle: "Create visual insights",
      details: "Design charts, histograms, heatmaps, and translate findings into compelling visual narratives.",
    },
    {
      step: 3,
      title: "Machine Learning",
      subtitle: "Build predictive models",
      details: "Implement classification, linear regression, evaluation metrics, and cross-validation.",
    },
  ];

  const [selectedSkillModal, setSelectedSkillModal] = useState<RecommendedSkill | null>(null);

  return (
    <div className="p-8 max-w-6xl mx-auto w-full space-y-8">
      {/* Header matching Screen 5 */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Skill Recommendations
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Based on your current skills, we&apos;ve found some related skills that can help you grow.
        </p>
      </div>

      {/* Your Current Skills Section (Exact match to Screen 5) */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Your Current Skills
        </h2>
        <div className="flex flex-wrap gap-2.5">
          {currentSkills.map((skill, idx) => (
            <span
              key={idx}
              className="px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/90 text-xs font-semibold text-blue-700 shadow-xs flex items-center space-x-1.5"
            >
              <span>{skill}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main Two-Column Grid: Recommended Skills | Recommended Learning Path */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recommended Skills Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Recommended Skills</h2>

          <div className="space-y-3">
            {recommendedSkills.map((skill, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between transition-all hover:border-blue-400/50 hover:shadow-sm"
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                    {idx === 0 ? (
                      <Layers className="w-5 h-5 text-teal-600" />
                    ) : idx === 1 ? (
                      <BarChart2 className="w-5 h-5 text-blue-600" />
                    ) : idx === 2 ? (
                      <Cpu className="w-5 h-5 text-purple-600" />
                    ) : (
                      <Database className="w-5 h-5 text-indigo-600" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2.5">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{skill.name}</h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          skill.level === "high"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {skill.relevance}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-xs sm:max-w-md">
                      {skill.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedSkillModal(skill)}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-md shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all shrink-0 ml-3"
                >
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Learning Path Column (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">Recommended Learning Path</h2>
          </div>

          {/* Numbered Steps Timeline */}
          <div className="relative pl-8 space-y-6 before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-blue-200">
            {learningPathSteps.map((step) => (
              <div key={step.step} className="relative">
                {/* Number Circle Badge */}
                <div className="absolute -left-8 top-0.5 w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center ring-4 ring-white shadow-xs">
                  {step.step}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{step.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{step.subtitle}</p>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {step.details}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/dashboard/student/network"
            className="w-full py-2.5 rounded-xl bg-[#EEF2FF] hover:bg-[#E0E7FF] text-blue-700 text-xs font-semibold text-center block transition-colors border border-blue-200/60"
          >
            View Full Roadmap
          </Link>
        </div>
      </div>

      {/* Modal for "Learn More" on a skill */}
      {selectedSkillModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{selectedSkillModal.name}</h3>
              </div>
              <button
                onClick={() => setSelectedSkillModal(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <p className="leading-relaxed">{selectedSkillModal.description}</p>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <p className="font-semibold text-slate-800">Domain: {selectedSkillModal.category}</p>
                <p className="text-slate-500">Market Relevance: {selectedSkillModal.relevance}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                onClick={() => setSelectedSkillModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              <Link
                href="/dashboard/student/skills"
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
              >
                Add to My Skills
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
