"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { apiRequest, AuthResponse } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { AlertCircle, KeyRound } from "lucide-react";

export default function RegisterPage() {
  const { login } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"STUDENT" | "RECRUITER">("STUDENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDemoLogin = async (demoEmail: string, demoPass: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: demoEmail, password: demoPass }),
      });
      login(response);
    } catch (err: any) {
      setError(err.message || "Failed to log in with demo account.");
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-screen flex flex-col bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Create your <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">SkillChain</span> account
            </h1>
            <p className="text-xs text-slate-500">
              Select your role to start building or discovering verified talent
            </p>
          </div>

          {/* Demo Credentials Quick Access Banner */}
          <div className="p-4 rounded-[12px] bg-gradient-to-r from-indigo-50/90 via-purple-50/50 to-white border border-indigo-200/90 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center space-x-1.5">
                <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                <span>Demo Credentials Available</span>
              </span>
              <span className="text-[10px] text-indigo-700 font-semibold bg-indigo-100/80 px-2 py-0.5 rounded-full">
                1-Click Sign In
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Skip registration and instantly test any role with pre-configured demo workspaces:
            </p>
            <div className="grid grid-cols-3 gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => handleDemoLogin("student@skillchain.edu", "Password@123")}
                className="p-2.5 rounded-[8px] border border-emerald-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-left transition-all shadow-xs group"
                title="Login as Alex Chen: student@skillchain.edu / Password@123"
              >
                <div className="text-xs font-bold text-emerald-800 group-hover:text-emerald-900">Student</div>
                <div className="text-[10px] text-slate-500 font-mono truncate mt-0.5">student@skillchain.edu</div>
                <div className="text-[9px] text-slate-400 font-mono mt-0.5">Password@123</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin("recruiter@skillchain.com", "Password@123")}
                className="p-2.5 rounded-[8px] border border-indigo-200 bg-white hover:bg-indigo-50 hover:border-indigo-300 text-left transition-all shadow-xs group"
                title="Login as Sarah Connor: recruiter@skillchain.com / Password@123"
              >
                <div className="text-xs font-bold text-indigo-800 group-hover:text-indigo-900">Recruiter</div>
                <div className="text-[10px] text-slate-500 font-mono truncate mt-0.5">recruiter@skillchain.com</div>
                <div className="text-[9px] text-slate-400 font-mono mt-0.5">Password@123</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin("admin@skillchain.com", "Admin@SkillChain123")}
                className="p-2.5 rounded-[8px] border border-purple-200 bg-white hover:bg-purple-50 hover:border-purple-300 text-left transition-all shadow-xs group"
                title="Login as Platform Administrator: admin@skillchain.com / Admin@SkillChain123"
              >
                <div className="text-xs font-bold text-purple-800 group-hover:text-purple-900">Admin</div>
                <div className="text-[10px] text-slate-500 font-mono truncate mt-0.5">admin@skillchain.com</div>
                <div className="text-[9px] text-slate-400 font-mono mt-0.5">Admin@SkillChain123</div>
              </button>
            </div>
          </div>

          <Card className="rounded-[12px] border-slate-200 shadow-lg shadow-indigo-500/5 bg-white/95 backdrop-blur-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-[6px] bg-rose-50 border border-rose-200 flex items-start space-x-2 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Role Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  I want to join as:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("STUDENT")}
                    className={`px-3 py-2.5 rounded-[8px] border text-left transition-all ${
                      role === "STUDENT"
                        ? "border-indigo-500 bg-indigo-50/80 text-indigo-900 ring-2 ring-indigo-500/20 shadow-xs"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900">Student / Graduate</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Showcase verified skills &amp; projects</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("RECRUITER")}
                    className={`px-3 py-2.5 rounded-[8px] border text-left transition-all ${
                      role === "RECRUITER"
                        ? "border-indigo-500 bg-indigo-50/80 text-indigo-900 ring-2 ring-indigo-500/20 shadow-xs"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900">Recruiter / Employer</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Discover verified engineering talent</div>
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

              <Button type="submit" loading={loading} className="w-full mt-2" size="md">
                Register as {role === "STUDENT" ? "Student" : "Recruiter"}
              </Button>
            </form>
          </Card>

          <p className="text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
