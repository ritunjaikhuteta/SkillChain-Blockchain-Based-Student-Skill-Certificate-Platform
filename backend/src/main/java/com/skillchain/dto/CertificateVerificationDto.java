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
}
