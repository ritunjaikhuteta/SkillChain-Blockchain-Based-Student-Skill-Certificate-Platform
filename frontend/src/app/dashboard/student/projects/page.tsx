"use client";

import React, { useEffect, useState } from "react";
import { apiRequest, ProjectItem, TechStackDetection } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Dialog } from "@/components/ui/Dialog";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  FolderGit2,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Github,
  Star,
  AlertCircle,
  Sparkles,
  Loader2,
  CheckCircle2
} from "lucide-react";

export default function StudentProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [liveDemoUrl, setLiveDemoUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [detectingStack, setDetectingStack] = useState(false);
  const [detectedStackMsg, setDetectedStackMsg] = useState<{ type: "success" | "info" | "error"; text: string } | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [featured, setFeatured] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<ProjectItem[]>("/student/projects");
      setProjects(data);
    } catch (err: any) {
      setError(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openAddModal = () => {
    setEditingProject(null);
    setTitle("");
    setDescription("");
    setTechStack("");
    setLiveDemoUrl("");
    setGithubUrl("");
    setStartDate("");
    setEndDate("");
    setFeatured(false);
    setDetectingStack(false);
    setDetectedStackMsg(null);
    setModalOpen(true);
  };

  const openEditModal = (proj: ProjectItem) => {
    setEditingProject(proj);
    setTitle(proj.title);
    setDescription(proj.description);
    setTechStack(proj.techStack || "");
    setLiveDemoUrl(proj.liveDemoUrl || "");
    setGithubUrl(proj.githubUrl || "");
    setStartDate(proj.startDate || "");
    setEndDate(proj.endDate || "");
    setFeatured(proj.featured);
    setDetectingStack(false);
    setDetectedStackMsg(null);
    setModalOpen(true);
  };

  const handleDetectTechStack = async (urlOverride?: string) => {
    const url = (urlOverride !== undefined ? urlOverride : githubUrl).trim();
    if (!url) {
      setDetectedStackMsg({ type: "info", text: "Please enter a GitHub repository URL first." });
      return;
    }
    if (!url.toLowerCase().includes("github.com")) {
      setDetectedStackMsg({
        type: "error",
        text: "Please enter a valid GitHub repository URL (e.g. https://github.com/username/project).",
      });
      return;
    }

    setDetectingStack(true);
    setDetectedStackMsg(null);

    // Helper: direct browser GitHub API fallback
    const detectDirectlyFromGitHub = async (targetUrl: string): Promise<boolean> => {
      try {
        const match = targetUrl.match(/github\.com\/([^/]+)\/([^/?#]+)/i);
        if (!match) return false;
        const owner = match[1];
        let repo = match[2].replace(/\.git$/i, "");

        const langRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`);
        if (!langRes.ok) return false;
        const langData = await langRes.json();
        const detected = Object.keys(langData).filter(
          (l) => !["Roff", "Makefile", "Batchfile"].includes(l)
        );

        const techSet = new Set<string>(detected);

        // Check root manifests
        try {
          const contentsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`);
          if (contentsRes.ok) {
            const items = await contentsRes.json();
            if (Array.isArray(items)) {
              const fileNames = items.map((i: any) => (i.name || "").toLowerCase());
              if (fileNames.includes("pom.xml")) {
                techSet.add("Java");
                techSet.add("Spring Boot");
              } else if (fileNames.includes("build.gradle") || fileNames.includes("build.gradle.kts")) {
                techSet.add("Gradle");
              }
              if (fileNames.includes("package.json")) {
                techSet.add("Node.js");
              }
              if (fileNames.includes("dockerfile") || fileNames.includes("docker-compose.yml")) {
                techSet.add("Docker");
              }
              if (fileNames.includes("requirements.txt") || fileNames.includes("pyproject.toml")) {
                techSet.add("Python");
              }
              if (fileNames.includes("cargo.toml")) {
                techSet.add("Rust");
              }
              if (fileNames.includes("go.mod")) {
                techSet.add("Go / Golang");
              }
            }
          }
        } catch {}

        const list = Array.from(techSet);
        if (list.length > 0) {
          const formatted = list.join(", ");
          setTechStack(formatted);
          setDetectedStackMsg({
            type: "success",
            text: `Auto-detected ${list.length} technologies from GitHub: ${formatted}`,
          });
          return true;
        }
      } catch {}
      return false;
    };

    try {
      // 1. Try backend detection endpoint
      const res = await apiRequest<TechStackDetection>(
        `/student/projects/detect-tech-stack?url=${encodeURIComponent(url)}`
      ).catch(() => null);

      if (res && res.detected && res.techStack) {
        setTechStack(res.techStack);
        setDetectedStackMsg({
          type: "success",
          text: `Auto-detected ${res.technologies.length} technologies from GitHub: ${res.techStack}`,
        });
        return;
      }

      // 2. Direct GitHub API fallback
      const directSuccess = await detectDirectlyFromGitHub(url);
      if (directSuccess) return;

      setDetectedStackMsg({
        type: "info",
        text: "Could not auto-detect languages for this repository. You can type them manually.",
      });
    } catch {
      const directSuccess = await detectDirectlyFromGitHub(url);
      if (!directSuccess) {
        setDetectedStackMsg({
          type: "info",
          text: "Could not auto-detect languages for this repository. You can type them manually.",
        });
      }
    } finally {
      setDetectingStack(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingProject) {
        const updated = await apiRequest<ProjectItem>(`/student/projects/${editingProject.id}`, {
          method: "PUT",
          body: JSON.stringify({
            title,
            description,
            techStack,
            liveDemoUrl,
            githubUrl,
            startDate,
            endDate,
            featured,
          }),
        });
        setProjects(projects.map((p) => (p.id === updated.id ? updated : p)));
      } else {
        const created = await apiRequest<ProjectItem>("/student/projects", {
          method: "POST",
          body: JSON.stringify({
            title,
            description,
            techStack,
            liveDemoUrl,
            githubUrl,
            startDate,
            endDate,
            featured,
          }),
        });
        setProjects([...projects, created]);
      }
      setModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await apiRequest(`/student/projects/${id}`, { method: "DELETE" });
      setProjects(projects.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete project");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#191919]">
            Engineering Projects
          </h1>
          <p className="text-xs text-[#77756F] mt-1">
            Real portfolio systems, repositories, and technical deliverables.
          </p>
        </div>
        <Button onClick={openAddModal} size="sm">
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          <span>Add Project</span>
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-[4px] bg-[#FEF2F2] border border-[#FEE2E2] flex items-center space-x-2 text-xs text-[#B91C1C]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-44 bg-[#FFFFFF] border border-[#DFDDD6] rounded-[4px] animate-pulse"></div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={<FolderGit2 className="w-8 h-8 text-[#5555A5]" />}
          title="No Projects Documented"
          description="Demonstrate your software engineering ability with production code, open-source work, or university capstones."
          actionLabel="Add First Project"
          onAction={openAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj) => (
            <Card key={proj.id} className="flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-semibold text-[#191919]">{proj.title}</h3>
                    {proj.featured && (
                      <span className="inline-flex items-center text-[11px] text-[#854D0E] bg-[#FEFCE8] px-1.5 py-0.5 rounded-[2px] border border-[#FEF08A]">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      onClick={() => openEditModal(proj)}
                      className="p-1 text-[#77756F] hover:text-[#191919] rounded hover:bg-[#F2F0EA]"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(proj.id)}
                      className="p-1 text-[#77756F] hover:text-[#DC2626] rounded hover:bg-[#FEF2F2]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[#77756F] leading-relaxed line-clamp-3">
                  {proj.description}
                </p>

                {proj.techStack && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.techStack.split(",").map((t, idx) => (
                      <Badge key={idx} variant="secondary" className="text-[11px]">
                        {t.trim()}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-[#DFDDD6] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#77756F]">
                  {proj.startDate || "Date"} {proj.endDate ? `- ${proj.endDate}` : ""}
                </span>
                <div className="flex items-center space-x-3">
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#77756F] hover:text-[#191919] inline-flex items-center space-x-1"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Repo</span>
                    </a>
                  )}
                  {proj.liveDemoUrl && (
                    <a
                      href={proj.liveDemoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#5555A5] hover:underline inline-flex items-center space-x-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Project Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProject ? "Edit Project" : "Add New Project"}
        description="Provide comprehensive details about your architecture, stack, and results."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Project Title"
            placeholder="e.g. Distributed Task Scheduler"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Textarea
            label="Project Description"
            placeholder="What does this system do? What technical challenges did you solve?"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          {/* GitHub Repository with Auto-Detect Button */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-[#191919]">GitHub Repository</label>
              <button
                type="button"
                onClick={() => handleDetectTechStack()}
                disabled={detectingStack || !githubUrl.trim()}
                className="inline-flex items-center space-x-1 text-[11px] font-medium text-[#5555A5] hover:text-[#444485] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Automatically analyze languages and frameworks from this GitHub repository"
              >
                {detectingStack ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Analyzing Repo...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-[#5555A5]" />
                    <span>Auto-Detect Tech Stack</span>
                  </>
                )}
              </button>
            </div>
            <Input
              placeholder="https://github.com/username/project"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              onBlur={() => {
                if (githubUrl.trim().toLowerCase().includes("github.com") && (!techStack || techStack.trim().length === 0)) {
                  handleDetectTechStack(githubUrl);
                }
              }}
            />
            {detectedStackMsg && (
              <div
                className={`text-[11px] px-2.5 py-1.5 rounded flex items-center gap-1.5 ${
                  detectedStackMsg.type === "success"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : detectedStackMsg.type === "error"
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-[#FAF9F5] text-[#77756F] border border-[#DFDDD6]"
                }`}
              >
                {detectedStackMsg.type === "success" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />}
                {detectedStackMsg.type === "error" && <AlertCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />}
                <span>{detectedStackMsg.text}</span>
              </div>
            )}
          </div>

          {/* Tech Stack Input */}
          <Input
            label="Tech Stack (Comma-separated)"
            placeholder="Java, Spring Boot, MySQL, Docker"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            helperText="Auto-detected from GitHub or customize manually."
          />

          <Input
            label="Live URL (Optional)"
            placeholder="https://myservice.com"
            value={liveDemoUrl}
            onChange={(e) => setLiveDemoUrl(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Start Date"
              placeholder="e.g. Jan 2026"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              label="End Date"
              placeholder="e.g. Present"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="featuredProj"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="rounded border-[#DFDDD6] text-[#5555A5] focus:ring-[#5555A5]"
            />
            <label htmlFor="featuredProj" className="text-xs text-[#191919]">
              Feature this project prominently on top of my profile
            </label>
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting} size="sm">
              {editingProject ? "Save Changes" : "Create Project"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
