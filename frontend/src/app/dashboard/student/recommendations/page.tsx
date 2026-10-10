"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest, SkillItem, SkillRecommendationDto, ShortestPathDto } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SkillAutocompleteInput } from "@/components/ui/SkillAutocompleteInput";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Compass,
  Sparkles,
  ArrowRight,
  Lightbulb,
  Route,
  Zap,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Search,
  RefreshCw
} from "lucide-react";

interface FallbackRecommendation {
  skill: string;
  category: string;
  reason: string;
  marketDemand: string;
}

function generateFallbackRecommendations(skills: SkillItem[]): FallbackRecommendation[] {
  const names = skills.map((s) => s.name.toLowerCase());
  const recs: FallbackRecommendation[] = [];

  if (names.some((n) => n.includes("java") || n.includes("spring"))) {
    recs.push({
      skill: "Apache Kafka",
      category: "Backend / Distributed Systems",
      reason: "Frequently paired with Spring Boot microservices for event-driven streaming.",
      marketDemand: "High",
    });
    recs.push({
      skill: "Docker & Containerization",
      category: "DevOps",
      reason: "Essential for containerizing Java applications and continuous deployment.",
      marketDemand: "Critical",
    });
  }

  if (names.some((n) => n.includes("react") || n.includes("next"))) {
    recs.push({
      skill: "TypeScript",
      category: "Frontend",
      reason: "Adds static typing and robust DX to your React/Next.js toolchain.",
      marketDemand: "High",
    });
    recs.push({
      skill: "Tailwind CSS & Design Systems",
      category: "Frontend",
      reason: "Streamlines production UI engineering and component architecture.",
      marketDemand: "Medium",
    });
  }

  if (names.some((n) => n.includes("mysql") || n.includes("sql") || n.includes("postgres"))) {
    recs.push({
      skill: "Redis Caching",
      category: "Database",
      reason: "Complements relational storage with high-speed in-memory session caching.",
      marketDemand: "High",
    });
  }

  if (recs.length < 3) {
    recs.push({
      skill: "RESTful API Security (OAuth2 / JWT)",
      category: "Security",
      reason: "Foundational requirement for engineering enterprise backends.",
      marketDemand: "High",
    });
    recs.push({
      skill: "Kubernetes Orchestration",
      category: "Cloud",
      reason: "Industry standard for scaling microservices in production clusters.",
      marketDemand: "High",
    });
  }

  return recs;
}

