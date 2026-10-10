"use client";

import React, { useEffect, useState } from "react";
import { apiRequest, AdminStats, UserSummary } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Dialog } from "@/components/ui/Dialog";
import {
  Users,
  GraduationCap,
  Briefcase,
  ShieldAlert,
  Sparkles,
  FolderGit2,
  Award,
  CheckCircle,
  XCircle,
  Trash2,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserSummary | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, usersData] = await Promise.all([
        apiRequest<AdminStats>("/admin/stats"),
        apiRequest<UserSummary[]>("/admin/users"),
      ]);
      setStats(statsData);
      setUsers(usersData);
    } catch (err: any) {
      setError(err.message || "Failed to load platform administration metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleStatus = async (userId: number) => {
    try {
      const updated = await apiRequest<UserSummary>(`/admin/users/${userId}/toggle-status`, {
        method: "PUT",
      });
      setUsers(users.map((u) => (u.id === updated.id ? updated : u)));
    } catch (err: any) {
      alert(err.message || "Failed to toggle user status");
    }
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    setActionLoading(true);
    try {
      await apiRequest(`/admin/users/${userToDelete.id}`, { method: "DELETE" });
      setUsers(users.filter((u) => u.id !== userToDelete.id));
      setDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete user");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#191919]">
          Platform Administration
        </h1>
        <p className="text-xs text-[#77756F] mt-1">
          System telemetry, account access controls, and platform registry metrics.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-[4px] bg-[#FEF2F2] border border-[#FEE2E2] flex items-center space-x-2 text-xs text-[#B91C1C]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Aggregate Platform Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between text-xs text-[#77756F]">
            <span>Total Accounts</span>
            <Users className="w-4 h-4 text-[#5555A5]" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-[#191919]">{stats?.totalUsers || 0}</div>
          <p className="text-[11px] text-[#77756F] mt-1">{stats?.totalStudents || 0} students, {stats?.totalRecruiters || 0} recruiters</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between text-xs text-[#77756F]">
            <span>Skills Recorded</span>
            <Sparkles className="w-4 h-4 text-[#5555A5]" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-[#191919]">{stats?.totalSkills || 0}</div>
          <p className="text-[11px] text-[#77756F] mt-1">Verified competencies</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between text-xs text-[#77756F]">
            <span>Projects Filed</span>
            <FolderGit2 className="w-4 h-4 text-[#5555A5]" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-[#191919]">{stats?.totalProjects || 0}</div>
          <p className="text-[11px] text-[#77756F] mt-1">Software deliverables</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between text-xs text-[#77756F]">
            <span>Certificates Attested</span>
            <Award className="w-4 h-4 text-[#5555A5]" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-[#191919]">{stats?.totalCertificates || 0}</div>
          <p className="text-[11px] text-[#77756F] mt-1">Cryptographic records</p>
        </Card>
      </div>

      {/* User Management Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>User Account Management</CardTitle>
            <span className="text-xs text-[#77756F]">{users.length} registered accounts</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#DFDDD6] text-[#77756F]">
                <tr>
                  <th className="pb-3 font-medium">User</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Registered</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DFDDD6]">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#FAF9F5] transition-colors">
                    <td className="py-3">
                      <div className="font-semibold text-[#191919]">{u.fullName}</div>
                      <div className="text-[11px] text-[#77756F] font-mono">{u.email}</div>
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={
                          u.role === "ADMIN"
                            ? "accent"
                            : u.role === "RECRUITER"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {u.role}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center space-x-1 font-medium ${
                          u.enabled ? "text-[#166534]" : "text-[#B91C1C]"
                        }`}
                      >
                        {u.enabled ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Disabled</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3 text-[11px] text-[#77756F]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-right">
                      <div className="inline-flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(u.id)}
                          title={u.enabled ? "Disable user account" : "Enable user account"}
                        >
                          {u.enabled ? (
                            <ToggleRight className="w-4 h-4 text-[#166534]" />
                          ) : (
                            <ToggleLeft className="w-4 h-4 text-[#77756F]" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setUserToDelete(u);
                            setDeleteModalOpen(true);
                          }}
                          title="Delete user"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-[#DC2626]" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Delete User Confirmation Modal */}
      <Dialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm User Account Deletion"
        description="This action is irreversible. All associated profiles, skills, and projects will be permanently removed."
      >
        <div className="space-y-4 pt-2">
          {userToDelete && (
            <div className="p-3 rounded-[3px] bg-[#F2F0EA] border border-[#DFDDD6] text-xs">
              <span className="text-[#77756F]">Target user:</span>{" "}
              <strong className="text-[#191919]">{userToDelete.fullName}</strong> ({userToDelete.email})
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteModalOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              loading={actionLoading}
              onClick={confirmDelete}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
