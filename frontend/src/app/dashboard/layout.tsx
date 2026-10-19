"use client";

import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080E1E]">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="text-xs font-medium text-slate-400">Loading SkillChain workspace...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-[#F3F6FB] text-slate-800">
      {/* Deep Navy Fixed/Sticky Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto min-h-screen">
        {children}
      </main>
    </div>
  );
}