export default function StudentRecommendationsPage() {
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [graphRecs, setGraphRecs] = useState<SkillRecommendationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pathway Calculator State
  const [fromSkill, setFromSkill] = useState("Java");
  const [toSkill, setToSkill] = useState("Microservices");
  const [pathway, setPathway] = useState<ShortestPathDto | null>(null);
  const [pathLoading, setPathLoading] = useState(false);
  const [pathError, setPathError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const skillsData = await apiRequest<SkillItem[]>("/student/skills").catch(() => []);
      setSkills(skillsData || []);

      const graphData = await apiRequest<SkillRecommendationDto[]>("/student/recommendations/graph").catch(() => []);
      setGraphRecs(graphData || []);
    } catch (err: any) {
      setError(err.message || "Failed to load recommendation telemetry");
    } finally {
      setLoading(false);
    }
  };

  const calculatePathway = async (origin: string, target: string) => {
    if (!origin.trim() || !target.trim()) return;
    setPathLoading(true);
    setPathError(null);
    try {
      const data = await apiRequest<ShortestPathDto>(
        `/skills/pathway?from=${encodeURIComponent(origin.trim())}&to=${encodeURIComponent(target.trim())}`
      );
      setPathway(data);
    } catch (err: any) {
      setPathError(err.message || "Failed to compute learning pathway");
      setPathway(null);
    } finally {
      setPathLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    calculatePathway("Java", "Microservices");
  }, []);

  const fallbackRecs = generateFallbackRecommendations(skills);

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#191919]">
          Skill Recommendations & Learning Pathway
        </h1>
        <p className="text-xs text-[#77756F] mt-1">
          Algorithmic graph suggestions and Dijkstra shortest-path calculations powered by SkillChain graph engine.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-[4px] bg-[#FEF2F2] border border-[#FEE2E2] flex items-center justify-between text-xs text-[#B91C1C]">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button variant="outline" size="sm" onClick={loadData}>
            <RefreshCw className="w-3 h-3 mr-1" />
            <span>Retry</span>
          </Button>
        </div>
      )}

      {/* SECTION 1: Interactive Dijkstra Learning Pathway Calculator */}
      <Card className="bg-[#FFFFFF]">
        <CardHeader className="pb-3 border-b border-[#DFDDD6]">
          <div className="flex items-center space-x-2">
            <Route className="w-4 h-4 text-[#5555A5]" />
            <CardTitle className="text-base font-semibold text-[#191919]">
              Dijkstra Learning Pathway Calculator
            </CardTitle>
          </div>
          <p className="text-xs text-[#77756F] mt-1">
            Compute the mathematically optimal learning pathway between two engineering skills using weighted graph traversal.
          </p>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
            <div className="sm:col-span-2 space-y-1">
              <SkillAutocompleteInput
                label="Starting Competency"
                value={fromSkill}
                onChange={(val) => setFromSkill(val)}
                placeholder="e.g. Java, Python, React"
              />
            </div>
            <div className="sm:col-span-2 space-y-1">
              <SkillAutocompleteInput
                label="Target Competency"
                value={toSkill}
                onChange={(val) => setToSkill(val)}
                placeholder="e.g. Microservices, Docker, Kubernetes"
              />
            </div>
            <div className="sm:col-span-1">
              <Button
                className="w-full"
                loading={pathLoading}
                onClick={() => calculatePathway(fromSkill, toSkill)}
              >
                <Zap className="w-3.5 h-3.5 mr-1" />
                <span>Calculate</span>
              </Button>
            </div>
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-[#77756F]">
            <span>Preset pathways:</span>
            {[
              ["Java", "Microservices"],
              ["Java", "Docker"],
              ["Spring Boot", "Kubernetes"],
              ["React", "TypeScript"],
            ].map(([orig, dest]) => (
              <button
                key={`${orig}-${dest}`}
                onClick={() => {
                  setFromSkill(orig);
                  setToSkill(dest);
                  calculatePathway(orig, dest);
                }}
                className="px-2 py-0.5 rounded-[3px] bg-[#FAF9F6] border border-[#DFDDD6] hover:border-[#5555A5] text-[#191919] transition-colors"
              >
                {orig} → {dest}
              </button>
            ))}
          </div>

          {/* Pathway Result */}
          {pathError && (
            <div className="p-3 bg-[#FEF2F2] border border-[#FEE2E2] rounded-[3px] text-xs text-[#B91C1C] flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{pathError}</span>
            </div>
          )}

          {pathway && (
            <div className="p-4 bg-[#FAF9F6] border border-[#DFDDD6] rounded-[4px] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#DFDDD6] pb-2 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-[#191919]">
                    {pathway.sourceSkill} → {pathway.targetSkill}
                  </span>
                  {pathway.pathFound ? (
                    <Badge variant="success">OPTIMAL PATH FOUND</Badge>
                  ) : (
                    <Badge variant="destructive">DISCONNECTED NODES</Badge>
                  )}
                </div>
                {pathway.pathFound && (
                  <span className="font-mono text-[11px] text-[#77756F]">
                    Total Weight: <strong className="text-[#5555A5]">{pathway.totalDistance.toFixed(1)}</strong> ({pathway.pathNodes.length - 1} hops)
                  </span>
                )}
              </div>

              {pathway.pathFound ? (
                <>
                  {/* Step node pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {pathway.pathNodes.map((node, index) => (
                      <React.Fragment key={index}>
                        <span className="px-3 py-1 bg-[#FFFFFF] border border-[#5555A5]/30 rounded-[3px] text-xs font-semibold text-[#191919] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                          {node}
                        </span>
                        {index < pathway.pathNodes.length - 1 && (
                          <span className="text-[#5555A5] font-bold">→</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Step Explanations */}
                  {pathway.stepExplanations && pathway.stepExplanations.length > 0 && (
                    <div className="space-y-1.5 pt-2 text-xs">
                      <span className="text-[10px] font-mono uppercase text-[#77756F] block">
                        Dijkstra Transition Analysis
                      </span>
                      {pathway.stepExplanations.map((exp, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-[#77756F]">
                          <span className="text-[#5555A5] font-mono shrink-0">#{idx + 1}</span>
                          <span className="leading-relaxed">{exp}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-xs text-[#77756F]">
                  No directed pathway currently connects "{pathway.sourceSkill}" and "{pathway.targetSkill}" in the curriculum graph.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* SECTION 2: Graph-Driven Personalized Recommendations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#5555A5]" />
            <h2 className="text-lg font-semibold text-[#191919]">
              Personalized Recommendations
            </h2>
          </div>
          <span className="text-[11px] font-mono text-[#77756F]">GRAPH AFFINITY ENGINE</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-[#FFFFFF] border border-[#DFDDD6] rounded-[4px] animate-pulse" />
            ))}
          </div>
        ) : skills.length === 0 ? (
          <EmptyState
            icon={<Compass className="w-8 h-8 text-[#5555A5]" />}
            title="No Skills Registered"
            description="Register your current competencies so SkillChain can evaluate your stack and generate targeted recommendations."
            actionLabel="Add Skills"
            onAction={() => (window.location.href = "/dashboard/student/skills")}
          />
        ) : graphRecs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {graphRecs.map((rec, idx) => (
              <Card key={idx} className="flex flex-col justify-between hover:border-[#5555A5]/50 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-[#191919]">{rec.skillName}</h3>
                    <Badge variant="accent">{rec.relevanceScore.toFixed(0)}% Affinity</Badge>
                  </div>
                  <Badge variant="outline" className="text-[11px]">
                    {rec.category || "Recommended Tech"}
                  </Badge>
                  <p className="text-xs text-[#77756F] leading-relaxed pt-1">
                    {rec.reason}
                  </p>
                  {rec.learningPath && rec.learningPath.length > 1 && (
                    <div className="text-[11px] font-mono text-[#5555A5] pt-1">
                      Path: {rec.learningPath.join(" → ")}
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-[#DFDDD6] flex items-center justify-between">
                  <span className="text-[11px] text-[#77756F]">Graph Distance: {rec.learningDistance.toFixed(1)}</span>
                  <Link href="/dashboard/student/skills">
                    <Button size="sm" variant="outline">
                      <span>Add to Profile</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-[4px] border border-[#DFDDD6] bg-[#FFFFFF] flex items-start space-x-3">
              <Lightbulb className="w-4 h-4 text-[#5555A5] shrink-0 mt-0.5" />
              <div className="text-xs text-[#77756F] leading-relaxed">
                Based on your <span className="font-semibold text-[#191919]">{skills.length} verified skills</span> (including {skills.map((s) => s.name).slice(0, 3).join(", ")}), here are high-affinity technologies that engineering teams frequently seek alongside your stack.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fallbackRecs.map((rec, idx) => (
                <Card key={idx} className="flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-[#191919]">{rec.skill}</h3>
                      <Badge variant="accent">{rec.marketDemand} Demand</Badge>
                    </div>
                    <Badge variant="outline" className="text-[11px]">{rec.category}</Badge>
                    <p className="text-xs text-[#77756F] leading-relaxed pt-1">
                      {rec.reason}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#DFDDD6] flex items-center justify-between">
                    <span className="text-[11px] text-[#77756F]">Stack Synergy</span>
                    <Link href="/dashboard/student/skills">
                      <Button size="sm" variant="outline">
                        <span>Add to Profile</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
