"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/Button";
import { ShieldCheck, User as UserIcon, LogOut } from "lucide-react";
import { SkillChainLogo } from "./SkillChainLogo";

export function Navbar() {
  const { user, logout } = useAuth();

  const getRoleBadgeClass = (role?: string) => {
    switch (role) {
      case "STUDENT":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      case "RECRUITER":
        return "bg-blue-500/15 text-blue-400 border-blue-500/30";
      case "ADMIN":
        return "bg-purple-500/15 text-purple-400 border-purple-500/30";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#15203B] bg-[#060B18]/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2.5 hover:opacity-90 transition-opacity">
          <SkillChainLogo size={30} showText isDark={true} />
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-xs sm:text-sm font-medium text-slate-300">
          <Link
            href="/"
            className="hover:text-blue-400 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/verify"
            className="hover:text-blue-400 transition-colors flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-semibold">Verify Certificate</span>
          </Link>
          {user && (
            <Link
              href={
                user.role === "STUDENT"
                  ? "/dashboard/student"
                  : user.role === "RECRUITER"
                  ? "/dashboard/recruiter"
                  : "/dashboard/admin"
              }
              className="hover:text-blue-400 transition-colors font-medium text-slate-200"
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2 text-xs">
                <span className="text-white font-medium">{user.fullName}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getRoleBadgeClass(user.role)}`}>
                  {user.role}
                </span>
              </div>
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-xl border border-[#1E2E52] text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#152345] transition-colors flex items-center space-x-1.5"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-400" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <button className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  Sign In
                </button>
              </Link>
              <Link href="/register">
                <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/25 transition-all">
                  Get Started
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
