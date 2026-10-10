package com.skillchain.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "blockchain_blocks", indexes = {
    @Index(name = "idx_block_hash", columnList = "hash"),
    @Index(name = "idx_prev_hash", columnList = "previousHash"),
    @Index(name = "idx_credential_id", columnList = "credentialId"),
    @Index(name = "idx_fingerprint", columnList = "certificateFingerprint")
})
public class BlockchainBlock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, name = "block_index")
    private Long blockIndex;

    @Column(nullable = false, length = 64)
    private String previousHash;

    @Column(nullable = false, length = 64, unique = true)
    private String hash;

    @Column(name = "certificate_id")
    private Long certificateId;

    @Column(length = 100)
    private String credentialId;

    @Column(length = 64)
    private String certificateFingerprint;

    @Column(length = 150)
    private String certificateTitle;

    @Column(length = 150)
    private String issuingOrganization;

    @Column(length = 150)
    private String studentEmail;

    @Column(length = 150)
    private String issuerEmail;

    @Column(nullable = false)
    private boolean revoked = false;

    @Column(length = 255)
    private String revocationReason;

    private LocalDateTime revokedAt;

    @Column(length = 150)
    private String revokedBy;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    public BlockchainBlock() {
        this.timestamp = LocalDateTime.now();
    }

    public BlockchainBlock(Long blockIndex, String previousHash, String hash,
                           Long certificateId, String credentialId, String certificateFingerprint,
                           String certificateTitle, String issuingOrganization,
                           String studentEmail, String issuerEmail, LocalDateTime timestamp) {
        this.blockIndex = blockIndex;
        this.previousHash = previousHash;
        this.hash = hash;
        this.certificateId = certificateId;
        this.credentialId = credentialId;
        this.certificateFingerprint = certificateFingerprint;
        this.certificateTitle = certificateTitle;
        this.issuingOrganization = issuingOrganization;
        this.studentEmail = studentEmail;
        this.issuerEmail = issuerEmail;
        this.timestamp = timestamp != null ? timestamp : LocalDateTime.now();
        this.revoked = false;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getBlockIndex() {
        return blockIndex;
    }

    public void setBlockIndex(Long blockIndex) {
        this.blockIndex = blockIndex;
    }

    public String getPreviousHash() {
        return previousHash;
    }

    public void setPreviousHash(String previousHash) {
        this.previousHash = previousHash;
    }

    public String getHash() {
        return hash;
    }

    public void setHash(String hash) {
        this.hash = hash;
    }

    public Long getCertificateId() {
        return certificateId;
    }

    public void setCertificateId(Long certificateId) {
        this.certificateId = certificateId;
    }

    public String getCredentialId() {
        return credentialId;
    }

    public void setCredentialId(String credentialId) {
        this.credentialId = credentialId;
    }

    public String getCertificateFingerprint() {
        return certificateFingerprint;
    }

    public void setCertificateFingerprint(String certificateFingerprint) {
        this.certificateFingerprint = certificateFingerprint;
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

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }

    public String getIssuerEmail() {
        return issuerEmail;
    }

    public void setIssuerEmail(String issuerEmail) {
        this.issuerEmail = issuerEmail;
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

    public String getRevokedBy() {
        return revokedBy;
    }

    public void setRevokedBy(String revokedBy) {
        this.revokedBy = revokedBy;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
