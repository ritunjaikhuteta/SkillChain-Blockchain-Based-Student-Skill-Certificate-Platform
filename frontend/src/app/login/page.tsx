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

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Please provide both email and password");
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      login(response);
    } catch (err: any) {
      setError(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Sign in to <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">SkillChain</span>
            </h1>
            <p className="text-xs text-slate-500">
              Enter your credentials to access your verified workspace
            </p>
          </div>

          <Card className="rounded-[12px] border-slate-200 shadow-lg shadow-indigo-500/5 bg-white/90 backdrop-blur-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-[6px] bg-rose-50 border border-rose-200 flex items-start space-x-2 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              <Input
                label="Email Address"
                type="email"
                placeholder="you@institution.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />

              <Button type="submit" loading={loading} className="w-full mt-2" size="md">
                Sign In
              </Button>

              {/* Demo Credentials Quick Fill */}
              <div className="pt-3 border-t border-slate-200/90 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center space-x-1">
                    <KeyRound className="w-3 h-3 text-indigo-600" />
                    <span>Demo Credentials</span>
                  </span>
                  <span className="text-[10px] text-indigo-600 font-medium">Click to fill</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail("student@skillchain.edu");
                      setPassword("Password@123");
                    }}
                    className="p-2 rounded-[6px] border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-all group shadow-xs"
                    title="Student: student@skillchain.edu / Password@123"
                  >
                    <div className="text-[11px] font-bold text-slate-800 group-hover:text-emerald-700">Student</div>
                    <div className="text-[9px] text-slate-500 truncate mt-0.5">Alex Chen</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEmail("recruiter@skillchain.com");
                      setPassword("Password@123");
                    }}
                    className="p-2 rounded-[6px] border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 text-left transition-all group shadow-xs"
                    title="Recruiter: recruiter@skillchain.com / Password@123"
                  >
                    <div className="text-[11px] font-bold text-slate-800 group-hover:text-indigo-700">Recruiter</div>
                    <div className="text-[9px] text-slate-500 truncate mt-0.5">Sarah C.</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEmail("admin@skillchain.com");
                      setPassword("Admin@SkillChain123");
                    }}
                    className="p-2 rounded-[6px] border border-slate-200 bg-slate-50 hover:bg-purple-50 hover:border-purple-300 text-left transition-all group shadow-xs"
                    title="Admin: admin@skillchain.com / Admin@SkillChain123"
                  >
                    <div className="text-[11px] font-bold text-slate-800 group-hover:text-purple-700">Admin</div>
                    <div className="text-[9px] text-slate-500 truncate mt-0.5">Root Admin</div>
                  </button>
                </div>
              </div>
            </form>
          </Card>

          <p className="text-center text-xs text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-700 underline underline-offset-4">
              Register here
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
