"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest, CandidateRankDto } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Search,
  ArrowRight,
  ShieldCheck,
  FolderGit2,
  SlidersHorizontal,
  CheckCircle2,
  XCircle,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Award
} from "lucide-react";

const SUGGESTED_SKILLS = [
  "Java",
  "Spring Boot",
  "MySQL",
  "Docker",
  "React",
  "TypeScript",
  "Next.js",
  "Python",
  "PostgreSQL",
  "Microservices",
];

export default function CandidateSearchPage() {
  const [query, setQuery] = useState("Java, Spring Boot");
  const [candidates, setCandidates] = useState<CandidateRankDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const fetchRankedCandidates = async (skillsQuery: string) => {
    setLoading(true);
    setError(null);
    try {
      const cleanSkills = skillsQuery
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const endpoint = cleanSkills.length > 0
        ? `/recruiter/candidates/ranked?skills=${encodeURIComponent(cleanSkills.join(","))}&limit=25`
        : "/recruiter/candidates/ranked?skills=Java&limit=25";

      const data = await apiRequest<CandidateRankDto[]>(endpoint);
      setCandidates(data || []);
      setSearched(true);
    } catch (err: any) {
      setError(err.message || "Failed to query algorithmic candidate ranking");
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankedCandidates("Java, Spring Boot");
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRankedCandidates(query);
  };

  const handleToggleSkill = (skill: string) => {
    const currentSkills = query
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const exists = currentSkills.some((s) => s.toLowerCase() === skill.toLowerCase());
    let nextSkills: string[];
    if (exists) {
      nextSkills = currentSkills.filter((s) => s.toLowerCase() !== skill.toLowerCase());
    } else {
      nextSkills = [...currentSkills, skill];
    }

    const nextQuery = nextSkills.join(", ");
    setQuery(nextQuery);
    fetchRankedCandidates(nextQuery);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-[3px] bg-[#FFFFFF] border border-[#DFDDD6] text-[11px] font-mono text-[#5555A5] mb-2 font-medium">
          <SlidersHorizontal className="w-3 h-3" />
          <span>ALGORITHMIC RANKING // 50-25-15-10 FORMULA</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#191919]">
          Ranked Candidate Discovery
        </h1>
        <p className="text-xs text-[#77756F] mt-1 leading-relaxed">
          Evaluate candidates scored deterministically on Skill Match Coverage (50%), Proficiency Depth (25%),
          Project Relevance (15%), and Blockchain-Verified Certificates (10%).
        </p>
      </div>

      {/* Search Input Card */}
      <Card>
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Enter required skills (comma-separated, e.g. Java, Spring Boot, MySQL, Docker)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button type="submit" loading={loading} className="shrink-0 font-medium">
              <Search className="w-3.5 h-3.5 mr-1.5" />
              <span>Rank Candidates</span>
            </Button>
          </div>

          {/* Quick Skill Tags */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-[#77756F]">
            <span className="text-[11px] font-mono mr-1">QUICK FILTER:</span>
            {SUGGESTED_SKILLS.map((skill) => {
              const isSelected = query.toLowerCase().includes(skill.toLowerCase());
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleToggleSkill(skill)}
                  className={`px-2 py-0.5 rounded-[3px] text-[11px] font-medium transition-colors border ${
                    isSelected
                      ? "bg-[#5555A5] text-[#FFFFFF] border-[#5555A5]"
                      : "bg-[#F8F7F3] text-[#77756F] border-[#DFDDD6] hover:text-[#191919] hover:bg-[#FFFFFF]"
                  }`}
                >
                  {skill} {isSelected ? "✓" : "+"}
                </button>
              );
            })}
          </div>
        </form>
      </Card>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-[4px] bg-[#FEF2F2] border border-[#FEE2E2] flex items-center justify-between text-xs text-[#B91C1C]">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => fetchRankedCandidates(query)}>
            <RefreshCw className="w-3 h-3 mr-1" />
            <span>Retry</span>
          </Button>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-[#77756F]">
        <div className="flex items-center space-x-2">
          <span>
            Ranked <strong className="text-[#191919] font-semibold">{candidates.length}</strong> candidates
          </span>
          <span className="text-[#DFDDD6]">|</span>
          <span className="font-mono text-[11px]">DETERMINISTIC EVALUATION</span>
        </div>
        {query && (
          <button
            onClick={() => {
              setQuery("");
              fetchRankedCandidates("");
            }}
            className="text-[#5555A5] hover:underline"
          >
            Clear query
          </button>
        )}
      </div>

      {/* Candidate List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-44 bg-[#FFFFFF] border border-[#DFDDD6] rounded-[4px] animate-pulse"
            />
          ))}
        </div>
      ) : candidates.length === 0 ? (
        <EmptyState
          icon={<Search className="w-8 h-8 text-[#5555A5]" />}
          title="No Matching Candidates Found"
          description={
            query
              ? `No active students currently possess the required skills "${query}". Try adjusting your target technology stack.`
              : "No candidates currently registered."
          }
          actionLabel="Reset Search to Java"
          onAction={() => {
            setQuery("Java, Spring Boot");
            fetchRankedCandidates("Java, Spring Boot");
          }}
        />
      ) : (
        <div className="space-y-4">
          {candidates.map((candidate, index) => {
            const composite = Number(candidate.compositeScore || 0);
            const coverage = Number(candidate.skillCoverageScore || 0);
            const depth = Number(candidate.proficiencyDepthScore || 0);
            const projects = Number(candidate.projectRelevanceScore || 0);
            const verified = Number(candidate.blockchainVerifiedScore || 0);

            return (
              <Card
                key={candidate.studentId || candidate.profileId || index}
                className="hover:border-[#5555A5]/60 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
              >
                <div className="space-y-4">
                  {/* Top Bar: Rank, Name, Composite Score */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-3 border-b border-[#DFDDD6]">
                    <div className="flex items-start space-x-3">
                      <div className="w-7 h-7 rounded-[3px] bg-[#191919] text-white flex items-center justify-center font-mono text-xs font-semibold shrink-0">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2.5">
                          <h3 className="text-base font-semibold text-[#191919]">
                            {candidate.studentName}
                          </h3>
                          <Badge variant="accent">Rank #{index + 1}</Badge>
                          {candidate.verifiedCertificatesCount > 0 && (
                            <span className="inline-flex items-center space-x-1 text-[11px] font-mono text-[#D97706] bg-[#FEF3C7]/60 px-2 py-0.5 rounded-[3px] border border-[#FDE68A]">
                              <ShieldCheck className="w-3 h-3 text-[#D97706]" />
                              <span>{candidate.verifiedCertificatesCount} On-Chain</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#77756F] mt-0.5 font-medium">
                          {candidate.headline || "Engineering Student"} • {candidate.email}
                        </p>
                      </div>
                    </div>

                    {/* Composite Score Banner */}
                    <div className="sm:text-right shrink-0">
                      <div className="text-2xl font-semibold font-mono text-[#5555A5] leading-none">
                        {composite.toFixed(1)}%
                      </div>
                      <span className="text-[10px] font-mono text-[#77756F] uppercase tracking-wider block mt-1">
                        MATCH SCORE
                      </span>
                    </div>
                  </div>

                  {/* Four Scoring Components Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF9F6] p-3 rounded-[3px] border border-[#DFDDD6] text-xs">
                    <div>
                      <span className="text-[#77756F] text-[10px] uppercase font-mono block">
                        Skill Coverage (50%)
                      </span>
                      <span className="font-semibold text-[#191919] font-mono text-xs mt-0.5 block">
                        {coverage.toFixed(1)} / 50.0
                      </span>
                    </div>

                    <div>
                      <span className="text-[#77756F] text-[10px] uppercase font-mono block">
                        Proficiency Depth (25%)
                      </span>
                      <span className="font-semibold text-[#191919] font-mono text-xs mt-0.5 block">
                        {depth.toFixed(1)} / 25.0
                      </span>
                    </div>

                    <div>
                      <span className="text-[#77756F] text-[10px] uppercase font-mono block">
                        Project Relevance (15%)
                      </span>
                      <span className="font-semibold text-[#191919] font-mono text-xs mt-0.5 block">
                        {projects.toFixed(1)} / 15.0
                      </span>
                    </div>

                    <div>
                      <span className="text-[#77756F] text-[10px] uppercase font-mono block">
                        Blockchain Ledger (10%)
                      </span>
                      <span className="font-semibold text-[#191919] font-mono text-xs mt-0.5 block">
                        {verified.toFixed(1)} / 10.0
                      </span>
                    </div>
                  </div>

                  {/* Skills Breakdown: Matched vs Missing */}
                  <div className="space-y-2 pt-1 text-xs">
                    {/* Matching Skills */}
                    {candidate.matchingSkills && candidate.matchingSkills.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[#77756F] text-[11px] font-medium mr-1 flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#166534] mr-1" />
                          Matched:
                        </span>
                        {candidate.matchingSkills.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-[3px] bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] text-[11px] font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Missing Skills */}
                    {candidate.missingSkills && candidate.missingSkills.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[#77756F] text-[11px] font-medium mr-1 flex items-center">
                          <XCircle className="w-3.5 h-3.5 text-[#DC2626] mr-1" />
                          Missing:
                        </span>
                        {candidate.missingSkills.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-[3px] bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-[11px] font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Explanation & Action Footer */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs border-t border-[#DFDDD6]/70">
                    <p className="text-[11px] text-[#77756F] font-mono truncate max-w-xl">
                      {candidate.explanation || "Deterministic algorithmic ranking result."}
                    </p>

                    <div className="shrink-0 self-end sm:self-center">
                      <Link href={`/dashboard/recruiter/candidate/${candidate.profileId}`}>
                        <Button size="sm">
                          <span>Inspect Dossier</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
