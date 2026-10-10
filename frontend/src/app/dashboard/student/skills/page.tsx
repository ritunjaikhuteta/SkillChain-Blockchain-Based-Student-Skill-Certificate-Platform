"use client";

import React, { useEffect, useState } from "react";
import { apiRequest, SkillItem } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SkillAutocompleteInput } from "@/components/ui/SkillAutocompleteInput";
import { Badge } from "@/components/ui/Badge";
import { Dialog } from "@/components/ui/Dialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Sparkles, Plus, Edit2, Trash2, AlertCircle } from "lucide-react";

export default function StudentSkillsPage() {
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Backend");
  const [formProficiency, setFormProficiency] = useState<"BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT">("INTERMEDIATE");
  const [formExperience, setFormExperience] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const loadSkills = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<SkillItem[]>("/student/skills");
      setSkills(data);
    } catch (err: any) {
      setError(err.message || "Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const openAddModal = () => {
    setEditingSkill(null);
    setFormName("");
    setFormCategory("Backend");
    setFormProficiency("INTERMEDIATE");
    setFormExperience(1);
    setModalOpen(true);
  };

  const openEditModal = (skill: SkillItem) => {
    setEditingSkill(skill);
    setFormName(skill.name);
    setFormCategory(skill.category);
    setFormProficiency(skill.proficiency);
    setFormExperience(skill.yearsOfExperience);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingSkill) {
        const updated = await apiRequest<SkillItem>(`/student/skills/${editingSkill.id}`, {
          method: "PUT",
          body: JSON.stringify({
            name: formName,
            category: formCategory,
            proficiency: formProficiency,
            yearsOfExperience: Number(formExperience),
          }),
        });
        setSkills(skills.map((s) => (s.id === updated.id ? updated : s)));
      } else {
        const created = await apiRequest<SkillItem>("/student/skills", {
          method: "POST",
          body: JSON.stringify({
            name: formName,
            category: formCategory,
            proficiency: formProficiency,
            yearsOfExperience: Number(formExperience),
          }),
        });
        setSkills([...skills, created]);
      }
      setModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to remove this skill from your profile?")) return;
    try {
      await apiRequest(`/student/skills/${id}`, { method: "DELETE" });
      setSkills(skills.filter((s) => s.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete skill");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#191919]">
            My Technical Skills
          </h1>
          <p className="text-xs text-[#77756F] mt-1">
            Registered competencies verified against your portfolio projects.
          </p>
        </div>
        <Button onClick={openAddModal} size="sm">
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          <span>Add Skill</span>
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-[4px] bg-[#FEF2F2] border border-[#FEE2E2] flex items-center space-x-2 text-xs text-[#B91C1C]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-[#FFFFFF] border border-[#DFDDD6] rounded-[4px] animate-pulse"></div>
          ))}
        </div>
      ) : skills.length === 0 ? (
        <EmptyState
          icon={<Sparkles className="w-8 h-8 text-[#5555A5]" />}
          title="No Skills Added"
          description="Build your technical identity by adding languages, frameworks, and databases you have worked with."
          actionLabel="Add First Skill"
          onAction={openAddModal}
        />
      ) : (
        <div className="border border-[#DFDDD6] rounded-[4px] bg-[#FFFFFF] divide-y divide-[#DFDDD6]">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-[#FAF9F5] transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2.5">
                  <span className="text-sm font-semibold text-[#191919]">{skill.name}</span>
                  <Badge variant="secondary">{skill.category}</Badge>
                  <Badge
                    variant={
                      skill.proficiency === "EXPERT" || skill.proficiency === "ADVANCED"
                        ? "accent"
                        : "outline"
                    }
                  >
                    {skill.proficiency}
                  </Badge>
                </div>
                <p className="text-[11px] text-[#77756F]">
                  Experience: {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? "year" : "years"}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => openEditModal(skill)}>
                  <Edit2 className="w-3.5 h-3.5 mr-1" />
                  <span>Edit</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(skill.id)}>
                  <Trash2 className="w-3.5 h-3.5 text-[#DC2626]" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Skill Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSkill ? "Edit Technical Skill" : "Add New Skill"}
        description="Provide accurate skill details and your true experience level."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <SkillAutocompleteInput
            label="Skill Name"
            placeholder="Type skill name (e.g. Java, React, Docker)..."
            value={formName}
            onChange={(val) => setFormName(val)}
            onSelectCategory={(cat) => setFormCategory(cat)}
            required
            helperText="Type any letter (e.g. 'j') to see matching technology suggestions."
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#191919]">Category</label>
            <select
              className="flex h-9 w-full rounded-[4px] border border-[#DFDDD6] bg-[#FFFFFF] px-3 text-sm text-[#191919] focus:outline-none focus:border-[#5555A5] focus:ring-1 focus:ring-[#5555A5]"
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
            >
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Database">Database</option>
              <option value="Cloud / DevOps">Cloud / DevOps</option>
              <option value="AI / ML">AI / ML</option>
              <option value="Systems">Systems</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#191919]">Proficiency Level</label>
            <select
              className="flex h-9 w-full rounded-[4px] border border-[#DFDDD6] bg-[#FFFFFF] px-3 text-sm text-[#191919] focus:outline-none focus:border-[#5555A5] focus:ring-1 focus:ring-[#5555A5]"
              value={formProficiency}
              onChange={(e) => setFormProficiency(e.target.value as any)}
            >
              <option value="BEGINNER">BEGINNER (Learning &amp; Basic projects)</option>
              <option value="INTERMEDIATE">INTERMEDIATE (Comfortable with production features)</option>
              <option value="ADVANCED">ADVANCED (Deep architecture knowledge)</option>
              <option value="EXPERT">EXPERT (Mastery &amp; Complex optimization)</option>
            </select>
          </div>

          <Input
            label="Years of Experience"
            type="number"
            min={0}
            max={50}
            value={formExperience}
            onChange={(e) => setFormExperience(Number(e.target.value))}
            required
          />

          <div className="pt-2 flex justify-end space-x-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting} size="sm">
              {editingSkill ? "Save Changes" : "Create Skill"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
