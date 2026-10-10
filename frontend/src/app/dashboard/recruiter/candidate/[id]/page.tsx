"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiRequest, StudentProfileData } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowLeft,
  Mail,
  MapPin,
  Building,
  GraduationCap,
  Github,
  Linkedin,
  Globe,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  FolderGit2,
  Award,
  Sparkles,
} from "lucide-react";

export default function CandidateProfilePage() {
  const params = useParams();
  const profileId = params?.id;
  const [candidate, setCandidate] = useState<StudentProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profileId) return;
    apiRequest<StudentProfileData>(`/recruiter/students/${profileId}`)
      .then((data) => setCandidate(data))
      .catch((err) => setError(err.message || "Candidate profile not found"))
      .finally(() => setLoading(false));
  }, [profileId]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="h-6 w-32 bg-[#DFDDD6]/50 rounded animate-pulse"></div>
        <div className="h-64 bg-[#FFFFFF] border border-[#DFDDD6] rounded-[4px] animate-pulse"></div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="space-y-4 max-w-2xl">
        <Link href="/dashboard/recruiter/search">
          <Button size="sm" variant="outline">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>Back to Search</span>
          </Button>
        </Link>
        <div className="p-6 rounded-[4px] border border-[#DC2626]/20 bg-[#FEF2F2] space-y-2">
          <div className="flex items-center space-x-2 text-sm font-semibold text-[#DC2626]">
            <AlertCircle className="w-4 h-4" />
            <span>Profile Not Found</span>
          </div>
          <p className="text-xs text-[#77756F]">{error || "Candidate does not exist or has been removed."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <Link href="/dashboard/recruiter/search">
        <Button size="sm" variant="outline">
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          <span>Back to Candidate Directory</span>
        </Button>
      </Link>

      {/* Hero Dossier Card */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-semibold tracking-tight text-[#191919]">{candidate.fullName}</h1>
              <Badge variant="accent">Verified Student</Badge>
            </div>
            <p className="text-sm text-[#77756F] font-medium">{candidate.headline || "Engineering Student"}</p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#77756F] pt-2">
              {candidate.institution && (
                <span className="flex items-center space-x-1">
                  <Building className="w-3.5 h-3.5" />
                  <span>{candidate.institution}</span>
                </span>
              )}
              {candidate.degree && (
                <span className="flex items-center space-x-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{candidate.degree} {candidate.graduationYear ? `(${candidate.graduationYear})` : ""}</span>
                </span>
              )}
              {candidate.location && (
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{candidate.location}</span>
                </span>
              )}
              <span className="flex items-center space-x-1 font-mono">
                <Mail className="w-3.5 h-3.5" />
                <span>{candidate.email}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {candidate.githubUrl && (
              <a href={candidate.githubUrl} target="_blank" rel="noreferrer">
                <Button size="sm" variant="outline">
                  <Github className="w-3.5 h-3.5 mr-1.5" />
                  <span>GitHub</span>
                </Button>
              </a>
            )}
            {candidate.linkedinUrl && (
              <a href={candidate.linkedinUrl} target="_blank" rel="noreferrer">
                <Button size="sm" variant="outline">
                  <Linkedin className="w-3.5 h-3.5 mr-1.5" />
                  <span>LinkedIn</span>
                </Button>
              </a>
            )}
          </div>
        </div>

        {candidate.bio && (
          <div className="mt-6 pt-6 border-t border-[#DFDDD6] text-xs text-[#191919] leading-relaxed">
            <span className="font-semibold text-[#77756F] block mb-1">BIOGRAPHY &amp; SUMMARY</span>
            <p>{candidate.bio}</p>
          </div>
        )}
      </Card>

      {/* Verified Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#5555A5]" />
            <span>Verified Technical Skills ({candidate.skills?.length || 0})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(!candidate.skills || candidate.skills.length === 0) ? (
            <p className="text-xs text-[#77756F]">No skills listed.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {candidate.skills.map((skill) => (
                <div key={skill.id} className="p-3 rounded-[3px] border border-[#DFDDD6] bg-[#FFFFFF] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#191919]">{skill.name}</span>
                    <Badge variant="outline" className="text-[10px]">{skill.proficiency}</Badge>
                  </div>
                  <div className="text-[11px] text-[#77756F]">
                    {skill.category} • {skill.yearsOfExperience}y exp
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FolderGit2 className="w-4 h-4 text-[#5555A5]" />
            <span>Documented Projects ({candidate.projects?.length || 0})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(!candidate.projects || candidate.projects.length === 0) ? (
            <p className="text-xs text-[#77756F]">No projects documented.</p>
          ) : (
            <div className="space-y-4">
              {candidate.projects.map((proj) => (
                <div key={proj.id} className="p-4 rounded-[4px] border border-[#DFDDD6] bg-[#FFFFFF] space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-[#191919]">{proj.title}</h4>
                      <p className="text-[11px] text-[#77756F]">
                        {proj.startDate} {proj.endDate ? `- ${proj.endDate}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {proj.githubUrl && (
                        <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-[#77756F] hover:text-[#191919]">
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {proj.liveDemoUrl && (
                        <a href={proj.liveDemoUrl} target="_blank" rel="noreferrer" className="text-[#5555A5] hover:underline flex items-center text-xs">
                          <ExternalLink className="w-3.5 h-3.5 mr-1" />
                          <span>Demo</span>
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-[#77756F] leading-relaxed">{proj.description}</p>
                  {proj.techStack && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {proj.techStack.split(",").map((t, idx) => (
                        <Badge key={idx} variant="secondary" className="text-[10px]">
                          {t.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Certificates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-[#5555A5]" />
            <span>Attested Certificates ({candidate.certificates?.length || 0})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(!candidate.certificates || candidate.certificates.length === 0) ? (
            <p className="text-xs text-[#77756F]">No certificates registered.</p>
          ) : (
            <div className="space-y-3">
              {candidate.certificates.map((cert) => (
                <div key={cert.id} className="p-3 rounded-[3px] border border-[#DFDDD6] flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-semibold text-[#191919]">{cert.title}</h5>
                    <p className="text-[11px] text-[#77756F]">
                      {cert.issuingOrganization} • {cert.issueDate}
                      {cert.credentialId && ` • ID: ${cert.credentialId}`}
                    </p>
                  </div>
                  <Badge variant="accent">Attested</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
