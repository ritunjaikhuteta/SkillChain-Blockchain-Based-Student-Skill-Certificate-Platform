"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/Button";
import { ShieldCheck, User as UserIcon, LogOut } from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#DFDDD6] bg-[#FFFFFF]/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-[4px] bg-[#191919] flex items-center justify-center text-white font-semibold text-sm">
            S
          </div>
          <span className="font-semibold tracking-tight text-base text-[#191919]">SkillChain</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-xs font-medium text-[#77756F]">
          <Link href="/verify" className="hover:text-[#191919] transition-colors flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#5555A5]" />
            <span>Verify Certificate</span>
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
              className="hover:text-[#191919] transition-colors"
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3">
              <span className="hidden sm:inline-block text-xs text-[#77756F]">
                {user.fullName} <span className="text-[#5555A5]">({user.role})</span>
              </span>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="w-3.5 h-3.5 sm:mr-1.5" />
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
