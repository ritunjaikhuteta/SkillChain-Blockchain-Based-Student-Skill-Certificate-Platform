import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import { SkillNetworkHero } from "@/components/SkillNetworkHero";
import { SkillChainLogo } from "@/components/SkillChainLogo";
import {
  ShieldCheck,
  ArrowRight,
  GitBranch,
  Network,
  Search,
  CheckCircle2,
  Lock,
  Cpu,
  Terminal,
  FileCheck2,
  SlidersHorizontal,
  GraduationCap,
  Briefcase
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500/20 selection:text-indigo-900 relative overflow-x-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[520px] bg-gradient-to-b from-indigo-500/12 via-purple-500/6 to-transparent blur-3xl pointer-events-none -z-10" />

      <Navbar />

      {/* --- HERO SECTION: Split Editorial Composition --- */}
      <section className="pt-12 sm:pt-16 pb-20 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Typography & Intentional Copy */}
          <div className="lg:col-span-5 flex flex-col items-start space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/90 border border-indigo-200/80 text-xs font-medium text-slate-700 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 animate-pulse"></span>
              <span className="font-semibold text-indigo-900">Cryptographic Credential &amp; Talent Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-slate-900 leading-[1.08]">
              Your skills deserve{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                proof.
              </span>
            </h1>

            <p className="text-base text-slate-600 font-normal leading-relaxed max-w-lg">
              SkillChain pairs verifiable student project portfolios with an educational SHA-256
              cryptographic ledger and graph algorithms—giving engineering recruiters tamper-evident proof
              of actual technical competence.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto font-medium shadow-md shadow-indigo-500/20">
                  <Briefcase className="w-4 h-4 mr-2 text-indigo-200" />
                  <span>Build Your Portfolio</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/dashboard/recruiter/search">
                <Button variant="outline" size="lg" className="w-full sm:w-auto font-medium">
                  <Search className="w-4 h-4 mr-2 text-indigo-600" />
                  <span>Explore Talent</span>
                </Button>
              </Link>
            </div>

            {/* Micro Editorial Details */}
            <div className="pt-4 grid grid-cols-2 gap-4 border-t border-slate-200 w-full text-xs text-slate-600">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="font-medium">SHA-256 Hash Auditing</span>
              </div>
              <div className="flex items-center space-x-2">
                <Network className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <span className="font-medium">Dijkstra Shortest Paths</span>
              </div>
            </div>
          </div>

          {/* Right Column: Sophisticated Interactive Skill-Network Canvas */}
          <div className="lg:col-span-7 w-full">
            <SkillNetworkHero />
          </div>
        </div>
      </section>

      {/* --- PLATFORM ARCHITECTURE & PROOF PILLARS --- */}
      <section className="py-20 px-6 border-t border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="max-w-2xl mb-16">
            <span className="font-mono text-xs uppercase tracking-wider text-indigo-600 font-bold px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 inline-block">
              ARCHITECTURE &amp; VERIFICATION
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Engineered for authentic engineering evidence.
            </h2>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Resumes and keyword stuffing fail both applicants and technical hiring managers.
              SkillChain enforces mathematical integrity across every layer of evaluation.
            </p>
          </div>

          {/* Asymmetric 3-Column Editorial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1: Cryptographic Ledger */}
            <div className="p-7 rounded-[12px] border border-emerald-200/70 bg-gradient-to-b from-white to-emerald-50/20 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-[8px] bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Cryptographic Ledger</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Certificates are deterministically hashed via SHA-256 canonical serialization and
                  anchored in sequentially linked blocks. Modifying any past record breaks hash
                  continuity and is detected instantly during validation audits.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200/70 font-mono text-[11px] text-slate-500 flex items-center justify-between">
                <span>CHAIN INTEGRITY</span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200/60">
                  TAMPER-EVIDENT
                </span>
              </div>
            </div>

            {/* Pillar 2: Server-Side Graph Algorithms */}
            <div className="p-7 rounded-[12px] border border-indigo-200/70 bg-gradient-to-b from-white to-indigo-50/20 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-[8px] bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-xs">
                  <GitBranch className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Graph-Based Reasoning</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Skills, projects, and technologies are modeled as weighted topological graphs.
                  BFS and DFS explore skill adjacency, while Dijkstra&apos;s algorithm computes the
                  shortest learning pathway connecting related engineering competencies.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200/70 font-mono text-[11px] text-slate-500 flex items-center justify-between">
                <span>ALGORITHMS</span>
                <span className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full font-semibold border border-indigo-200/60">
                  BFS • DFS • DIJKSTRA
                </span>
              </div>
            </div>

            {/* Pillar 3: Deterministic Candidate Ranking */}
            <div className="p-7 rounded-[12px] border border-amber-200/70 bg-gradient-to-b from-white to-amber-50/20 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md hover:border-amber-300 transition-all">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-[8px] bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600 shadow-xs">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">4-Tier Match Formula</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Candidate ranking operates on an exact formula: 50% Skill Coverage, 25% Proficiency
                  Depth, 15% Project Relevance, and 10% Blockchain-Verified Certificates, producing
                  deterministic score breakdowns with zero keyword gaming.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200/70 font-mono text-[11px] text-slate-500 flex items-center justify-between">
                <span>WEIGHT FORMULA</span>
                <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full font-semibold border border-amber-200/60">
                  50 / 25 / 15 / 10 %
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3-STEP EDITORIAL WORKFLOW --- */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-wider text-indigo-600 font-bold px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 inline-block">
            SYSTEM WORKFLOW
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            From demonstration to verifiable discovery
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="p-7 rounded-[10px] border border-slate-200 bg-white space-y-4 shadow-sm hover:shadow-md hover:border-blue-300 transition-all">
            <span className="font-mono text-xs text-blue-600 font-bold px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200/70 inline-block">
              01 // BUILD &amp; DOCUMENT
            </span>
            <h3 className="text-base font-bold text-slate-900">Document Proof of Work</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Students link GitHub codebases, production deployments, and technical stack details.
              Each skill is backed by real project implementation evidence.
            </p>
          </div>

          <div className="p-7 rounded-[10px] border border-slate-200 bg-white space-y-4 shadow-sm hover:shadow-md hover:border-purple-300 transition-all">
            <span className="font-mono text-xs text-purple-600 font-bold px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200/70 inline-block">
              02 // CRYPTOGRAPHIC ANCHORING
            </span>
            <h3 className="text-base font-bold text-slate-900">Anchor Verified Certificates</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Uploaded certificate PDFs and credential IDs are verified by magic-byte content inspection,
              hashed via SHA-256, and permanently recorded to the audit ledger.
            </p>
          </div>

          <div className="p-7 rounded-[10px] border border-slate-200 bg-white space-y-4 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all">
            <span className="font-mono text-xs text-emerald-600 font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/70 inline-block">
              03 // ALGORITHMIC MATCHING
            </span>
            <h3 className="text-base font-bold text-slate-900">Discover Confirmed Talent</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Recruiters query target technology stacks. Candidates are deterministically ranked
              with detailed match explanations and clear identification of missing skills.
            </p>
          </div>
        </div>
      </section>

      {/* --- DEDICATED PERSPECTIVES: Students & Engineering Teams --- */}
      <section className="py-20 px-6 border-t border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Student Perspective Card */}
            <div className="p-8 sm:p-10 rounded-[12px] border border-indigo-200 bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/30 flex flex-col justify-between space-y-8 shadow-sm">
              <div className="space-y-5">
                <div className="inline-flex items-center space-x-2 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2.5 py-1 rounded-full font-mono">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  <span>FOR STUDENTS &amp; APPLICANTS</span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                  Stand out with verifiable code, not formatted PDF claims.
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Avoid getting lost in ATS keyword filters. SkillChain allows you to present a
                  cohesive engineering portfolio where skills link to live projects, certificates
                  are backed by SHA-256 fingerprints, and recommendations reveal your next best learning path.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-600 pt-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <span>Personalized Dijkstra learning pathways for career advancement</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <span>Public certificate verification URLs you can share on GitHub and LinkedIn</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <span>Interactive 3D visualization of your personal technical network</span>
                  </li>
                </ul>
              </div>
              <div>
                <Link href="/register">
                  <Button size="md" className="font-medium shadow-sm shadow-indigo-500/20">
                    <span>Create Student Account</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Recruiter Perspective Card */}
            <div className="p-8 sm:p-10 rounded-[12px] border border-cyan-200 bg-gradient-to-br from-white via-cyan-50/20 to-teal-50/30 flex flex-col justify-between space-y-8 shadow-sm">
              <div className="space-y-5">
                <div className="inline-flex items-center space-x-2 text-xs font-bold text-cyan-800 bg-cyan-50 border border-cyan-200/80 px-2.5 py-1 rounded-full font-mono">
                  <Briefcase className="w-4 h-4 text-cyan-600" />
                  <span>FOR RECRUITERS &amp; ENGINEERING MANAGERS</span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                  Zero resume inflation. Deterministic candidate ranking.
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Target exact engineering stacks like Java 21, Spring Boot, MySQL, and Docker.
                  Instantly receive candidates scored deterministically across coverage, proficiency depth,
                  and verified credentials—complete with exact missing skills analysis.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-600 pt-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Formulaic scoring without black-box or non-deterministic hallucinations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Instant inspection of repository URLs, live demos, and credential records</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Search students directly by validated toolchains and verified competencies</span>
                  </li>
                </ul>
              </div>
              <div>
                <Link href="/dashboard/recruiter/search">
                  <Button variant="outline" size="md" className="font-medium hover:border-cyan-400 hover:text-cyan-700">
                    <span>Search Candidates</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PUBLIC VERIFICATION QUICK TOOL --- */}
      <section className="py-16 px-6 max-w-4xl mx-auto w-full">
        <div className="p-8 sm:p-10 rounded-[14px] border border-indigo-200 bg-gradient-to-r from-indigo-50/90 via-purple-50/40 to-white shadow-md shadow-indigo-500/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-md">
              <div className="inline-flex items-center space-x-1.5 text-xs font-mono text-indigo-700 bg-indigo-100/70 border border-indigo-200 px-2.5 py-1 rounded-full font-bold">
                <FileCheck2 className="w-4 h-4 text-indigo-600" />
                <span>PUBLIC VERIFICATION PORTAL</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Verify a certificate on the SHA-256 Ledger
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Check any issued credential ID or certificate fingerprint against our immutable
                chain records without requiring an account or exposing private student data.
              </p>
            </div>
            <div>
              <Link href="/verify">
                <Button size="md" className="w-full sm:w-auto font-medium shadow-sm shadow-indigo-500/20">
                  <ShieldCheck className="w-4 h-4 mr-2 text-indigo-200" />
                  <span>Open Verification Tool</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- FINAL EDITORIAL ACTION CALL --- */}
      <section className="py-20 px-6 border-t border-slate-200/80 bg-white text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Begin building your verified engineering profile today.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Join SkillChain as an aspiring engineer to anchor your achievements, or as a
            talent partner to source mathematically confirmed capability.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register">
              <Button size="md" className="w-full sm:w-auto font-medium shadow-md shadow-indigo-500/20">
                <span>Create Student Account</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="md" className="w-full sm:w-auto font-medium">
                <span>Sign In to Platform</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- REFINED MODERN FOOTER --- */}
      <footer className="py-12 px-6 border-t border-slate-800 bg-slate-950 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2.5">
            <SkillChainLogo size={22} />
            <span className="font-bold text-white text-sm">SkillChain</span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400 text-xs">Educational SHA-256 Cryptographic Talent Ledger</span>
          </div>

          <div className="flex flex-wrap items-center space-x-6 text-xs font-medium">
            <Link href="/verify" className="hover:text-indigo-400 transition-colors">
              Certificate Verification
            </Link>
            <Link href="/dashboard/recruiter/search" className="hover:text-indigo-400 transition-colors">
              Talent Search
            </Link>
            <Link href="/login" className="hover:text-indigo-400 transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="hover:text-indigo-400 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <p>&copy; {new Date().getFullYear()} SkillChain Platform. Designed for verified engineering competence.</p>
          <p className="mt-2 sm:mt-0 font-mono text-[10px] text-slate-400">Java 21 • Spring Boot 3.3.4 • Next.js 14 • SHA-256 Cryptographic Verification</p>
        </div>
      </footer>
    </div>
  );
}
