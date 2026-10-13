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
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "RECRUITER":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "ADMIN":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-15 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2.5 hover:opacity-95 transition-opacity">
          <SkillChainLogo size={28} showText />
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-xs font-medium text-slate-600">
          <Link
            href="/verify"
            className="hover:text-indigo-600 transition-colors flex items-center space-x-1.5 px-2.5 py-1 rounded-full hover:bg-emerald-50/60"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-medium text-slate-700 hover:text-indigo-600">Verify Certificate</span>
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
              className="hover:text-indigo-600 transition-colors px-2.5 py-1 rounded-full hover:bg-indigo-50/60 font-medium text-slate-700"
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2 text-xs">
                <span className="text-slate-800 font-medium">{user.fullName}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getRoleBadgeClass(user.role)}`}>
                  {user.role}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="w-3.5 h-3.5 sm:mr-1.5 text-slate-500" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
