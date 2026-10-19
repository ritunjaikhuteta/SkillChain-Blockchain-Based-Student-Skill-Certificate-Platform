"use client";

import React from "react";
import Link from "next/link";
import { SkillChainLogo } from "@/components/SkillChainLogo";
import { HeroIllustration } from "@/components/HeroIllustration";
import {
  ShieldCheck,
  Sparkles,
  Network,
  FolderGit2,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Lock,
  Layers,
  Search,
  ExternalLink,
  ChevronRight,
  Code2,
  Award,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#060B18] text-white selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      {/* Background ambient cosmic glow spheres */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-32 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* --- NAVBAR MATCHING SCREEN 1 --- */}
      <header className="sticky top-0 z-40 w-full border-b border-[#15203B]/80 bg-[#060B18]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-2.5 hover:opacity-90 transition-opacity">
            <SkillChainLogo size={32} showText isDark={true} />
          </Link>

          {/* Navigation Links matching Screen 1: Home, Features, About, Contact */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <Link href="/" className="text-white hover:text-blue-400 transition-colors">
              Home
            </Link>
            <Link href="#features" className="hover:text-blue-400 transition-colors">
              Features
            </Link>
            <Link href="#about" className="hover:text-blue-400 transition-colors">
              About
            </Link>
            <Link href="#contact" className="hover:text-blue-400 transition-colors">
              Contact
            </Link>
            <Link href="/verify" className="text-blue-400 hover:text-blue-300 flex items-center space-x-1.5 transition-colors">
              <ShieldCheck className="w-4 h-4" />
              <span>Verify</span>
            </Link>
          </nav>

          {/* Right Action Buttons: Login, Sign Up */}
          <div className="flex items-center space-x-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-indigo-500 active:scale-95 transition-all"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* --- HERO SECTION MATCHING SCREEN 1 --- */}
      <section className="pt-12 sm:pt-20 pb-20 px-6 max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Subtitle, CTAs, 4 Feature Pills */}
          <div className="lg:col-span-6 flex flex-col items-start space-y-6">
            {/* Bold Headline (Exact match to Screen 1) */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-white leading-[1.12]">
              Your Skills.
              <br />
              Your Certificates.
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Your Future.
              </span>
            </h1>

            {/* Subtitle paragraph (Exact match to Screen 1) */}
            <p className="text-base sm:text-lg text-slate-400 font-normal leading-relaxed max-w-xl">
              SkillChain is a secure and intelligent platform that helps students showcase their
              skills, verify their certificates, and get personalized recommendations for a better
              future.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <Link href="/register">
                <button className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm sm:text-base shadow-xl shadow-blue-600/30 hover:shadow-blue-600/45 hover:from-blue-500 hover:to-indigo-500 active:scale-95 transition-all flex items-center justify-center space-x-2">
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>

              <Link href="#features">
                <button className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#0E172E] border border-[#1E2E52] text-slate-300 font-medium text-sm sm:text-base hover:text-white hover:bg-[#152345] hover:border-blue-500/40 transition-all flex items-center justify-center">
                  <span>Learn More</span>
                </button>
              </Link>
            </div>

            {/* 4 Feature Pills Row (Exact match to Screen 1) */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full border-t border-[#15203B]/80 text-xs">
              <div className="flex items-center space-x-2 py-1 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="font-medium truncate">Blockchain Verification</span>
              </div>

              <div className="flex items-center space-x-2 py-1 text-slate-300">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="font-medium truncate">Smart Recommendations</span>
              </div>

              <div className="flex items-center space-x-2 py-1 text-slate-300">
                <Network className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="font-medium truncate">3D Skill Network</span>
              </div>

              <div className="flex items-center space-x-2 py-1 text-slate-300">
                <FolderGit2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium truncate">Complete Portfolio</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Graphic matching Screen 1 */}
          <div className="lg:col-span-6 w-full flex justify-center">
            <HeroIllustration />
          </div>
        </div>
      </section>

      {/* --- PLATFORM WORKSPACE PREVIEWS --- */}
      <section id="features" className="py-20 px-6 border-t border-[#15203B] bg-[#080E20]/50 relative">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider">
              Comprehensive Platform
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Engineered for Students and Recruiters
            </h2>
            <p className="text-sm text-slate-400">
              Explore interactive student portfolios, cryptographic verification, and graph-powered talent matching.
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: 3D Skill Network */}
            <div className="bg-[#0B1328] border border-[#1A284A] rounded-2xl p-6 space-y-4 hover:border-blue-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                <Network className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">3D Skill Network</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Explore an interactive orbital graph of your technical competencies. Identify graph-shortest paths and prerequisites for your dream role.
              </p>
              <Link
                href="/dashboard/student/network"
                className="inline-flex items-center text-xs font-semibold text-blue-400 hover:text-blue-300 space-x-1"
              >
                <span>Launch 3D Network</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 2: Tamper-Evident Ledger */}
            <div className="bg-[#0B1328] border border-[#1A284A] rounded-2xl p-6 space-y-4 hover:border-emerald-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Cryptographic Verification</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Instant SHA-256 block hash auditing and QR code scanning. Give recruiters absolute trust that your certificates cannot be forged.
              </p>
              <Link
                href="/verify"
                className="inline-flex items-center text-xs font-semibold text-emerald-400 hover:text-emerald-300 space-x-1"
              >
                <span>Verify Certificates</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 3: Recruiter Candidate Search */}
            <div className="bg-[#0B1328] border border-[#1A284A] rounded-2xl p-6 space-y-4 hover:border-purple-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Recruiter Talent Search</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Filter engineering candidates by validated skills, degree, and graduation year with weighted algorithmic match scores.
              </p>
              <Link
                href="/dashboard/recruiter/search"
                className="inline-flex items-center text-xs font-semibold text-purple-400 hover:text-purple-300 space-x-1"
              >
                <span>Find Candidates</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer id="contact" className="py-12 px-6 border-t border-[#15203B] bg-[#040814] text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <SkillChainLogo size={24} showText isDark={true} />
            <span>— Verified Student Skills &amp; Blockchain Platform</span>
          </div>

          <div className="flex items-center space-x-6 text-slate-400">
            <Link href="/verify" className="hover:text-white transition-colors">
              Verify
            </Link>
            <Link href="/dashboard/student" className="hover:text-white transition-colors">
              Student Portal
            </Link>
            <Link href="/dashboard/recruiter" className="hover:text-white transition-colors">
              Recruiter Portal
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              Sign In
            </Link>
          </div>

          <p>&copy; {new Date().getFullYear()} SkillChain. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
