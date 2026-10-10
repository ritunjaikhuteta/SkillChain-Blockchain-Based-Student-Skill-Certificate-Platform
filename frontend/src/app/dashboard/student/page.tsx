"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest, StudentProfileData, StudentStats } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Sparkles,
  FolderGit2,
  Award,
  ArrowRight,
  AlertCircle,
  ExternalLink,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function StudentDashboard() {
  const [profile, setProfile] = useState<StudentProfileData | null>(null);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [profData, statsData] = await Promise.all([
        apiRequest<StudentProfileData>("/student/profile"),
        apiRequest<StudentStats>("/student/stats"),
      ]);
      setProfile(profData);
      setStats(statsData);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-48 bg-[#DFDDD6]/50 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-[#FFFFFF] border border-[#DFDDD6] rounded-[4px] animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-[4px] border border-[#DC2626]/20 bg-[#FEF2F2] space-y-3">
        <div className="flex items-center space-x-2 text-sm font-semibold text-[#DC2626]">
          <AlertCircle className="w-4 h-4" />
          <span>Error Loading Dashboard</span>
        </div>
        <p className="text-xs text-[#77756F]">{error}</p>
        <Button onClick={loadData} size="sm" variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  const completion = stats?.profileCompletionPercentage || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#191919]">
            Welcome, {profile?.fullName || "Student"}
          </h1>
          <p className="text-xs text-[#77756F] mt-1">
            {profile?.headline || "Engineering Student Portfolio &amp; Credentials"}
          </p>
        </div>
        <Link href="/dashboard/student/profile">
          <Button size="sm" variant="outline">
            <span>Edit Profile</span>
          </Button>
        </Link>
      </div>

      {/* Profile Completion Prompt if under 100% */}
      {completion < 100 && (
        <div className="p-5 rounded-[4px] border border-[#DFDDD6] bg-[#FFFFFF] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-[#191919]">Profile Completion: {completion}%</span>
              <span className="text-[11px] text-[#77756F]">({100 - completion}% remaining)</span>
            </div>
            <div className="w-full sm:w-64 h-2 bg-[#F2F0EA] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#5555A5] transition-all duration-300"
                style={{ width: `${completion}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-[#77756F] pt-1">
              Add your institution, bio, skills, and projects to increase visibility to recruiters.
            </p>
          </div>
          <Link href="/dashboard/student/profile">
            <Button size="sm" variant="accent">
              <span>Complete Profile</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      )}

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between text-xs text-[#77756F]">
            <span>Total Skills</span>
            <Sparkles className="w-4 h-4 text-[#5555A5]" />
          </div>
          <div className="mt-3 text-2xl font-semibold text-[#191919]">{stats?.skillsCount || 0}</div>
          <Link href="/dashboard/student/skills" className="mt-2 inline-flex items-center text-[11px] text-[#5555A5] hover:underline">
            Manage skills &rarr;
          </Link>
        </Card>

        <Card>
          <div className="flex items-center justify-between text-xs text-[#77756F]">
            <span>Projects</span>
            <FolderGit2 className="w-4 h-4 text-[#5555A5]" />
          </div>
          <div className="mt-3 text-2xl font-semibold text-[#191919]">{stats?.projectsCount || 0}</div>
          <Link href="/dashboard/student/projects" className="mt-2 inline-flex items-center text-[11px] text-[#5555A5] hover:underline">
            Manage projects &rarr;
          </Link>
        </Card>

        <Card>
          <div className="flex items-center justify-between text-xs text-[#77756F]">
            <span>Certificates</span>
            <Award className="w-4 h-4 text-[#5555A5]" />
          </div>
          <div className="mt-3 text-2xl font-semibold text-[#191919]">{stats?.certificatesCount || 0}</div>
          <Link href="/dashboard/student/certificates" className="mt-2 inline-flex items-center text-[11px] text-[#5555A5] hover:underline">
            Manage certificates &rarr;
          </Link>
        </Card>

        <Card>
          <div className="flex items-center justify-between text-xs text-[#77756F]">
            <span>Audit Status</span>
            <CheckCircle2 className="w-4 h-4 text-[#166534]" />
          </div>
          <div className="mt-3 text-2xl font-semibold text-[#166534]">Active</div>
          <p className="mt-2 text-[11px] text-[#77756F]">Real database record</p>
        </Card>
      </div>

      {/* Recent Projects and Credentials Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Projects</CardTitle>
              <Link href="/dashboard/student/projects" className="text-xs text-[#5555A5] hover:underline">
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {(!profile?.projects || profile.projects.length === 0) ? (
              <p className="text-xs text-[#77756F] py-4">No projects recorded yet. Add your engineering work to showcase your stack.</p>
            ) : (
              <div className="space-y-3">
                {profile.projects.slice(0, 3).map((proj) => (
                  <div key={proj.id} className="p-3 rounded-[3px] border border-[#DFDDD6] flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-[#191919]">{proj.title}</p>
                      <p className="text-[11px] text-[#77756F]">{proj.techStack || "General"}</p>
                    </div>
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-[#77756F] hover:text-[#191919]">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top Skills</CardTitle>
              <Link href="/dashboard/student/skills" className="text-xs text-[#5555A5] hover:underline">
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {(!profile?.skills || profile.skills.length === 0) ? (
              <p className="text-xs text-[#77756F] py-4">No skills registered yet. Add technical competencies to your profile.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.skills.slice(0, 8).map((skill) => (
                  <Badge key={skill.id} variant="secondary">
                    {skill.name} • {skill.proficiency.toLowerCase()}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
