"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardIndexPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (user.role === "STUDENT") {
        router.push("/dashboard/student");
      } else if (user.role === "RECRUITER") {
        router.push("/dashboard/recruiter");
      } else if (user.role === "ADMIN") {
        router.push("/dashboard/admin");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className="w-5 h-5 animate-spin text-[#5555A5]" />
        <span className="text-xs text-[#77756F]">Directing to your workspace...</span>
      </div>
    </div>
  );
}
