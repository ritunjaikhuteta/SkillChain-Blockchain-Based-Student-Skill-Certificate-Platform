import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import { SkillNetworkHero } from "@/components/SkillNetworkHero";
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
    <div className="min-h-screen flex flex-col bg-[#F8F7F3] text-[#191919] selection:bg-[#5555A5]/15 selection:text-[#191919]">
      <Navbar />

      {/* --- HERO SECTION: Split Editorial Composition --- */}
      <section className="pt-12 sm:pt-16 pb-20 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Typography & Intentional Copy */}
          <div className="lg:col-span-5 flex flex-col items-start space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-[3px] bg-[#FFFFFF] border border-[#DFDDD6] text-xs font-medium text-[#77756F]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5555A5]"></span>
              <span>Cryptographic Credential &amp; Talent Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold tracking-tight text-[#191919] leading-[1.08]">
              Your skills deserve proof.
            </h1>

            <p className="text-base text-[#77756F] font-normal leading-relaxed max-w-lg">
              SkillChain pairs verifiable student project portfolios with an educational SHA-256
              cryptographic ledger and graph algorithms—giving engineering recruiters tamper-evident proof
              of actual technical competence.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto font-medium">
                  <span>Build Your Portfolio</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/dashboard/recruiter/search">
                <Button variant="outline" size="lg" className="w-full sm:w-auto font-medium">
                  <Search className="w-4 h-4 mr-2 text-[#5555A5]" />
                  <span>Explore Talent</span>
                </Button>
              </Link>
            </div>

            {/* Micro Editorial Details */}
            <div className="pt-4 grid grid-cols-2 gap-4 border-t border-[#DFDDD6] w-full text-xs text-[#77756F]">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#5555A5] flex-shrink-0" />
                <span>SHA-256 Hash Auditing</span>
              </div>
              <div className="flex items-center space-x-2">
                <Network className="w-4 h-4 text-[#5555A5] flex-shrink-0" />
                <span>Dijkstra Shortest Paths</span>
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
      <section className="py-20 px-6 border-t border-[#DFDDD6] bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="max-w-2xl mb-16">
            <span className="font-mono text-xs uppercase tracking-wider text-[#5555A5] font-semibold">
              ARCHITECTURE &amp; VERIFICATION
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-[#191919]">
              Engineered for authentic engineering evidence.
            </h2>
            <p className="mt-3 text-sm text-[#77756F] leading-relaxed">
              Resumes and keyword stuffing fail both applicants and technical hiring managers.
              SkillChain enforces mathematical integrity across every layer of evaluation.
            </p>
          </div>

          {/* Asymmetric 3-Column Editorial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1: Cryptographic Ledger */}
            <div className="p-7 rounded-[4px] border border-[#DFDDD6] bg-[#FDFCFB] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-9 h-9 rounded-[3px] bg-[#FFFFFF] border border-[#DFDDD6] flex items-center justify-center text-[#5555A5]">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold text-[#191919]">Cryptographic Ledger</h3>
                <p className="text-xs text-[#77756F] leading-relaxed">
                  Certificates are deterministically hashed via SHA-256 canonical serialization and
                  anchored in sequentially linked blocks. Modifying any past record breaks hash
                  continuity and is detected instantly during validation audits.
                </p>
              </div>
              <div className="pt-4 border-t border-[#DFDDD6] font-mono text-[11px] text-[#77756F] flex items-center justify-between">
                <span>CHAIN INTEGRITY</span>
                <span className="text-[#191919] font-medium">TAMPER-EVIDENT</span>
              </div>
            </div>

            {/* Pillar 2: Server-Side Graph Algorithms */}
            <div className="p-7 rounded-[4px] border border-[#DFDDD6] bg-[#FDFCFB] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-9 h-9 rounded-[3px] bg-[#FFFFFF] border border-[#DFDDD6] flex items-center justify-center text-[#5555A5]">
                  <GitBranch className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold text-[#191919]">Graph-Based Reasoning</h3>
                <p className="text-xs text-[#77756F] leading-relaxed">
                  Skills, projects, and technologies are modeled as weighted topological graphs.
                  BFS and DFS explore skill adjacency, while Dijkstra's algorithm computes the
                  shortest learning pathway connecting related engineering competencies.
                </p>
              </div>
              <div className="pt-4 border-t border-[#DFDDD6] font-mono text-[11px] text-[#77756F] flex items-center justify-between">
                <span>ALGORITHMS</span>
                <span className="text-[#191919] font-medium">BFS • DFS • DIJKSTRA</span>
              </div>
            </div>

            {/* Pillar 3: Deterministic Candidate Ranking */}
            <div className="p-7 rounded-[4px] border border-[#DFDDD6] bg-[#FDFCFB] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-9 h-9 rounded-[3px] bg-[#FFFFFF] border border-[#DFDDD6] flex items-center justify-center text-[#5555A5]">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold text-[#191919]">4-Tier Match Formula</h3>
                <p className="text-xs text-[#77756F] leading-relaxed">
                  Candidate ranking operates on an exact formula: 50% Skill Coverage, 25% Proficiency
                  Depth, 15% Project Relevance, and 10% Blockchain-Verified Certificates, producing
                  deterministic score breakdowns with zero keyword gaming.
                </p>
              </div>
              <div className="pt-4 border-t border-[#DFDDD6] font-mono text-[11px] text-[#77756F] flex items-center justify-between">
                <span>WEIGHT FORMULA</span>
                <span className="text-[#191919] font-medium">50 / 25 / 15 / 10 %</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3-STEP EDITORIAL WORKFLOW --- */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-wider text-[#77756F] font-semibold">
            SYSTEM WORKFLOW
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-[#191919]">
            From demonstration to verifiable discovery
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="p-7 rounded-[4px] border border-[#DFDDD6] bg-[#FFFFFF] space-y-4">
            <span className="font-mono text-xs text-[#5555A5] font-semibold">01 // BUILD &amp; DOCUMENT</span>
            <h3 className="text-base font-semibold text-[#191919]">Document Proof of Work</h3>
            <p className="text-xs text-[#77756F] leading-relaxed">
              Students link GitHub codebases, production deployments, and technical stack details.
              Each skill is backed by real project implementation evidence.
            </p>
          </div>

          <div className="p-7 rounded-[4px] border border-[#DFDDD6] bg-[#FFFFFF] space-y-4">
            <span className="font-mono text-xs text-[#5555A5] font-semibold">02 // CRYPTOGRAPHIC ANCHORING</span>
            <h3 className="text-base font-semibold text-[#191919]">Anchor Verified Certificates</h3>
            <p className="text-xs text-[#77756F] leading-relaxed">
              Uploaded certificate PDFs and credential IDs are verified by magic-byte content inspection,
              hashed via SHA-256, and permanently recorded to the audit ledger.
            </p>
          </div>

          <div className="p-7 rounded-[4px] border border-[#DFDDD6] bg-[#FFFFFF] space-y-4">
            <span className="font-mono text-xs text-[#5555A5] font-semibold">03 // ALGORITHMIC MATCHING</span>
            <h3 className="text-base font-semibold text-[#191919]">Discover Confirmed Talent</h3>
            <p className="text-xs text-[#77756F] leading-relaxed">
              Recruiters query target technology stacks. Candidates are deterministically ranked
              with detailed match explanations and clear identification of missing skills.
            </p>
          </div>
        </div>
      </section>

      {/* --- DEDICATED PERSPECTIVES: Students & Engineering Teams --- */}
      <section className="py-20 px-6 border-t border-[#DFDDD6] bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Student Perspective Card */}
            <div className="p-8 sm:p-10 rounded-[6px] border border-[#DFDDD6] bg-[#FCFCFB] flex flex-col justify-between space-y-8">
              <div className="space-y-5">
                <div className="inline-flex items-center space-x-2 text-xs font-semibold text-[#5555A5] font-mono">
                  <GraduationCap className="w-4 h-4" />
                  <span>FOR STUDENTS &amp; APPLICANTS</span>
                </div>
                <h3 className="text-2xl font-semibold tracking-tight text-[#191919]">
                  Stand out with verifiable code, not formatted PDF claims.
                </h3>
                <p className="text-xs sm:text-sm text-[#77756F] leading-relaxed">
                  Avoid getting lost in ATS keyword filters. SkillChain allows you to present a
                  cohesive engineering portfolio where skills link to live projects, certificates
                  are backed by SHA-256 fingerprints, and recommendations reveal your next best learning path.
                </p>
                <ul className="space-y-2 text-xs text-[#77756F] pt-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5555A5] flex-shrink-0" />
                    <span>Personalized Dijkstra learning pathways for career advancement</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5555A5] flex-shrink-0" />
                    <span>Public certificate verification URLs you can share on GitHub and LinkedIn</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5555A5] flex-shrink-0" />
                    <span>Interactive 3D visualization of your personal technical network</span>
                  </li>
                </ul>
              </div>
              <div>
                <Link href="/register">
                  <Button size="md" className="font-medium">
                    <span>Create Student Account</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Recruiter Perspective Card */}
            <div className="p-8 sm:p-10 rounded-[6px] border border-[#DFDDD6] bg-[#FCFCFB] flex flex-col justify-between space-y-8">
              <div className="space-y-5">
                <div className="inline-flex items-center space-x-2 text-xs font-semibold text-[#5555A5] font-mono">
                  <Briefcase className="w-4 h-4" />
                  <span>FOR RECRUITERS &amp; ENGINEERING MANAGERS</span>
                </div>
                <h3 className="text-2xl font-semibold tracking-tight text-[#191919]">
                  Zero resume inflation. Deterministic candidate ranking.
                </h3>
                <p className="text-xs sm:text-sm text-[#77756F] leading-relaxed">
                  Target exact engineering stacks like Java 21, Spring Boot, MySQL, and Docker.
                  Instantly receive candidates scored deterministically across coverage, proficiency depth,
                  and verified credentials—complete with exact missing skills analysis.
                </p>
                <ul className="space-y-2 text-xs text-[#77756F] pt-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5555A5] flex-shrink-0" />
                    <span>Formulaic scoring without black-box or non-deterministic hallucinations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5555A5] flex-shrink-0" />
                    <span>Instant inspection of repository URLs, live demos, and credential records</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5555A5] flex-shrink-0" />
                    <span>Search students directly by validated toolchains and verified competencies</span>
                  </li>
                </ul>
              </div>
              <div>
                <Link href="/dashboard/recruiter/search">
                  <Button variant="outline" size="md" className="font-medium">
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
        <div className="p-8 sm:p-10 rounded-[6px] border border-[#DFDDD6] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-md">
              <div className="inline-flex items-center space-x-1.5 text-xs font-mono text-[#5555A5] font-semibold">
                <FileCheck2 className="w-4 h-4" />
                <span>PUBLIC VERIFICATION PORTAL</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-[#191919]">
                Verify a certificate on the SHA-256 Ledger
              </h3>
              <p className="text-xs text-[#77756F] leading-relaxed">
                Check any issued credential ID or certificate fingerprint against our immutable
                chain records without requiring an account or exposing private student data.
              </p>
            </div>
            <div>
              <Link href="/verify">
                <Button size="md" className="w-full sm:w-auto font-medium">
                  <ShieldCheck className="w-4 h-4 mr-2 text-[#5555A5]" />
                  <span>Open Verification Tool</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- FINAL EDITORIAL ACTION CALL --- */}
      <section className="py-20 px-6 border-t border-[#DFDDD6] bg-[#FFFFFF] text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#191919]">
            Begin building your verified engineering profile today.
          </h2>
          <p className="text-xs sm:text-sm text-[#77756F] leading-relaxed">
            Join SkillChain as an aspiring engineer to anchor your achievements, or as a
            talent partner to source mathematically confirmed capability.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register">
              <Button size="md" className="w-full sm:w-auto font-medium">
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

      {/* --- MINIMAL EDITORIAL FOOTER --- */}
      <footer className="py-10 px-6 border-t border-[#DFDDD6] bg-[#F8F7F3] text-xs text-[#77756F]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-[3px] bg-[#191919] text-white flex items-center justify-center text-[10px] font-semibold">
              S
            </div>
            <span className="font-semibold text-[#191919]">SkillChain</span>
            <span className="text-[#DFDDD6]">|</span>
            <span>Educational SHA-256 Cryptographic Talent Ledger</span>
          </div>

          <div className="flex flex-wrap items-center space-x-6 text-xs">
            <Link href="/verify" className="hover:text-[#191919] transition-colors">
              Certificate Verification
            </Link>
            <Link href="/dashboard/recruiter/search" className="hover:text-[#191919] transition-colors">
              Talent Search
            </Link>
            <Link href="/login" className="hover:text-[#191919] transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="hover:text-[#191919] transition-colors">
              Get Started
            </Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-[#DFDDD6]/70 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#77756F]">
          <p>&copy; {new Date().getFullYear()} SkillChain Platform. Designed for verified engineering competence.</p>
          <p className="mt-2 sm:mt-0">Java 21 • Spring Boot 3.3.4 • Next.js 14 • SHA-256 Cryptographic Verification</p>
        </div>
      </footer>
    </div>
  );
}
