"use client";

import React, { useEffect, useState, useRef } from "react";
import { apiRequest, CertificateItem, API_BASE } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Dialog } from "@/components/ui/Dialog";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Upload,
  FileText,
  FileCheck2,
  Download,
  Eye,
  CheckCircle2,
  XCircle,
  Loader2
} from "lucide-react";

export default function StudentCertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add / Edit Certificate Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<CertificateItem | null>(null);
  const [title, setTitle] = useState("");
  const [issuingOrganization, setIssuingOrganization] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // File Upload Modal
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [targetCert, setTargetCert] = useState<CertificateItem | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadCertificates = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<CertificateItem[]>("/student/certificates");
      setCertificates(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load certificates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  const openAddModal = () => {
    setEditingCert(null);
    setTitle("");
    setIssuingOrganization("");
    setIssueDate("");
    setExpirationDate("");
    setCredentialId("");
    setCredentialUrl("");
    setModalOpen(true);
  };

  const openEditModal = (cert: CertificateItem) => {
    setEditingCert(cert);
    setTitle(cert.title);
    setIssuingOrganization(cert.issuingOrganization);
    setIssueDate(cert.issueDate);
    setExpirationDate(cert.expirationDate || "");
    setCredentialId(cert.credentialId || "");
    setCredentialUrl(cert.credentialUrl || "");
    setModalOpen(true);
  };

  const openUploadModal = (cert: CertificateItem) => {
    setTargetCert(cert);
    setSelectedFile(null);
    setUploadError(null);
    setUploadProgress(null);
    setUploadModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingCert) {
        const updated = await apiRequest<CertificateItem>(`/student/certificates/${editingCert.id}`, {
          method: "PUT",
          body: JSON.stringify({
            title,
            issuingOrganization,
            issueDate,
            expirationDate,
            credentialId,
            credentialUrl,
          }),
        });
        setCertificates(certificates.map((c) => (c.id === updated.id ? updated : c)));
      } else {
        const created = await apiRequest<CertificateItem>("/student/certificates", {
          method: "POST",
          body: JSON.stringify({
            title,
            issuingOrganization,
            issueDate,
            expirationDate,
            credentialId,
            credentialUrl,
          }),
        });
        setCertificates([...certificates, created]);
      }
      setModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to remove this certificate?")) return;
    try {
      await apiRequest(`/student/certificates/${id}`, { method: "DELETE" });
      setCertificates(certificates.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete certificate");
    }
  };

  // Drag and Drop validation & handlers
  const validateAndSetFile = (file: File) => {
    setUploadError(null);

    // Validate PDF mime / extension
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setUploadError("Invalid file format. Only official PDF documents are accepted.");
      return;
    }

    // Validate size (10MB limit)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setUploadError("File exceeds the 10MB limit. Please upload a compressed PDF.");
      return;
    }

    setSelectedFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async () => {
    if (!targetCert || !selectedFile) {
      setUploadError("Please select a valid PDF file to upload.");
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadProgress("Validating magic bytes and computing SHA-256...");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const updated = await apiRequest<CertificateItem>(
        `/student/certificates/${targetCert.id}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      setUploadProgress("Document cryptographically hashed and bound.");
      // Refresh list
      setCertificates(certificates.map((c) => (c.id === updated.id ? updated : c)));

      setTimeout(() => {
        setUploadModalOpen(false);
        setUploading(false);
        setSelectedFile(null);
      }, 700);
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload certificate document");
      setUploading(false);
      setUploadProgress(null);
    }
  };

  const getDownloadUrl = (certId: number) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("skillchain_token") : null;
    return `${API_BASE}/files/certificates/${certId}/download`;
  };

  const handleAuthorizedDownload = async (certId: number, filename: string) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("skillchain_token") : null;
      const res = await fetch(`${API_BASE}/files/certificates/${certId}/download`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) throw new Error("Failed to download certificate");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || "certificate.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      alert(err.message || "Could not download certificate");
    }
  };

  const handleAuthorizedPreview = async (certId: number) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("skillchain_token") : null;
      const res = await fetch(`${API_BASE}/files/certificates/${certId}/preview`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) throw new Error("Failed to preview certificate");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err: any) {
      alert(err.message || "Could not open certificate preview");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-[3px] bg-[#FFFFFF] border border-[#DFDDD6] text-[11px] font-mono text-[#5555A5] mb-2 font-medium">
            <ShieldCheck className="w-3 h-3" />
            <span>CRYPTOGRAPHIC REGISTRY // SHA-256 ANCHOR</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#191919]">
            Certificates &amp; Credentials
          </h1>
          <p className="text-xs text-[#77756F] mt-1 leading-relaxed">
            Record institutional degrees and industry certifications with tamper-evident PDF storage,
            SHA-256 fingerprinting, and public verification records.
          </p>
        </div>
        <Button onClick={openAddModal} size="sm" className="font-medium">
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          <span>Add Certificate</span>
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
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-28 bg-[#FFFFFF] border border-[#DFDDD6] rounded-[4px] animate-pulse"
            />
          ))}
        </div>
      ) : certificates.length === 0 ? (
        <EmptyState
          icon={<Award className="w-8 h-8 text-[#5555A5]" />}
          title="No Certificates Registered"
          description="Add AWS certifications, Coursera specializations, or institutional degrees to substantiate your expertise."
          actionLabel="Add Certificate"
          onAction={openAddModal}
        />
      ) : (
        <div className="border border-[#DFDDD6] rounded-[4px] bg-[#FFFFFF] divide-y divide-[#DFDDD6] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          {certificates.map((cert) => {
            const isVerifiedOnLedger = Boolean(cert.blockchainHash && !cert.isRevoked);
            const isRevoked = Boolean(cert.isRevoked);
            const hasDocument = Boolean(cert.fileName || cert.fileHash);

            return (
              <div
                key={cert.id}
                className="p-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 hover:bg-[#FAF9F5] transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-[#191919]">{cert.title}</h3>

                    {/* Verification Status Badge */}
                    {isRevoked ? (
                      <span className="inline-flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded-[3px] bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
                        <XCircle className="w-3 h-3 text-[#DC2626]" />
                        <span>REVOKED</span>
                      </span>
                    ) : isVerifiedOnLedger ? (
                      <span className="inline-flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded-[3px] bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]">
                        <ShieldCheck className="w-3 h-3 text-[#166534]" />
                        <span>LEDGER VERIFIED</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded-[3px] bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
                        <span>RECORD ATTESTED</span>
                      </span>
                    )}

                    {/* PDF Attachment Badge */}
                    {hasDocument && (
                      <span className="inline-flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded-[3px] bg-[#FFFFFF] text-[#5555A5] border border-[#DFDDD6]">
                        <FileCheck2 className="w-3 h-3 text-[#5555A5]" />
                        <span>PDF ATTACHED</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#77756F]">
                    Issued by <span className="text-[#191919] font-medium">{cert.issuingOrganization}</span> • {cert.issueDate}
                    {cert.expirationDate && ` (Expires: ${cert.expirationDate})`}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#77756F] font-mono">
                    {cert.credentialId && <span>ID: {cert.credentialId}</span>}
                    {cert.fileHash && (
                      <span className="truncate max-w-xs" title={`SHA-256 Checksum: ${cert.fileHash}`}>
                        SHA-256: {cert.fileHash.slice(0, 16)}...
                      </span>
                    )}
                  </div>

                  {cert.isRevoked && cert.revocationReason && (
                    <div className="text-[11px] text-[#DC2626] font-mono bg-[#FEF2F2] px-2.5 py-1 rounded-[3px] border border-[#FECACA] max-w-lg">
                      Revocation Reason: {cert.revocationReason}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-center">
                  {/* Upload PDF Document Button */}
                  <Button
                    variant={hasDocument ? "outline" : "primary"}
                    size="sm"
                    onClick={() => openUploadModal(cert)}
                    className="text-xs"
                    disabled={isRevoked}
                  >
                    <Upload className="w-3.5 h-3.5 mr-1" />
                    <span>{hasDocument ? "Replace PDF" : "Upload PDF"}</span>
                  </Button>

                  {/* Document Preview & Download */}
                  {hasDocument && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAuthorizedPreview(cert.id)}
                        title="Preview certificate PDF in new tab"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1 text-[#5555A5]" />
                        <span>Preview</span>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleAuthorizedDownload(cert.id, cert.fileName || `${cert.title}.pdf`)
                        }
                        title="Download certificate PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </Button>
                    </>
                  )}

                  {/* Public URL */}
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 text-[#77756F] hover:text-[#191919] rounded hover:bg-[#F2F0EA] transition-colors"
                      title="External Credential Link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <Button variant="outline" size="sm" onClick={() => openEditModal(cert)}>
                    <Edit2 className="w-3.5 h-3.5 mr-1" />
                    <span>Edit</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(cert.id)}
                    title="Remove certificate record"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-[#DC2626]" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- ADD / EDIT CERTIFICATE MODAL --- */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCert ? "Edit Certificate Record" : "Add Certificate Record"}
        description="Attach official credentials to your verifiable audit record."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Certificate Title"
            placeholder="e.g. AWS Certified Solutions Architect"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Input
            label="Issuing Organization"
            placeholder="e.g. Amazon Web Services, Stanford Online"
            value={issuingOrganization}
            onChange={(e) => setIssuingOrganization(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Issue Date"
              placeholder="e.g. Aug 2026"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              required
            />
            <Input
              label="Expiration Date (Optional)"
              placeholder="e.g. Aug 2029"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
            />
          </div>

          <Input
            label="Credential ID / Code"
            placeholder="e.g. AWS-PSA-829103"
            value={credentialId}
            onChange={(e) => setCredentialId(e.target.value)}
          />

          <Input
            label="Verification / Certificate URL"
            placeholder="https://aws.amazon.com/verify/..."
            value={credentialUrl}
            onChange={(e) => setCredentialUrl(e.target.value)}
          />

          <div className="pt-2 flex justify-end space-x-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting} size="sm">
              {editingCert ? "Save Changes" : "Record Certificate"}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* --- POLISHED DRAG-AND-DROP FILE UPLOAD MODAL --- */}
      <Dialog
        open={uploadModalOpen}
        onClose={() => !uploading && setUploadModalOpen(false)}
        title={`Upload Certificate PDF`}
        description={
          targetCert ? `Secure document storage for "${targetCert.title}"` : "Upload PDF Document"
        }
      >
        <div className="space-y-4">
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="application/pdf,.pdf"
            className="hidden"
          />

          {/* Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-[6px] p-6 text-center cursor-pointer transition-all ${
              isDragOver
                ? "border-[#5555A5] bg-[#5555A5]/5"
                : selectedFile
                ? "border-[#166534] bg-[#F0FDF4]/50"
                : "border-[#DFDDD6] bg-[#FCFCFB] hover:border-[#5555A5]/60 hover:bg-[#FAF9F5]"
            }`}
          >
            {selectedFile ? (
              <div className="space-y-2">
                <div className="w-10 h-10 mx-auto rounded-full bg-[#166534]/10 text-[#166534] flex items-center justify-center">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div className="text-xs font-semibold text-[#191919]">{selectedFile.name}</div>
                <div className="text-[11px] text-[#77756F] font-mono">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for cryptographic hashing
                </div>
                <div className="text-[11px] text-[#5555A5] hover:underline pt-1">
                  Click to select different file
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-10 h-10 mx-auto rounded-full bg-[#F2F0EA] text-[#5555A5] flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-xs font-medium text-[#191919]">
                  <span className="font-semibold text-[#5555A5] underline mr-1">Choose PDF file</span>
                  or drag and drop here
                </div>
                <p className="text-[11px] text-[#77756F]">
                  PDF format only • Maximum 10MB • Magic-byte validated
                </p>
              </div>
            )}
          </div>

          {/* Progress or Status */}
          {uploadProgress && (
            <div className="p-3 rounded-[4px] bg-[#F0FDF4] border border-[#BBF7D0] flex items-center space-x-2 text-xs text-[#166534]">
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin shrink-0 text-[#166534]" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#166534]" />
              )}
              <span>{uploadProgress}</span>
            </div>
          )}

          {/* Error Message */}
          {uploadError && (
            <div className="p-3 rounded-[4px] bg-[#FEF2F2] border border-[#FEE2E2] flex items-center space-x-2 text-xs text-[#B91C1C]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Modal Actions */}
          <div className="pt-2 flex justify-end space-x-2 border-t border-[#DFDDD6]/70">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => setUploadModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              loading={uploading}
              disabled={!selectedFile || uploading}
              onClick={handleUploadSubmit}
            >
              <span>{uploading ? "Hashing & Uploading..." : "Upload & Bind PDF"}</span>
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
