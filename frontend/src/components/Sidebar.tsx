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
    <aside className="w-64 border-r border-slate-200/90 bg-white min-h-[calc(100vh-3.5rem)] flex flex-col justify-between py-6 px-4">
      <div className="space-y-6">
        <div>
          <div className="px-3 flex items-center space-x-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            <span>{user.role} WORKSPACE</span>
          </div>
          <nav className="mt-3 space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group flex items-center space-x-2.5 px-3 py-2 rounded-[6px] text-xs font-medium transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 font-semibold border-l-2 border-indigo-600 shadow-xs"
                      : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-500"
                    }`}
                  />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200 space-y-3">
        <div className="px-3">
          <p className="text-xs font-semibold text-slate-800 truncate">{user.fullName}</p>
          <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-medium text-slate-600 hover:text-rose-600 rounded-[6px] hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
