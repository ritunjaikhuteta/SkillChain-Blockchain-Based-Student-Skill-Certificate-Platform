package com.skillchain.dto;

import com.skillchain.model.Certificate;

import java.time.LocalDateTime;

public class CertificateResponse {

    private Long id;
    private String title;
    private String issuingOrganization;
    private String issueDate;
    private String expirationDate;
    private String credentialId;
    private String credentialUrl;
    private String blockchainHash;
    private String fingerprint;
    private boolean verified;
    private boolean isRevoked;
    private String revocationReason;
    private LocalDateTime revokedAt;
    private String fileName;
    private String fileHash;
    private Long fileSize;
    private String contentType;
    private String storageProvider;
    @com.fasterxml.jackson.annotation.JsonProperty("isSystemCredentialId")
    private boolean isSystemCredentialId;
    private boolean hasDocument;
    private String fileUrl;
    private LocalDateTime createdAt;

    public CertificateResponse() {
    }

    public CertificateResponse(Certificate cert) {
        this.id = cert.getId();
        this.title = cert.getTitle();
        this.issuingOrganization = cert.getIssuingOrganization();
        this.issueDate = cert.getIssueDate();
        this.expirationDate = cert.getExpirationDate();
        this.credentialId = cert.getCredentialId();
        this.credentialUrl = cert.getCredentialUrl();
        this.blockchainHash = cert.getBlockchainHash();
        this.fingerprint = cert.getFingerprint();
        this.isRevoked = cert.isRevoked();
        this.verified = cert.getBlockchainHash() != null && !cert.isRevoked();
        this.revocationReason = cert.getRevocationReason();
        this.revokedAt = cert.getRevokedAt();
        this.fileName = cert.getFileName();
        this.fileHash = cert.getFileHash();
        this.fileSize = cert.getFileSize();
        this.contentType = cert.getContentType();
        this.storageProvider = cert.getStorageProvider();
        this.isSystemCredentialId = cert.isSystemCredentialId();
        this.hasDocument = cert.getFileName() != null || cert.getFileHash() != null;
        this.fileUrl = cert.getFileKey() != null ? "/api/files/certificates/" + cert.getId() + "/download" : null;
        this.createdAt = cert.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getIssuingOrganization() {
        return issuingOrganization;
    }

    public void setIssuingOrganization(String issuingOrganization) {
        this.issuingOrganization = issuingOrganization;
    }

    public String getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(String issueDate) {
        this.issueDate = issueDate;
    }

    public String getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(String expirationDate) {
        this.expirationDate = expirationDate;
    }

    public String getCredentialId() {
        return credentialId;
    }

    public void setCredentialId(String credentialId) {
        this.credentialId = credentialId;
    }

    public String getCredentialUrl() {
        return credentialUrl;
    }

    public void setCredentialUrl(String credentialUrl) {
        this.credentialUrl = credentialUrl;
    }

    public String getBlockchainHash() {
        return blockchainHash;
    }

    public void setBlockchainHash(String blockchainHash) {
        this.blockchainHash = blockchainHash;
    }

    public String getFingerprint() {
        return fingerprint;
    }

    public void setFingerprint(String fingerprint) {
        this.fingerprint = fingerprint;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public boolean isRevoked() {
        return isRevoked;
    }

    public void setRevoked(boolean revoked) {
        isRevoked = revoked;
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

    public String getStorageProvider() {
        return storageProvider;
    }

    public void setStorageProvider(String storageProvider) {
        this.storageProvider = storageProvider;
    }

    public boolean isSystemCredentialId() {
        return isSystemCredentialId;
    }

    public void setSystemCredentialId(boolean systemCredentialId) {
        isSystemCredentialId = systemCredentialId;
    }

    public boolean isHasDocument() {
        return hasDocument;
    }

    public void setHasDocument(boolean hasDocument) {
        this.hasDocument = hasDocument;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
