"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest, StudentProfileData } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Search, Users, Sparkles, ArrowRight, ShieldCheck, ExternalLink } from "lucide-react";

export default function RecruiterDashboard() {
  const [candidates, setCandidates] = useState<StudentProfileData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<StudentProfileData[]>("/recruiter/students")
      .then((data) => setCandidates(data))
      .catch(() => setCandidates([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#191919]">
            Recruiter Workspace
          </h1>
          <p className="text-xs text-[#77756F] mt-1">
            Discover and evaluate verified engineering students with substantiated project evidence.
          </p>
        </div>
        <Link href="/dashboard/recruiter/search">
          <Button size="sm">
            <Search className="w-3.5 h-3.5 mr-1.5" />
            <span>Search Candidates</span>
          </Button>
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between text-xs text-[#77756F]">
            <span>Active Student Profiles</span>
            <Users className="w-4 h-4 text-[#5555A5]" />
          </div>
          <div className="mt-3 text-2xl font-semibold text-[#191919]">
            {loading ? "..." : candidates.length}
          </div>
          <p className="mt-1 text-[11px] text-[#77756F]">Verified in SkillChain registry</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between text-xs text-[#77756F]">
            <span>Skill Verification</span>
            <ShieldCheck className="w-4 h-4 text-[#166534]" />
          </div>
          <div className="mt-3 text-2xl font-semibold text-[#166534]">100%</div>
          <p className="mt-1 text-[11px] text-[#77756F]">Direct code &amp; credential records</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between text-xs text-[#77756F]">
            <span>Talent Pipeline</span>
            <Sparkles className="w-4 h-4 text-[#5555A5]" />
          </div>
          <div className="mt-3 text-2xl font-semibold text-[#5555A5]">Ready</div>
          <p className="mt-1 text-[11px] text-[#77756F]">Instant portfolio inspection</p>
        </Card>
      </div>

      {/* Candidate spotlight */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Student Portfolios</CardTitle>
            <Link href="/dashboard/recruiter/search" className="text-xs text-[#5555A5] hover:underline">
              View full directory &rarr;
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-16 bg-[#F8F7F3] rounded-[4px] animate-pulse"></div>
              ))}
            </div>
          ) : candidates.length === 0 ? (
            <p className="text-xs text-[#77756F] py-4">No student profiles registered in the system yet.</p>
          ) : (
            <div className="divide-y divide-[#DFDDD6]">
              {candidates.slice(0, 5).map((candidate) => (
                <div key={candidate.id} className="py-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-[#191919]">{candidate.fullName}</h4>
                    <p className="text-[11px] text-[#77756F]">
                      {candidate.headline || candidate.institution || "Engineering Student"}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {candidate.skills?.slice(0, 4).map((s) => (
                        <Badge key={s.id} variant="secondary" className="text-[10px]">
                          {s.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Link href={`/dashboard/recruiter/candidate/${candidate.id}`}>
                    <Button size="sm" variant="outline">
                      <span>View Profile</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
