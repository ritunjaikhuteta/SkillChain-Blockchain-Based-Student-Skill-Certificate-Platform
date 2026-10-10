"use client";

import React, { useEffect, useState } from "react";
import { apiRequest, StudentProfileData } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Dialog } from "@/components/ui/Dialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { SlidersHorizontal, Search, Trash2, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";

interface AggregatedSkill {
  name: string;
  category: string;
  frequency: number;
  proficiencies: Record<string, number>;
}

export default function AdminSkillsPage() {
  const [skillsList, setSkillsList] = useState<AggregatedSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Gather all skills from student profiles to build the canonical registry
    apiRequest<StudentProfileData[]>("/recruiter/students")
      .then((students) => {
        const skillMap: Record<string, AggregatedSkill> = {};
        students.forEach((s) => {
          s.skills?.forEach((skill) => {
            const key = skill.name.toLowerCase().trim();
            if (!skillMap[key]) {
              skillMap[key] = {
                name: skill.name,
                category: skill.category,
                frequency: 0,
                proficiencies: {},
              };
            }
            skillMap[key].frequency += 1;
            skillMap[key].proficiencies[skill.proficiency] =
              (skillMap[key].proficiencies[skill.proficiency] || 0) + 1;
          });
        });
        setSkillsList(Object.values(skillMap).sort((a, b) => b.frequency - a.frequency));
      })
      .catch((err) => setError(err.message || "Failed to load skill taxonomy"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = skillsList.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#191919]">
          Platform Skill Taxonomy &amp; Verification
        </h1>
        <p className="text-xs text-[#77756F] mt-1">
          Catalog of registered technical proficiencies and cross-portfolio distribution.
        </p>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Filter taxonomy by skill name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="shrink-0 flex items-center space-x-2 text-xs text-[#77756F]">
            <span>Total Unique Skills:</span>
            <strong className="text-[#191919]">{skillsList.length}</strong>
          </div>
        </div>
      </Card>

      {error && (
        <div className="p-4 rounded-[4px] bg-[#FEF2F2] border border-[#FEE2E2] flex items-center space-x-2 text-xs text-[#B91C1C]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-[#FFFFFF] border border-[#DFDDD6] rounded-[4px] animate-pulse"></div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<SlidersHorizontal className="w-8 h-8 text-[#5555A5]" />}
          title="No Skills Found in Taxonomy"
          description={searchTerm ? "No competencies matched your filter." : "No skills have been registered across student profiles yet."}
        />
      ) : (
        <div className="border border-[#DFDDD6] rounded-[4px] bg-[#FFFFFF] divide-y divide-[#DFDDD6]">
          {filtered.map((item, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between hover:bg-[#FAF9F5] transition-colors">
              <div className="space-y-1">
                <div className="flex items-center space-x-2.5">
                  <h3 className="text-sm font-semibold text-[#191919]">{item.name}</h3>
                  <Badge variant="secondary">{item.category}</Badge>
                  <span className="text-[11px] text-[#77756F]">
                    {item.frequency} student {item.frequency === 1 ? "portfolio" : "portfolios"}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-[#77756F]">
                  <span>Proficiency distribution:</span>
                  {Object.entries(item.proficiencies).map(([prof, count]) => (
                    <span key={prof} className="font-mono text-[#191919]">
                      {prof}: {count}
                    </span>
                  ))}
                </div>
              </div>

              <Badge variant="accent">Canonically Verified</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
