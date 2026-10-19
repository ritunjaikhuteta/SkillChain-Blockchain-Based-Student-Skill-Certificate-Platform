"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { SkillChainLogo } from "./SkillChainLogo";
import {
  LayoutDashboard,
  User,
  Sparkles,
  FolderGit2,
  Award,
  Compass,
  Network,
  Search,
  SlidersHorizontal,
  Blocks,
  LogOut,
  Settings,
  BookmarkCheck,
  ShieldCheck,
  Building2,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) return null;

  const studentLinks = [
    { label: "Dashboard", href: "/dashboard/student", icon: LayoutDashboard },
    { label: "Profile", href: "/dashboard/student/profile", icon: User },
    { label: "Certificates", href: "/dashboard/student/certificates", icon: Award },
    { label: "Skills", href: "/dashboard/student/skills", icon: Sparkles },
    { label: "Projects", href: "/dashboard/student/projects", icon: FolderGit2 },
    { label: "Recommendations", href: "/dashboard/student/recommendations", icon: Compass },
    { label: "3D Skill Network", href: "/dashboard/student/network", icon: Network },
    { label: "Settings", href: "/dashboard/student/profile#settings", icon: Settings },
  ];

  const recruiterLinks = [
    { label: "Dashboard", href: "/dashboard/recruiter", icon: LayoutDashboard },
    { label: "Search Students", href: "/dashboard/recruiter/search", icon: Search },
    { label: "Saved Candidates", href: "/dashboard/recruiter#saved", icon: BookmarkCheck },
    { label: "Verify Certificates", href: "/verify", icon: ShieldCheck },
    { label: "Settings", href: "/dashboard/recruiter#settings", icon: Settings },
  ];

  const adminLinks = [
    { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Skill Management", href: "/dashboard/admin/skills", icon: SlidersHorizontal },
    { label: "Blockchain Status", href: "/dashboard/admin/blockchain", icon: Blocks },
    { label: "Verify Certificates", href: "/verify", icon: ShieldCheck },
    { label: "Settings", href: "/dashboard/admin#settings", icon: Settings },
  ];

  const isRecruiterRoute = pathname.startsWith("/dashboard/recruiter");
  const isStudentRoute = pathname.startsWith("/dashboard/student");
  const isAdminRoute = pathname.startsWith("/dashboard/admin");

  const effectiveRole = isRecruiterRoute
    ? "RECRUITER"
    : isStudentRoute
    ? "STUDENT"
    : isAdminRoute
    ? "ADMIN"
    : user.role;

  const links =
    effectiveRole === "RECRUITER"
      ? recruiterLinks
      : effectiveRole === "ADMIN"
      ? adminLinks
      : studentLinks;

  return (
    <aside className="w-64 bg-[#080E1E] text-slate-300 min-h-screen flex flex-col justify-between py-6 px-4 border-r border-[#15203B] shrink-0 select-none">
      <div className="space-y-6">
        {/* Recruiter Portal Banner if recruiter route or role */}
        {effectiveRole === "RECRUITER" && (
          <div className="px-3 py-1.5 rounded-lg bg-blue-950/60 border border-blue-500/20 flex items-center space-x-2 text-xs font-semibold text-blue-400">
            <Building2 className="w-3.5 h-3.5" />
            <span>Recruiter Portal</span>
          </div>
        )}

        {/* SkillChain Brand Logo */}
        <div className="px-3 pb-2">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
            <SkillChainLogo size={28} showText isDark={true} />
          </Link>
        </div>

        {/* Navigation items */}
        <nav className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href ||
              (link.href !== "/dashboard/student" &&
                link.href !== "/dashboard/recruiter" &&
                link.href !== "/dashboard/admin" &&
                pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors shrink-0 ${
                    isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                  }`}
                />
                <span className="truncate">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Profile & Logout */}
      <div className="pt-4 border-t border-[#15203B] space-y-3">
        <div className="px-3 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-blue-500/30 shrink-0">
            {user.fullName ? user.fullName[0].toUpperCase() : "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">{user.fullName}</p>
            <p className="text-[10px] text-slate-400 capitalize truncate">{user.role.toLowerCase()}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 rounded-xl hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
