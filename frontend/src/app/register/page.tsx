"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { apiRequest, AuthResponse } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const { login } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"STUDENT" | "RECRUITER">("STUDENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          fullName,
          email,
          password,
          role,
        }),
      });
      login(response);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please verify your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F3]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-[#191919]">
              Create your SkillChain account
            </h1>
            <p className="text-xs text-[#77756F]">
              Select your role to start building or discovering verified talent
            </p>
          </div>

          <Card>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-[3px] bg-[#FEF2F2] border border-[#FEE2E2] flex items-start space-x-2 text-xs text-[#B91C1C]">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Role Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#191919]">
                  I want to join as:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("STUDENT")}
                    className={`px-3 py-2.5 rounded-[4px] border text-left transition-colors ${
                      role === "STUDENT"
                        ? "border-[#5555A5] bg-[#F0EFF8] text-[#191919]"
                        : "border-[#DFDDD6] bg-[#FFFFFF] text-[#77756F] hover:bg-[#F2F0EA]"
                    }`}
                  >
                    <div className="text-xs font-semibold">Student / Graduate</div>
                    <div className="text-[11px] text-[#77756F]">Showcase verified skills &amp; projects</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("RECRUITER")}
                    className={`px-3 py-2.5 rounded-[4px] border text-left transition-colors ${
                      role === "RECRUITER"
                        ? "border-[#5555A5] bg-[#F0EFF8] text-[#191919]"
                        : "border-[#DFDDD6] bg-[#FFFFFF] text-[#77756F] hover:bg-[#F2F0EA]"
                    }`}
                  >
                    <div className="text-xs font-semibold">Recruiter / Employer</div>
                    <div className="text-[11px] text-[#77756F]">Discover verified engineering talent</div>
                  </button>
                </div>
              </div>

              <Input
                label="Full Name"
                type="text"
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="jane@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button type="submit" loading={loading} className="w-full" size="md">
                Register as {role === "STUDENT" ? "Student" : "Recruiter"}
              </Button>
            </form>
          </Card>

          <p className="text-center text-xs text-[#77756F]">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-[#191919] hover:text-[#5555A5] underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
