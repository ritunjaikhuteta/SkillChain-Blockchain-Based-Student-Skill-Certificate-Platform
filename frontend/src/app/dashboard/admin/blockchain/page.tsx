"use client";

import React, { useEffect, useState } from "react";
import {
  apiRequest,
  BlockchainStatusDto,
  ChainValidationResultDto,
  BlockchainBlock
} from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Cpu,
  Database,
  Lock,
  AlertTriangle,
  Ban,
  Clock,
  Layers,
  FileText,
  Search,
  ExternalLink,
  ChevronDown,
  Check
} from "lucide-react";

export default function AdminBlockchainPage() {
  const [status, setStatus] = useState<BlockchainStatusDto | null>(null);
  const [validation, setValidation] = useState<ChainValidationResultDto | null>(null);
  const [blocks, setBlocks] = useState<BlockchainBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Revocation Modal
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<BlockchainBlock | null>(null);
  const [revocationReason, setRevocationReason] = useState("");
  const [revoking, setRevoking] = useState(false);

  // Search filter
  const [filterQuery, setFilterQuery] = useState("");

  const loadBlockchainData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statusData, auditData, blocksData] = await Promise.all([
        apiRequest<BlockchainStatusDto>("/admin/blockchain/status"),
        apiRequest<ChainValidationResultDto>("/admin/blockchain/validate"),
        apiRequest<BlockchainBlock[]>("/admin/blockchain/blocks"),
      ]);

      setStatus(statusData);
      setValidation(auditData);
      setBlocks(blocksData || []);
    } catch (err: any) {
      setError(err.message || "Failed to query cryptographic ledger node");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const triggerAudit = async () => {
    setValidating(true);
    try {
      const audit = await apiRequest<ChainValidationResultDto>("/admin/blockchain/validate");
      setValidation(audit);
      setActionMessage({
        type: audit.chainValid ? "success" : "error",
        text: audit.chainValid
          ? `Cryptographic audit verified ${audit.totalBlocksAudited} blocks with zero corruption.`
          : `Tampering detected across ${audit.corruptedBlockCount} blocks. Inspect error log below.`,
      });
    } catch (err: any) {
      setActionMessage({
        type: "error",
        text: err.message || "Failed to complete chain validation audit",
      });
    } finally {
      setValidating(false);
    }
  };

  const openRevokeModal = (block: BlockchainBlock) => {
    setSelectedBlock(block);
    setRevocationReason("");
    setRevokeModalOpen(true);
  };

  const handleRevokeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBlock || !selectedBlock.certificateId) return;

    if (!revocationReason.trim()) {
      alert("Please provide an explicit revocation justification.");
      return;
    }

    setRevoking(true);
    try {
      await apiRequest(`/admin/blockchain/revoke/${selectedBlock.certificateId}`, {
        method: "POST",
        body: JSON.stringify({ reason: revocationReason.trim() }),
      });

      setActionMessage({
        type: "success",
        text: `Certificate ID ${selectedBlock.certificateId} has been revoked on the immutable ledger.`,
      });

      setRevokeModalOpen(false);
      // Refresh blockchain state
      loadBlockchainData();
    } catch (err: any) {
      alert(err.message || "Revocation request failed");
    } finally {
      setRevoking(false);
    }
  };

  const filteredBlocks = blocks.filter((b) => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    return (
      b.hash.toLowerCase().includes(q) ||
      (b.credentialId && b.credentialId.toLowerCase().includes(q)) ||
      (b.certificateTitle && b.certificateTitle.toLowerCase().includes(q)) ||
      (b.issuingOrganization && b.issuingOrganization.toLowerCase().includes(q)) ||
      b.blockIndex.toString().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-[3px] bg-[#FFFFFF] border border-[#DFDDD6] text-[11px] font-mono text-[#5555A5] mb-2 font-medium">
            <Lock className="w-3 h-3" />
            <span>SHA-256 AUDIT LEDGER // CANONICAL CHAIN</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#191919]">
            Blockchain Ledger Explorer
          </h1>
          <p className="text-xs text-[#77756F] mt-1 leading-relaxed">
            Inspect immutable verification blocks, audit sequential hash links, and execute authorized
            certificate revocations.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={triggerAudit}
            loading={validating}
            className="font-medium"
          >
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-[#5555A5]" />
            <span>Audit Chain</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={loadBlockchainData}
            loading={loading}
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Action Notification */}
      {actionMessage && (
        <div
          className={`p-4 rounded-[4px] border flex items-center justify-between text-xs ${
            actionMessage.type === "success"
              ? "bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]"
              : "bg-[#FEF2F2] border-[#FECACA] text-[#B91C1C]"
          }`}
        >
          <div className="flex items-center space-x-2">
            {actionMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#166534]" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0 text-[#B91C1C]" />
            )}
            <span>{actionMessage.text}</span>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            className="text-[11px] font-mono underline ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Chain Integrity */}
        <Card>
          <div className="flex items-center justify-between text-xs text-[#77756F]">
            <span>Ledger Integrity</span>
            {validation?.chainValid ? (
              <CheckCircle2 className="w-4 h-4 text-[#166534]" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
            )}
          </div>
          <div
            className={`mt-2 text-2xl font-semibold font-mono ${
              validation?.chainValid ? "text-[#166534]" : "text-[#DC2626]"
            }`}
          >
            {validation?.chainValid ? "VERIFIED" : "CORRUPTED"}
          </div>
          <p className="text-[11px] text-[#77756F] mt-1 font-mono">
            {validation?.totalBlocksAudited || 0} blocks audited
          </p>
        </Card>

        {/* Total Blocks */}
        <Card>
          <div className="flex items-center justify-between text-xs text-[#77756F]">
            <span>Chain Length</span>
            <Layers className="w-4 h-4 text-[#5555A5]" />
          </div>
          <div className="mt-2 text-2xl font-semibold font-mono text-[#191919]">
            {status?.totalBlocks ?? blocks.length}
          </div>
          <p className="text-[11px] text-[#77756F] mt-1 font-mono">
            Latest Index: #{status?.latestBlockIndex ?? (blocks.length > 0 ? blocks.length - 1 : 0)}
          </p>
        </Card>

        {/* Total Revoked */}
        <Card>
          <div className="flex items-center justify-between text-xs text-[#77756F]">
            <span>Revoked Records</span>
            <Ban className="w-4 h-4 text-[#77756F]" />
          </div>
          <div className="mt-2 text-2xl font-semibold font-mono text-[#191919]">
            {status?.totalRevokedCertificates ?? blocks.filter((b) => b.revoked).length}
          </div>
          <p className="text-[11px] text-[#77756F] mt-1 font-mono">
            Recorded with actor audit
          </p>
        </Card>

        {/* Protocol Hash */}
        <Card>
          <div className="flex items-center justify-between text-xs text-[#77756F]">
            <span>Hashing Standard</span>
            <Lock className="w-4 h-4 text-[#5555A5]" />
          </div>
          <div className="mt-2 text-2xl font-semibold font-mono text-[#191919]">
            SHA-256
          </div>
          <p className="text-[11px] text-[#77756F] mt-1 font-mono">
            Canonical serialization
          </p>
        </Card>
      </div>

      {/* Validation Errors If Corrupted */}
      {validation && !validation.chainValid && validation.errorMessages.length > 0 && (
        <Card className="border-[#DC2626] bg-[#FEF2F2]">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#DC2626]">
              <AlertTriangle className="w-4 h-4" />
              <span>Chain Integrity Violations Detected</span>
            </div>
            <ul className="space-y-1 font-mono text-[11px] text-[#B91C1C] list-disc list-inside">
              {validation.errorMessages.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          </div>
        </Card>
      )}

      {/* Blocks Table Card */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#DFDDD6]">
          <div>
            <CardTitle>Ledger Blocks (Chronological Audit)</CardTitle>
            <p className="text-xs text-[#77756F] mt-0.5">
              Every block stores the SHA-256 hash of its canonical payload linked to the previous block hash.
            </p>
          </div>

          <div className="w-full sm:w-64">
            <Input
              placeholder="Search by hash, ID, title..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-[#F8F7F3] rounded-[4px] animate-pulse"
                />
              ))}
            </div>
          ) : filteredBlocks.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#77756F]">
              {filterQuery ? "No blocks match the current search query." : "No blocks currently on the ledger."}
            </div>
          ) : (
            <div className="divide-y divide-[#DFDDD6]">
              {filteredBlocks.map((block) => {
                const isGenesis = block.blockIndex === 0;

                return (
                  <div
                    key={block.id || block.blockIndex}
                    className="p-5 space-y-3 hover:bg-[#FAF9F6] transition-colors"
                  >
                    {/* Top Row: Index, Status, Title, Timestamp, Revoke Button */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="w-8 h-6 rounded-[3px] bg-[#191919] text-white flex items-center justify-center font-mono text-xs font-semibold">
                          #{block.blockIndex}
                        </span>

                        <span className="font-semibold text-sm text-[#191919]">
                          {block.certificateTitle || (isGenesis ? "Genesis Block" : "Certificate Record")}
                        </span>

                        {isGenesis ? (
                          <Badge variant="secondary">GENESIS</Badge>
                        ) : block.revoked ? (
                          <span className="inline-flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded-[3px] bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
                            <Ban className="w-3 h-3 text-[#DC2626]" />
                            <span>REVOKED</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded-[3px] bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]">
                            <CheckCircle2 className="w-3 h-3 text-[#166534]" />
                            <span>CONFIRMED</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-3 text-xs text-[#77756F]">
                        <span className="font-mono text-[11px] flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {block.timestamp ? new Date(block.timestamp).toLocaleString() : "—"}
                        </span>

                        {!isGenesis && !block.revoked && block.certificateId && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openRevokeModal(block)}
                            className="text-xs text-[#DC2626] hover:bg-[#FEF2F2] hover:border-[#DC2626]"
                          >
                            <Ban className="w-3 h-3 mr-1" />
                            <span>Revoke</span>
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-[#77756F]">
                      {block.issuingOrganization && (
                        <span>
                          Organization:{" "}
                          <strong className="text-[#191919] font-medium">
                            {block.issuingOrganization}
                          </strong>
                        </span>
                      )}
                      {block.credentialId && (
                        <span className="font-mono text-[11px]">
                          Credential ID: {block.credentialId}
                        </span>
                      )}
                      {block.certificateId && (
                        <span className="font-mono text-[11px]">
                          Cert Reference: #{block.certificateId}
                        </span>
                      )}
                    </div>

                    {/* Hashes Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                      <div className="p-2.5 rounded-[3px] bg-[#F8F7F3] border border-[#DFDDD6] overflow-hidden">
                        <span className="text-[#77756F] text-[10px] block mb-0.5">PREVIOUS BLOCK HASH:</span>
                        <span className="text-[#191919] truncate block" title={block.previousHash}>
                          {block.previousHash}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-[3px] bg-[#F8F7F3] border border-[#DFDDD6] overflow-hidden">
                        <span className="text-[#77756F] text-[10px] block mb-0.5">CURRENT BLOCK HASH:</span>
                        <span className="text-[#5555A5] font-semibold truncate block" title={block.hash}>
                          {block.hash}
                        </span>
                      </div>
                    </div>

                    {/* Revocation Metadata If Present */}
                    {block.revoked && (
                      <div className="p-3 rounded-[3px] bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#991B1B] space-y-1">
                        <div className="font-semibold flex items-center space-x-1.5">
                          <Ban className="w-3.5 h-3.5 text-[#DC2626]" />
                          <span>Revocation Record</span>
                        </div>
                        <p className="text-[11px]">Reason: {block.revocationReason || "Revoked by authority"}</p>
                        <p className="text-[10px] font-mono text-[#77756F]">
                          Revoked At: {block.revokedAt ? new Date(block.revokedAt).toLocaleString() : "—"} • Actor: {block.revokedBy || "System Admin"}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* --- REVOKE CONFIRMATION MODAL --- */}
      <Dialog
        open={revokeModalOpen}
        onClose={() => !revoking && setRevokeModalOpen(false)}
        title="Revoke Certificate on Blockchain"
        description={
          selectedBlock
            ? `Permanent revocation for Block #${selectedBlock.blockIndex} ("${selectedBlock.certificateTitle}")`
            : "Revoke Certificate"
        }
      >
        <form onSubmit={handleRevokeSubmit} className="space-y-4">
          <div className="p-3 rounded-[4px] bg-[#FEF2F2] border border-[#FEE2E2] text-xs text-[#B91C1C] space-y-1">
            <span className="font-semibold block">Irreversible Ledger Operation</span>
            <p className="text-[11px] leading-relaxed">
              Revocation writes a formal revocation state to the blockchain ledger and sets public status to REVOKED.
              The original cryptographic hash history is permanently preserved for auditability.
            </p>
          </div>

          <Input
            label="Revocation Justification / Reason"
            placeholder="e.g. Expired credential, fraudulent issue, institutional notice..."
            value={revocationReason}
            onChange={(e) => setRevocationReason(e.target.value)}
            required
          />

          <div className="pt-2 flex justify-end space-x-2 border-t border-[#DFDDD6]/70">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={revoking}
              onClick={() => setRevokeModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              loading={revoking}
              className="bg-[#DC2626] hover:bg-[#B91C1C] text-white"
            >
              <span>{revoking ? "Revoking..." : "Confirm Ledger Revocation"}</span>
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
