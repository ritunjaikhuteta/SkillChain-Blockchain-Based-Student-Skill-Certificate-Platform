"use client";

import React, { useEffect, useState } from "react";
import { apiRequest, StudentProfileData } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { AlertCircle, CheckCircle, ExternalLink, Github, Linkedin, Globe, MapPin, Building, GraduationCap } from "lucide-react";

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form fields
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<StudentProfileData>("/student/profile");
      setProfile(data);
      setHeadline(data.headline || "");
      setBio(data.bio || "");
      setPhone(data.phone || "");
      setLocation(data.location || "");
      setInstitution(data.institution || "");
      setDegree(data.degree || "");
      setGraduationYear(data.graduationYear || "");
      setGithubUrl(data.githubUrl || "");
      setLinkedinUrl(data.linkedinUrl || "");
      setPortfolioUrl(data.portfolioUrl || "");
    } catch (err: any) {
      setError(err.message || "Failed to load student profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const updated = await apiRequest<StudentProfileData>("/student/profile", {
        method: "PUT",
        body: JSON.stringify({
          headline,
          bio,
          phone,
          location,
          institution,
          degree,
          graduationYear,
          githubUrl,
          linkedinUrl,
          portfolioUrl,
        }),
      });
      setProfile(updated);
      setSuccess("Profile information updated successfully.");
    } catch (err: any) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-48 bg-[#DFDDD6]/50 rounded animate-pulse"></div>
        <div className="h-96 bg-[#FFFFFF] border border-[#DFDDD6] rounded-[4px] animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#191919]">
            My Engineering Profile
          </h1>
          <p className="text-xs text-[#77756F] mt-1">
            Maintain your academic credentials, technical bio, and portfolio links.
          </p>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-[4px] bg-[#F0FDF4] border border-[#DCFCE7] flex items-center space-x-2 text-xs text-[#166534]">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-[4px] bg-[#FEF2F2] border border-[#FEE2E2] flex items-center space-x-2 text-xs text-[#B91C1C]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Identity & Headline */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Identity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#77756F] mb-1">Full Name</label>
                <div className="text-sm font-semibold text-[#191919]">{profile?.fullName}</div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#77756F] mb-1">Account Email</label>
                <div className="text-sm text-[#77756F] font-mono">{profile?.email}</div>
              </div>
            </div>

            <Input
              label="Professional Headline"
              placeholder="e.g. Distributed Systems Engineer | CS @ Stanford 2026"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
            />

            <Textarea
              label="Technical Bio / Summary"
              placeholder="Describe your engineering focus, key frameworks, and background..."
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Academic & Location Details */}
        <Card>
          <CardHeader>
            <CardTitle>Education &amp; Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Institution / University"
                placeholder="e.g. Stanford University"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
              />

              <Input
                label="Degree / Major"
                placeholder="e.g. B.S. Computer Science"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Graduation Year"
                placeholder="2026"
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
              />

              <Input
                label="Location / City"
                placeholder="e.g. San Francisco, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />

              <Input
                label="Phone Contact"
                placeholder="+1 (555) 019-2834"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Links & Profiles */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio &amp; External Verification Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="GitHub Profile URL"
              placeholder="https://github.com/username"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
            />

            <Input
              label="LinkedIn Profile URL"
              placeholder="https://linkedin.com/in/username"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
            />

            <Input
              label="Portfolio / Personal Website"
              placeholder="https://yourportfolio.dev"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-3">
          <Button type="submit" loading={saving} size="md">
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
