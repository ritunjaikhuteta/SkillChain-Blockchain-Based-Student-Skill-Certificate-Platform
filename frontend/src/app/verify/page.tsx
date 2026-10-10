"use client";

import React, { useState, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { apiRequest, CertificateVerificationDto, API_BASE } from "@/lib/api";
import {
  ShieldCheck,
  Search,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Ban,
  Clock,
  Database,
  Lock,
  FileCheck2,
  AlertCircle,
  Upload,
  FileText,
  FileSearch,
  CheckCircle2,
  XCircle,
  Info,
  FolderOpen
} from "lucide-react";

export default function VerifyPage() {
  const [activeTab, setActiveTab] = useState<"id" | "file">("id");

  // Verify by ID
  const [credentialId, setCredentialId] = useState("");

  // Verify by File
  const [verifyFile, setVerifyFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<CertificateVerificationDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerifyById = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentialId.trim()) return;

    setLoading(true);
    setSearched(true);
    setError(null);
    setResult(null);

    try {
      const data = await apiRequest<CertificateVerificationDto>(
        `/certificates/verify/${encodeURIComponent(credentialId.trim())}`
      );
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to communicate with cryptographic ledger");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyByFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyFile) {
      setFileError("Please select a certificate document to verify.");
      return;
    }

    setLoading(true);
    setSearched(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", verifyFile);

      const res = await fetch(`${API_BASE}/certificates/verify/file`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "File verification request failed");
      }

      const data: CertificateVerificationDto = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to verify file hash against ledger");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setFileError(null);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const f = e.dataTransfer.files[0];
      if (f.size > 5 * 1024 * 1024) {
        setFileError("File exceeds 5 MB limit. Please select a file under 5 MB.");
        return;
      }
      setVerifyFile(f);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    if (e.target.files && e.target.files.length > 0) {
      const f = e.target.files[0];
      if (f.size > 5 * 1024 * 1024) {
        setFileError("File exceeds 5 MB limit. Please select a file under 5 MB.");
        return;
      }
      setVerifyFile(f);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F3]">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-[3px] bg-[#F0EFF8] text-xs font-medium text-[#5555A5] mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Cryptographic Verification Registry</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#191919]">
            Verify Certificate Authenticity
          </h1>
          <p className="text-xs text-[#77756F] max-w-md mx-auto">
            Inspect immutable blockchain issuance proofs or verify the cryptographic SHA-256 integrity
            of an uploaded certificate document.
          </p>
        </div>

        {/* Verification Mode Selector */}
        <div className="flex border-b border-[#DFDDD6] mb-6">
          <button
            type="button"
            onClick={() => {
              setActiveTab("id");
              setSearched(false);
              setError(null);
            }}
            className={`flex items-center space-x-2 py-2.5 px-4 text-xs font-medium border-b-2 transition-colors ${
              activeTab === "id"
                ? "border-[#5555A5] text-[#5555A5]"
                : "border-transparent text-[#77756F] hover:text-[#191919]"
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Verify by Credential ID</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("file");
              setSearched(false);
              setError(null);
            }}
            className={`flex items-center space-x-2 py-2.5 px-4 text-xs font-medium border-b-2 transition-colors ${
              activeTab === "file"
                ? "border-[#5555A5] text-[#5555A5]"
                : "border-transparent text-[#77756F] hover:text-[#191919]"
            }`}
          >
            <FileSearch className="w-3.5 h-3.5" />
            <span>Verify by Certificate Document (File Hash)</span>
          </button>
        </div>

        {/* Mode 1: Credential ID Input */}
        {activeTab === "id" && (
          <Card className="mb-6">
            <form onSubmit={handleVerifyById} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Enter Credential ID (e.g. SKC-E7045932 or AWS-CERT-998877)"
                  value={credentialId}
                  onChange={(e) => setCredentialId(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" loading={loading} className="shrink-0">
                <Search className="w-3.5 h-3.5 mr-2" />
                <span>Verify Credential</span>
              </Button>
            </form>
          </Card>
        )}

        {/* Mode 2: File Upload Verification */}
        {activeTab === "file" && (
          <Card className="mb-6">
            <form onSubmit={handleVerifyByFile} className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                className="hidden"
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                }}
                onDrop={handleFileDrop}
                className={`border-2 border-dashed rounded-[6px] p-6 text-center transition-all ${
                  isDragOver
                    ? "border-[#5555A5] bg-[#5555A5]/5"
                    : verifyFile
                    ? "border-[#166534] bg-[#F0FDF4]/50"
                    : "border-[#DFDDD6] bg-[#FCFCFB] hover:border-[#5555A5]/60 hover:bg-[#FAF9F5]"
                }`}
              >
                {verifyFile ? (
                  <div className="space-y-2">
                    <div className="w-10 h-10 mx-auto rounded-full bg-[#166534]/10 text-[#166534] flex items-center justify-center">
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-semibold text-[#191919]">{verifyFile.name}</div>
                    <div className="text-[11px] text-[#77756F] font-mono">
                      {(verifyFile.size / 1024 < 1024)
                        ? `${(verifyFile.size / 1024).toFixed(1)} KB`
                        : `${(verifyFile.size / (1024 * 1024)).toFixed(2)} MB`}{" "}
                      • Ready to compute cryptographic SHA-256 fingerprint
                    </div>
                    <div className="pt-1 flex justify-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs h-7"
                      >
                        Change File
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setVerifyFile(null)}
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
                        Upload certificate document to check integrity
                      </p>
                      <p className="text-[11px] text-[#77756F] mt-0.5">
                        Drop PDF or image here, or browse from your device
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs h-7 px-3 bg-[#FFFFFF]"
                    >
                      <FolderOpen className="w-3.5 h-3.5 mr-1.5 text-[#5555A5]" />
                      <span>Browse Files</span>
                    </Button>
                    <p className="text-[10px] text-[#77756F]">
                      Supports PDF, PNG, JPG, JPEG • Maximum 5 MB
                    </p>
                  </div>
                )}
              </div>

              {fileError && (
                <div className="p-2.5 rounded-[4px] bg-[#FEF2F2] border border-[#FEE2E2] flex items-center space-x-2 text-xs text-[#B91C1C]">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{fileError}</span>
                </div>
              )}

              <div className="flex justify-end">
                <Button type="submit" loading={loading} disabled={!verifyFile || loading} size="sm">
                  <FileSearch className="w-3.5 h-3.5 mr-1.5" />
                  <span>Verify Document Hash</span>
                </Button>
              </div>
            </form>
          </Card>
        )}

        {error && (
          <div className="p-4 rounded-[4px] bg-[#FEF2F2] border border-[#FEE2E2] flex items-center space-x-2 text-xs text-[#B91C1C] mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {searched && result && (
          <div className="space-y-5">
            {result.status === "NOT_FOUND" ? (
              <div className="p-5 rounded-[4px] border border-[#DFDDD6] bg-[#FFFFFF] space-y-3">
                <div className="flex items-center space-x-2 text-xs font-semibold text-[#854D0E]">
                  <AlertTriangle className="w-4 h-4 text-[#854D0E]" />
                  <span>Ledger Record Not Found</span>
                </div>
                <p className="text-xs text-[#77756F] leading-relaxed">
                  {result.message || "No verified blockchain block matches the provided identifier or file checksum."}
                </p>
                <div className="pt-2 text-[11px] text-[#77756F] border-t border-[#DFDDD6]">
                  Note: SkillChain verifies cryptographic authenticity against attested ledger blocks. Unregistered credentials or modified files will fail verification.
                </div>
              </div>
            ) : result.status === "REVOKED" || result.revoked ? (
              <div className="p-5 rounded-[4px] border border-[#DC2626]/30 bg-[#FEF2F2]/60 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Ban className="w-4 h-4 text-[#DC2626]" />
                    <span className="text-sm font-semibold text-[#DC2626]">Credential Formally Revoked</span>
                  </div>
                  <Badge variant="destructive">REVOKED ON LEDGER</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-3 border-t border-[#DC2626]/20">
                  <div>
                    <span className="text-[#77756F]">Certificate Title:</span>
                    <p className="font-medium text-[#191919] mt-0.5">{result.certificateTitle || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-[#77756F]">Issuing Organization:</span>
                    <p className="font-medium text-[#191919] mt-0.5">{result.issuingOrganization || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-[#77756F]">Credential ID:</span>
                    <p className="font-mono font-medium text-[#191919] mt-0.5">
                      {result.credentialId || credentialId}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#77756F]">Revocation Date:</span>
                    <p className="font-mono font-medium text-[#DC2626] mt-0.5">
                      {result.revokedAt ? new Date(result.revokedAt).toLocaleString() : "Recorded on ledger"}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-[#FFFFFF] rounded border border-[#DC2626]/20 text-xs">
                  <span className="text-[#77756F] block text-[11px] uppercase font-mono">Revocation Reason:</span>
                  <span className="font-medium text-[#991B1B] mt-0.5 block">
                    {result.revocationReason || "Revoked by platform administrator"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-[4px] border border-[#DFDDD6] bg-[#FFFFFF] space-y-5">
                {/* Header Status */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-[#166534]" />
                    <span className="text-sm font-semibold text-[#166534]">
                      Cryptographically Verified on SHA-256 Ledger
                    </span>
                  </div>
                  <Badge variant="success">Attested &amp; Anchored</Badge>
                </div>

                {/* Primary Certificate Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-3 border-t border-[#DFDDD6]">
                  <div>
                    <span className="text-[#77756F]">Certificate Title:</span>
                    <p className="font-medium text-[#191919] mt-0.5">{result.certificateTitle || "Attested Credential"}</p>
                  </div>
                  <div>
                    <span className="text-[#77756F]">Issuing Entity:</span>
                    <p className="font-medium text-[#191919] mt-0.5">{result.issuingOrganization || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-[#77756F]">
                      {result.isSystemCredentialId || result.credentialId?.startsWith("SKC-")
                        ? "SkillChain Credential ID (Platform Generated):"
                        : "Issuer Credential ID:"}
                    </span>
                    <p className="font-mono font-medium text-[#191919] mt-0.5">
                      {result.credentialId || credentialId}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#77756F]">Ledger Anchored Date:</span>
                    <p className="font-mono font-medium text-[#191919] mt-0.5">
                      {result.issuedOrAnchoredAt ? new Date(result.issuedOrAnchoredAt).toLocaleDateString() : "Verified Block"}
                    </p>
                  </div>
                </div>

                {/* --- 3-TIER VERIFICATION BREAKDOWN --- */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-semibold text-[#191919] uppercase tracking-wider font-mono">
                    Multi-Dimensional Verification Breakdown
                  </h4>

                  {/* Dimension 1: Blockchain Ledger Record */}
                  <div className="p-3 bg-[#FAF9F6] rounded border border-[#DFDDD6] text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-[#166534]" />
                        <span className="font-medium text-[#191919]">1. Blockchain Ledger Record</span>
                      </div>
                      <span className="text-[10px] font-mono font-medium text-[#166534] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0]">
                        ANCHORED &amp; VALID
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-[#77756F] space-y-1">
                      <div className="truncate">Block #{result.blockIndex ?? 0} Hash: <span className="text-[#191919]">{result.blockHash}</span></div>
                      {result.previousBlockHash && (
                        <div className="truncate">Prev Hash: <span className="text-[#191919]">{result.previousBlockHash}</span></div>
                      )}
                    </div>
                  </div>

                  {/* Dimension 2: Uploaded Document Hash Integrity */}
                  <div className="p-3 bg-[#FAF9F6] rounded border border-[#DFDDD6] text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {result.hasDocument ? (
                          result.fileIntegrityVerified ? (
                            <CheckCircle2 className="w-4 h-4 text-[#166534]" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
                          )
                        ) : (
                          <Info className="w-4 h-4 text-[#77756F]" />
                        )}
                        <span className="font-medium text-[#191919]">2. Document File Hash Integrity</span>
                      </div>

                      {result.hasDocument ? (
                        result.fileIntegrityVerified ? (
                          <span className="text-[10px] font-mono font-medium text-[#166534] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0]">
                            SHA-256 INTEGRITY VERIFIED
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono font-medium text-[#DC2626] bg-[#FEF2F2] px-2 py-0.5 rounded border border-[#FECACA]">
                            INTEGRITY MISMATCH
                          </span>
                        )
                      ) : (
                        <span className="text-[10px] font-mono text-[#77756F] bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#DFDDD6]">
                          NO DOCUMENT ATTACHED
                        </span>
                      )}
                    </div>

                    {result.hasDocument ? (
                      <div className="text-[11px] font-mono text-[#77756F] space-y-1">
                        <div>Document File: <span className="text-[#191919] font-medium">{result.fileName || "Uploaded document"}</span></div>
                        {result.fileHash && (
                          <div className="truncate" title={result.fileHash}>
                            SHA-256 Checksum: <span className="text-[#5555A5]">{result.fileHash}</span>
                          </div>
                        )}
                        <p className="text-[10px] text-[#166534] font-sans">
                          The cryptographic hash of the document was verified against the immutable block payload. Any tampering with file contents would alter this hash.
                        </p>
                      </div>
                    ) : (
                      <p className="text-[11px] text-[#77756F]">
                        This certificate was registered by metadata without an attached file document.
                      </p>
                    )}
                  </div>

                  {/* Dimension 3: External Issuer Independent Status */}
                  <div className="p-3 bg-[#FAF9F6] rounded border border-[#DFDDD6] text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Info className="w-4 h-4 text-[#77756F]" />
                        <span className="font-medium text-[#191919]">3. External Issuer Attestation</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#77756F] bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#DFDDD6]">
                        INDEPENDENT VERIFICATION NOTICE
                      </span>
                    </div>
                    <p className="text-[11px] text-[#77756F] leading-relaxed pt-1">
                      {result.verificationNotice ||
                        "SkillChain cryptographically verifies ledger existence and uploaded document SHA-256 hash integrity. This does not represent an independent direct validation by the external issuing organization."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
