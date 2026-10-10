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
  Loader2,
  ImageIcon,
  FolderOpen
} from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export default function StudentCertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add / Edit Certificate Modal Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<CertificateItem | null>(null);
  const [title, setTitle] = useState("");
  const [issuingOrganization, setIssuingOrganization] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // File Upload State inside Add/Edit Modal
  const [modalFile, setModalFile] = useState<File | null>(null);
  const [modalFilePreview, setModalFilePreview] = useState<string | null>(null);
  const [modalFileError, setModalFileError] = useState<string | null>(null);
  const [isModalDragging, setIsModalDragging] = useState(false);
  const modalFileInputRef = useRef<HTMLInputElement | null>(null);

  // Standalone Replace Document Modal State
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [targetCert, setTargetCert] = useState<CertificateItem | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [standalonePreview, setStandalonePreview] = useState<string | null>(null);
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

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (modalFilePreview) URL.revokeObjectURL(modalFilePreview);
      if (standalonePreview) URL.revokeObjectURL(standalonePreview);
    };
  }, [modalFilePreview, standalonePreview]);

  const openAddModal = () => {
    setEditingCert(null);
    setTitle("");
    setIssuingOrganization("");
    setIssueDate("");
    setExpirationDate("");
    setCredentialId("");
    setCredentialUrl("");
    clearModalFile();
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
    clearModalFile();
    setModalOpen(true);
  };

  const clearModalFile = () => {
    if (modalFilePreview) {
      URL.revokeObjectURL(modalFilePreview);
    }
    setModalFile(null);
    setModalFilePreview(null);
    setModalFileError(null);
    if (modalFileInputRef.current) {
      modalFileInputRef.current.value = "";
    }
  };

  const validateModalFile = (file: File): boolean => {
    setModalFileError(null);

    // 1. Check file size
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setModalFileError(`File size exceeds 5 MB limit (${sizeMB} MB). Please choose a file under 5 MB.`);
      return false;
    }

    // 2. Check format (PDF, PNG, JPG, JPEG)
    const validExtensions = [".pdf", ".png", ".jpg", ".jpeg"];
    const fileNameLower = file.name.toLowerCase();
    const hasValidExtension = validExtensions.some((ext) => fileNameLower.endsWith(ext));
    const validMimes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    const hasValidMime = file.type ? validMimes.includes(file.type.toLowerCase()) : hasValidExtension;

    if (!hasValidExtension || !hasValidMime) {
      setModalFileError("Unsupported file format. Only PDF, PNG, JPG, and JPEG documents are accepted.");
      return false;
    }

    // Set file and preview
    if (modalFilePreview) URL.revokeObjectURL(modalFilePreview);
    setModalFile(file);

    if (file.type.startsWith("image/") || fileNameLower.endsWith(".png") || fileNameLower.endsWith(".jpg") || fileNameLower.endsWith(".jpeg")) {
      setModalFilePreview(URL.createObjectURL(file));
    } else {
      setModalFilePreview(null);
    }

    return true;
  };

  const handleModalDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsModalDragging(true);
  };

  const handleModalDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsModalDragging(false);
  };

  const handleModalDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsModalDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateModalFile(e.dataTransfer.files[0]);
    }
  };

  const handleModalFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateModalFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return; // Prevent duplicate submissions

    setSubmitting(true);
    try {
      if (editingCert) {
        // 1. Update text fields
        const updated = await apiRequest<CertificateItem>(`/student/certificates/${editingCert.id}`, {
          method: "PUT",
          body: JSON.stringify({
            title,
            issuingOrganization,
            issueDate,
            expirationDate: expirationDate || null,
            credentialId: credentialId || null,
            credentialUrl: credentialUrl || null,
          }),
        });

        // 2. If user attached a new file in edit modal, upload it
        let finalCert = updated;
        if (modalFile) {
          const formData = new FormData();
          formData.append("file", modalFile);
          finalCert = await apiRequest<CertificateItem>(`/student/certificates/${editingCert.id}/upload`, {
            method: "POST",
            body: formData,
          });
        }

        setCertificates(certificates.map((c) => (c.id === finalCert.id ? finalCert : c)));
      } else {
        // Create new certificate
        let created: CertificateItem;
        if (modalFile) {
          // Send multipart/form-data to save certificate record and uploaded document in one atomic call
          const formData = new FormData();
          formData.append("title", title);
          formData.append("issuingOrganization", issuingOrganization);
          formData.append("issueDate", issueDate);
          if (expirationDate) formData.append("expirationDate", expirationDate);
          if (credentialId) formData.append("credentialId", credentialId);
          if (credentialUrl) formData.append("credentialUrl", credentialUrl);
          formData.append("file", modalFile);

          created = await apiRequest<CertificateItem>("/student/certificates", {
            method: "POST",
            body: formData,
          });
        } else {
          // Standard JSON creation
          created = await apiRequest<CertificateItem>("/student/certificates", {
            method: "POST",
            body: JSON.stringify({
              title,
              issuingOrganization,
              issueDate,
              expirationDate: expirationDate || null,
              credentialId: credentialId || null,
              credentialUrl: credentialUrl || null,
            }),
          });
        }
        setCertificates([...certificates, created]);
      }

      setModalOpen(false);
      clearModalFile();
    } catch (err: any) {
      alert(err.message || "Operation failed. Please try again.");
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

  // Standalone Upload Modal Handlers
  const openUploadModal = (cert: CertificateItem) => {
    setTargetCert(cert);
    if (standalonePreview) URL.revokeObjectURL(standalonePreview);
    setSelectedFile(null);
    setStandalonePreview(null);
    setUploadError(null);
    setUploadProgress(null);
    setUploadModalOpen(true);
  };

  const validateStandaloneFile = (file: File) => {
    setUploadError(null);

    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setUploadError(`File exceeds 5 MB limit (${sizeMB} MB). Please choose a file under 5 MB.`);
      return;
    }

    const validExtensions = [".pdf", ".png", ".jpg", ".jpeg"];
    const fileNameLower = file.name.toLowerCase();
    const hasValidExtension = validExtensions.some((ext) => fileNameLower.endsWith(ext));
    if (!hasValidExtension) {
      setUploadError("Invalid file format. Only PDF, PNG, JPG, and JPEG documents are accepted.");
      return;
    }

    if (standalonePreview) URL.revokeObjectURL(standalonePreview);
    setSelectedFile(file);

    if (file.type.startsWith("image/") || fileNameLower.endsWith(".png") || fileNameLower.endsWith(".jpg") || fileNameLower.endsWith(".jpeg")) {
      setStandalonePreview(URL.createObjectURL(file));
    } else {
      setStandalonePreview(null);
    }
  };

  const handleStandaloneDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleStandaloneDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleStandaloneDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateStandaloneFile(e.dataTransfer.files[0]);
    }
  };

  const handleStandaloneFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateStandaloneFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async () => {
    if (!targetCert || !selectedFile) {
      setUploadError("Please select a valid certificate file to upload.");
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadProgress("Validating magic bytes and computing SHA-256 hash...");

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

      setUploadProgress("Document verified and cryptographically bound to ledger.");
      setCertificates(certificates.map((c) => (c.id === updated.id ? updated : c)));

      setTimeout(() => {
        setUploadModalOpen(false);
        setUploading(false);
        setSelectedFile(null);
        if (standalonePreview) URL.revokeObjectURL(standalonePreview);
        setStandalonePreview(null);
      }, 700);
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload certificate document");
      setUploading(false);
      setUploadProgress(null);
    }
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

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
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
            Record institutional degrees and industry certifications with tamper-evident PDF/image storage,
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
            const isImage = Boolean(
              cert.contentType?.startsWith("image/") ||
              cert.fileName?.toLowerCase().endsWith(".png") ||
              cert.fileName?.toLowerCase().endsWith(".jpg") ||
              cert.fileName?.toLowerCase().endsWith(".jpeg")
            );

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

                    {/* Document Attachment Badge */}
                    {hasDocument && (
                      <span className="inline-flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded-[3px] bg-[#FFFFFF] text-[#5555A5] border border-[#DFDDD6]">
                        {isImage ? (
                          <ImageIcon className="w-3 h-3 text-[#5555A5]" />
                        ) : (
                          <FileCheck2 className="w-3 h-3 text-[#5555A5]" />
                        )}
                        <span>{isImage ? "IMAGE ATTACHED" : "PDF ATTACHED"}</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#77756F]">
                    Issued by <span className="text-[#191919] font-medium">{cert.issuingOrganization}</span> • {cert.issueDate}
                    {cert.expirationDate && ` (Expires: ${cert.expirationDate})`}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#77756F] font-mono">
                    {cert.credentialId && (
                      <span>
                        {cert.isSystemCredentialId || cert.credentialId.startsWith("SKC-")
                          ? `SkillChain ID: ${cert.credentialId}`
                          : `ID: ${cert.credentialId}`}
                      </span>
                    )}
                    {cert.fileHash && (
                      <span className="truncate max-w-xs" title={`SHA-256 Checksum: ${cert.fileHash}`}>
                        SHA-256: {cert.fileHash.slice(0, 16)}...
                      </span>
                    )}
                    {cert.fileSize && (
                      <span>Size: {formatFileSize(cert.fileSize)}</span>
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
                  {/* Upload / Replace Document Button */}
                  <Button
                    variant={hasDocument ? "outline" : "primary"}
                    size="sm"
                    onClick={() => openUploadModal(cert)}
                    className="text-xs"
                    disabled={isRevoked}
                  >
                    <Upload className="w-3.5 h-3.5 mr-1" />
                    <span>{hasDocument ? "Replace File" : "Upload File"}</span>
                  </Button>

                  {/* Document Preview & Download */}
                  {hasDocument && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAuthorizedPreview(cert.id)}
                        title="Preview certificate document in new tab"
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
                        title="Download certificate document"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </Button>
                    </>
                  )}

                  {/* External URL */}
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

      {/* --- ADD / EDIT CERTIFICATE MODAL WITH INTEGRATED FILE UPLOAD --- */}
      <Dialog
        open={modalOpen}
        onClose={() => !submitting && setModalOpen(false)}
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
            disabled={submitting}
          />

          <Input
            label="Issuing Organization"
            placeholder="e.g. Amazon Web Services, Stanford Online"
            value={issuingOrganization}
            onChange={(e) => setIssuingOrganization(e.target.value)}
            required
            disabled={submitting}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Issue Date"
              placeholder="e.g. Aug 2026"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              required
              disabled={submitting}
            />
            <Input
              label="Expiration Date (Optional)"
              placeholder="e.g. Aug 2029"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              disabled={submitting}
            />
          </div>

          <Input
            label="Credential ID / Code (Optional)"
            placeholder="e.g. AWS-PSA-829103 (Leave blank for SkillChain ID)"
            value={credentialId}
            onChange={(e) => setCredentialId(e.target.value)}
            disabled={submitting}
          />

          <Input
            label="Verification / Certificate URL (Optional)"
            placeholder="https://aws.amazon.com/verify/..."
            value={credentialUrl}
            onChange={(e) => setCredentialUrl(e.target.value)}
            disabled={submitting}
          />

          {/* Integrated File Upload Section */}
          <div className="space-y-2 pt-2 border-t border-[#DFDDD6]/70">
            <label className="block text-xs font-medium text-[#191919]">
              Certificate Document{" "}
              <span className="text-[#77756F] font-normal">
                (Optional — PDF, PNG, JPG up to 5 MB)
              </span>
            </label>

            {/* Hidden device file input */}
            <input
              type="file"
              ref={modalFileInputRef}
              onChange={handleModalFileSelect}
              accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
              className="hidden"
              disabled={submitting}
            />

            {!modalFile ? (
              <div
                onDragOver={handleModalDragOver}
                onDragLeave={handleModalDragLeave}
                onDrop={handleModalDrop}
                className={`border-2 border-dashed rounded-[6px] p-5 text-center transition-all ${
                  isModalDragging
                    ? "border-[#5555A5] bg-[#5555A5]/5"
                    : "border-[#DFDDD6] bg-[#FCFCFB] hover:border-[#5555A5]/60 hover:bg-[#FAF9F5]"
                }`}
              >
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-9 h-9 rounded-full bg-[#F2F0EA] text-[#5555A5] flex items-center justify-center">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-[#191919] font-medium">
                      Drag &amp; drop certificate file here
                    </p>
                    <p className="text-[11px] text-[#77756F] mt-0.5">
                      or click below to choose a file from your device
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => modalFileInputRef.current?.click()}
                    disabled={submitting}
                    className="text-xs h-7 px-3 font-medium bg-[#FFFFFF]"
                  >
                    <FolderOpen className="w-3.5 h-3.5 mr-1.5 text-[#5555A5]" />
                    <span>Browse Files</span>
                  </Button>
                  <p className="text-[10px] text-[#77756F]">
                    Supports PDF, PNG, JPG, JPEG • Maximum 5 MB • Content magic-byte validated
                  </p>
                </div>
              </div>
            ) : (
              <div className="border border-[#DFDDD6] rounded-[6px] p-3.5 bg-[#FAF9F5] space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3 min-w-0">
                    {modalFilePreview ? (
                      <div className="relative w-14 h-14 rounded-[4px] border border-[#DFDDD6] overflow-hidden shrink-0 bg-[#FFFFFF]">
                        <img
                          src={modalFilePreview}
                          alt="Certificate preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-[4px] bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-xs font-semibold text-[#191919] truncate max-w-xs">
                          {modalFile.name}
                        </p>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FFFFFF] border border-[#DFDDD6] text-[#5555A5] uppercase">
                          {modalFile.name.split(".").pop()}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#77756F] font-mono mt-0.5">
                        {formatFileSize(modalFile.size)}
                      </p>
                      <p className="text-[10px] text-[#166534] mt-0.5 flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-1 shrink-0" />
                        Ready for SHA-256 cryptographic binding
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => modalFileInputRef.current?.click()}
                      disabled={submitting}
                      className="text-[11px] h-7 px-2"
                    >
                      Change
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearModalFile}
                      disabled={submitting}
                      className="text-[11px] h-7 px-2 text-[#DC2626] hover:bg-[#FEF2F2]"
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {modalFileError && (
              <div className="p-2.5 rounded-[4px] bg-[#FEF2F2] border border-[#FEE2E2] flex items-center space-x-2 text-xs text-[#B91C1C]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalFileError}</span>
              </div>
            )}
          </div>

          <div className="pt-2 flex justify-end space-x-2 border-t border-[#DFDDD6]/70">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={submitting}
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={submitting} size="sm" disabled={submitting}>
              {submitting ? (
                <span className="flex items-center">
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  {modalFile ? "Hashing & Saving..." : "Saving..."}
                </span>
              ) : editingCert ? (
                "Save Changes"
              ) : (
                "Record Certificate"
              )}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* --- STANDALONE UPLOAD / REPLACE DOCUMENT MODAL --- */}
      <Dialog
        open={uploadModalOpen}
        onClose={() => !uploading && setUploadModalOpen(false)}
        title="Upload Certificate Document"
        description={
          targetCert ? `Secure document storage for "${targetCert.title}"` : "Upload Document"
        }
      >
        <div className="space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleStandaloneFileSelect}
            accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
            className="hidden"
            disabled={uploading}
          />

          <div
            onDragOver={handleStandaloneDragOver}
            onDragLeave={handleStandaloneDragLeave}
            onDrop={handleStandaloneDrop}
            className={`border-2 border-dashed rounded-[6px] p-6 text-center transition-all ${
              isDragOver
                ? "border-[#5555A5] bg-[#5555A5]/5"
                : selectedFile
                ? "border-[#166534] bg-[#F0FDF4]/50"
                : "border-[#DFDDD6] bg-[#FCFCFB] hover:border-[#5555A5]/60 hover:bg-[#FAF9F5]"
            }`}
          >
            {selectedFile ? (
              <div className="space-y-3">
                {standalonePreview ? (
                  <div className="w-20 h-20 mx-auto rounded-[4px] border border-[#DFDDD6] overflow-hidden bg-[#FFFFFF]">
                    <img
                      src={standalonePreview}
                      alt="Selected preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 mx-auto rounded-full bg-[#166534]/10 text-[#166534] flex items-center justify-center">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <div className="text-xs font-semibold text-[#191919]">{selectedFile.name}</div>
                  <div className="text-[11px] text-[#77756F] font-mono mt-0.5">
                    {formatFileSize(selectedFile.size)} • Ready for cryptographic hashing
                  </div>
                </div>
                <div className="flex justify-center space-x-2 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="text-xs h-7"
                  >
                    Change File
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (standalonePreview) URL.revokeObjectURL(standalonePreview);
                      setSelectedFile(null);
                      setStandalonePreview(null);
                    }}
                    disabled={uploading}
                    className="text-xs h-7 text-[#DC2626]"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-10 h-10 mx-auto rounded-full bg-[#F2F0EA] text-[#5555A5] flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#191919]">
                    Drag &amp; drop certificate document here
                  </p>
                  <p className="text-[11px] text-[#77756F] mt-0.5">
                    or click the button to browse files from your device
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs h-7 px-3 bg-[#FFFFFF]"
                  disabled={uploading}
                >
                  <FolderOpen className="w-3.5 h-3.5 mr-1.5 text-[#5555A5]" />
                  <span>Browse Files</span>
                </Button>
                <p className="text-[10px] text-[#77756F]">
                  Supports PDF, PNG, JPG, JPEG • Maximum 5 MB • Content magic-byte validated
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
              <span>{uploading ? "Hashing & Uploading..." : "Upload & Bind Document"}</span>
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
