package com.skillchain.dto;

import java.time.LocalDateTime;

public class CertificateVerificationDto {

    private boolean verified;
    private String status; // "VERIFIED", "REVOKED", "NOT_FOUND", "TAMPERED"
    private String message;
    private Long blockIndex;
    private String blockHash;
    private String previousBlockHash;
    private String credentialId;
    private String certificateTitle;
    private String issuingOrganization;
    private String certificateFingerprint;
    private LocalDateTime issuedOrAnchoredAt;
    private boolean revoked;
    private String revocationReason;
    private LocalDateTime revokedAt;

    // Document and Multi-Dimensional Verification
    private boolean hasDocument = false;
    private String fileName;
    private String fileHash;
    private Long fileSize;
    private String contentType;
    private Boolean fileIntegrityVerified;
    private boolean recordExists = false;
    private boolean ledgerAnchored = false;
    private boolean issuerDirectlyAuthenticated = false;
    @com.fasterxml.jackson.annotation.JsonProperty("isSystemCredentialId")
    private boolean isSystemCredentialId = false;
    private String verificationNotice;

    public CertificateVerificationDto() {
    }

    public static CertificateVerificationDto notFound(String identifier) {
        CertificateVerificationDto dto = new CertificateVerificationDto();
        dto.setVerified(false);
        dto.setStatus("NOT_FOUND");
        dto.setMessage("No ledger record found for identifier: " + identifier);
        return dto;
    }

    public static CertificateVerificationDto revoked(Long blockIndex, String blockHash, String credentialId,
                                                     String title, String org, String reason, LocalDateTime revokedAt) {
        CertificateVerificationDto dto = new CertificateVerificationDto();
        dto.setVerified(false);
        dto.setStatus("REVOKED");
        dto.setMessage("This certificate was formally revoked on the blockchain ledger.");
        dto.setBlockIndex(blockIndex);
        dto.setBlockHash(blockHash);
        dto.setCredentialId(credentialId);
        dto.setCertificateTitle(title);
        dto.setIssuingOrganization(org);
        dto.setRevoked(true);
        dto.setRevocationReason(reason);
        dto.setRevokedAt(revokedAt);
        return dto;
    }

    public static CertificateVerificationDto verified(Long blockIndex, String blockHash, String previousBlockHash,
                                                      String credentialId, String title, String org,
                                                      String fingerprint, LocalDateTime timestamp) {
        CertificateVerificationDto dto = new CertificateVerificationDto();
        dto.setVerified(true);
        dto.setStatus("VERIFIED");
        dto.setMessage("Cryptographically verified on SkillChain SHA-256 Ledger.");
        dto.setBlockIndex(blockIndex);
        dto.setBlockHash(blockHash);
        dto.setPreviousBlockHash(previousBlockHash);
        dto.setCredentialId(credentialId);
        dto.setCertificateTitle(title);
        dto.setIssuingOrganization(org);
        dto.setCertificateFingerprint(fingerprint);
        dto.setIssuedOrAnchoredAt(timestamp);
        dto.setRevoked(false);
        return dto;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getBlockIndex() {
        return blockIndex;
    }

    public void setBlockIndex(Long blockIndex) {
        this.blockIndex = blockIndex;
    }

    public String getBlockHash() {
        return blockHash;
    }

    public void setBlockHash(String blockHash) {
        this.blockHash = blockHash;
    }

    public String getPreviousBlockHash() {
        return previousBlockHash;
    }

    public void setPreviousBlockHash(String previousBlockHash) {
        this.previousBlockHash = previousBlockHash;
    }

    public String getCredentialId() {
        return credentialId;
    }

    public void setCredentialId(String credentialId) {
        this.credentialId = credentialId;
    }

    public String getCertificateTitle() {
        return certificateTitle;
    }

    public void setCertificateTitle(String certificateTitle) {
        this.certificateTitle = certificateTitle;
    }

    public String getIssuingOrganization() {
        return issuingOrganization;
    }

    public void setIssuingOrganization(String issuingOrganization) {
        this.issuingOrganization = issuingOrganization;
    }

    public String getCertificateFingerprint() {
        return certificateFingerprint;
    }

    public void setCertificateFingerprint(String certificateFingerprint) {
        this.certificateFingerprint = certificateFingerprint;
    }

    public LocalDateTime getIssuedOrAnchoredAt() {
        return issuedOrAnchoredAt;
    }

    public void setIssuedOrAnchoredAt(LocalDateTime issuedOrAnchoredAt) {
        this.issuedOrAnchoredAt = issuedOrAnchoredAt;
    }

    public boolean isRevoked() {
        return revoked;
    }

    public void setRevoked(boolean revoked) {
        this.revoked = revoked;
    }

    public String getRevocationReason() {
        return revocationReason;
    }

    public void setRevocationReason(String revocationReason) {
        this.revocationReason = revocationReason;
    }

    public LocalDateTime getRevokedAt() {
        return revokedAt;
    }

    public void setRevokedAt(LocalDateTime revokedAt) {
        this.revokedAt = revokedAt;
    }

    public boolean isHasDocument() {
        return hasDocument;
    }

    public void setHasDocument(boolean hasDocument) {
        this.hasDocument = hasDocument;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileHash() {
        return fileHash;
    }

    public void setFileHash(String fileHash) {
        this.fileHash = fileHash;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public Boolean getFileIntegrityVerified() {
        return fileIntegrityVerified;
    }

    public void setFileIntegrityVerified(Boolean fileIntegrityVerified) {
        this.fileIntegrityVerified = fileIntegrityVerified;
    }

    public boolean isRecordExists() {
        return recordExists;
    }

    public void setRecordExists(boolean recordExists) {
        this.recordExists = recordExists;
    }

    public boolean isLedgerAnchored() {
        return ledgerAnchored;
    }

    public void setLedgerAnchored(boolean ledgerAnchored) {
        this.ledgerAnchored = ledgerAnchored;
    }

    public boolean isIssuerDirectlyAuthenticated() {
        return issuerDirectlyAuthenticated;
    }

    public void setIssuerDirectlyAuthenticated(boolean issuerDirectlyAuthenticated) {
        this.issuerDirectlyAuthenticated = issuerDirectlyAuthenticated;
    }

    public boolean isSystemCredentialId() {
        return isSystemCredentialId;
    }

    public void setSystemCredentialId(boolean systemCredentialId) {
        isSystemCredentialId = systemCredentialId;
    }

    public String getVerificationNotice() {
        return verificationNotice;
    }

    public void setVerificationNotice(String verificationNotice) {
        this.verificationNotice = verificationNotice;
    }
}
