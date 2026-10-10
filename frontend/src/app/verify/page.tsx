"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { apiRequest, CertificateVerificationDto } from "@/lib/api";
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
  AlertCircle
} from "lucide-react";

export default function VerifyPage() {
  const [credentialId, setCredentialId] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<CertificateVerificationDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentialId.trim()) return;

    setLoading(true);
    setSearched(true);
    setError(null);

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
            Input a SkillChain credential identifier to inspect the cryptographic blockchain issuance record.
          </p>
        </div>

        <Card className="mb-6">
          <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Enter Credential ID (e.g. AWS-CERT-998877)"
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
                required
              />
            </div>
            <Button type="submit" loading={loading} className="shrink-0">
              <Search className="w-3.5 h-3.5 mr-2" />
              <span>Verify Record</span>
            </Button>
          </form>
        </Card>

        {error && (
          <div className="p-4 rounded-[4px] bg-[#FEF2F2] border border-[#FEE2E2] flex items-center space-x-2 text-xs text-[#B91C1C] mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {searched && result && (
          <div className="space-y-4">
            {result.status === "NOT_FOUND" ? (
              <div className="p-5 rounded-[4px] border border-[#DFDDD6] bg-[#FFFFFF] space-y-3">
                <div className="flex items-center space-x-2 text-xs font-semibold text-[#854D0E]">
                  <AlertTriangle className="w-4 h-4 text-[#854D0E]" />
                  <span>Record Not Found</span>
                </div>
                <p className="text-xs text-[#77756F] leading-relaxed">
                  The credential identifier <span className="font-mono text-[#191919] font-medium">{credentialId}</span> could not be verified in the active ledger. Ensure the code was transcribed accurately from the certificate documentation.
                </p>
                <div className="pt-2 text-[11px] text-[#77756F] border-t border-[#DFDDD6]">
                  Note: SkillChain verifies cryptographic integrity against attested records. Unregistered or altered credentials will fail verification.
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
                    <p className="font-mono font-medium text-[#191919] mt-0.5">{result.credentialId || credentialId}</p>
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

                {result.blockHash && (
                  <div className="text-[11px] font-mono text-[#77756F] bg-[#FFFFFF] p-2.5 rounded border border-[#DFDDD6] truncate">
                    <span>Block #{result.blockIndex ?? "N/A"} Hash: </span>
                    <span className="text-[#191919]">{result.blockHash}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-5 rounded-[4px] border border-[#DFDDD6] bg-[#FFFFFF] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-[#166534]" />
                    <span className="text-sm font-semibold text-[#166534]">Cryptographically Verified on SHA-256 Ledger</span>
                  </div>
                  <Badge variant="success">Attested & Anchored</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-[#DFDDD6]">
                  <div>
                    <span className="text-[#77756F]">Certificate Title:</span>
                    <p className="font-medium text-[#191919] mt-0.5">{result.certificateTitle || "Attested Credential"}</p>
                  </div>
                  <div>
                    <span className="text-[#77756F]">Issuing Entity:</span>
                    <p className="font-medium text-[#191919] mt-0.5">{result.issuingOrganization || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-[#77756F]">Credential ID:</span>
                    <p className="font-mono font-medium text-[#191919] mt-0.5">{result.credentialId || credentialId}</p>
                  </div>
                  <div>
                    <span className="text-[#77756F]">Ledger Anchored:</span>
                    <p className="font-mono font-medium text-[#191919] mt-0.5">
                      {result.issuedOrAnchoredAt ? new Date(result.issuedOrAnchoredAt).toLocaleDateString() : "Verified Block"}
                    </p>
                  </div>
                </div>

                {/* Ledger Proof Details */}
                <div className="p-3 bg-[#FAF9F6] rounded border border-[#DFDDD6] space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#77756F]">
                    <span>BLOCK #{result.blockIndex ?? 0}</span>
                    <span className="text-[#166534] font-medium">CRYPTOGRAPHIC PROOF</span>
                  </div>
                  {result.blockHash && (
                    <div className="text-[11px] font-mono text-[#77756F] truncate">
                      <span>Hash: </span>
                      <span className="text-[#191919]">{result.blockHash}</span>
                    </div>
                  )}
                  {result.previousBlockHash && (
                    <div className="text-[11px] font-mono text-[#77756F] truncate">
                      <span>Prev: </span>
                      <span className="text-[#191919]">{result.previousBlockHash}</span>
                    </div>
                  )}
                  {result.certificateFingerprint && (
                    <div className="text-[11px] font-mono text-[#77756F] truncate">
                      <span>Fingerprint: </span>
                      <span className="text-[#5555A5]">{result.certificateFingerprint}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
