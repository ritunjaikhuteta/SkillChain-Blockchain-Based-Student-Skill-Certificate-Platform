"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
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
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) return null;

  const studentLinks = [
    { label: "Dashboard", href: "/dashboard/student", icon: LayoutDashboard },
    { label: "My Profile", href: "/dashboard/student/profile", icon: User },
    { label: "My Skills", href: "/dashboard/student/skills", icon: Sparkles },
    { label: "My Projects", href: "/dashboard/student/projects", icon: FolderGit2 },
    { label: "My Certificates", href: "/dashboard/student/certificates", icon: Award },
    { label: "Recommendations", href: "/dashboard/student/recommendations", icon: Compass },
    { label: "Skill Network", href: "/dashboard/student/network", icon: Network },
  ];

  const recruiterLinks = [
    { label: "Overview", href: "/dashboard/recruiter", icon: LayoutDashboard },
    { label: "Candidate Search", href: "/dashboard/recruiter/search", icon: Search },
  ];

  const adminLinks = [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Skill Management", href: "/dashboard/admin/skills", icon: SlidersHorizontal },
    { label: "Blockchain Status", href: "/dashboard/admin/blockchain", icon: Blocks },
  ];

  const links =
    user.role === "STUDENT"
      ? studentLinks
      : user.role === "RECRUITER"
      ? recruiterLinks
      : adminLinks;

  return (
    <aside className="w-64 border-r border-[#DFDDD6] bg-[#FFFFFF] min-h-[calc(100vh-3.5rem)] flex flex-col justify-between py-6 px-4">
      <div className="space-y-6">
        <div>
          <div className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[#77756F]">
            {user.role} WORKSPACE
          </div>
          <nav className="mt-3 space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-2.5 px-3 py-2 rounded-[4px] text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-[#F2F0EA] text-[#191919] font-semibold"
                      : "text-[#77756F] hover:text-[#191919] hover:bg-[#FAF9F5]"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-[#5555A5]" : "text-[#77756F]"
                    }`}
                  />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="pt-4 border-t border-[#DFDDD6] space-y-3">
        <div className="px-3">
          <p className="text-xs font-medium text-[#191919] truncate">{user.fullName}</p>
          <p className="text-[11px] text-[#77756F] truncate">{user.email}</p>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-medium text-[#77756F] hover:text-[#DC2626] rounded-[4px] hover:bg-[#FEF2F2] transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
