package com.skillchain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CertificateRequest {

    @NotBlank(message = "Certificate title is required")
    @Size(max = 150, message = "Title cannot exceed 150 characters")
    private String title;

    @NotBlank(message = "Issuing organization is required")
    @Size(max = 150, message = "Issuing organization cannot exceed 150 characters")
    private String issuingOrganization;

    @NotBlank(message = "Issue date is required")
    @Size(max = 30, message = "Issue date cannot exceed 30 characters")
    private String issueDate;

    @Size(max = 30, message = "Expiration date cannot exceed 30 characters")
    private String expirationDate;

    @Size(max = 100, message = "Credential ID cannot exceed 100 characters")
    private String credentialId;

    @Size(max = 255, message = "Credential URL cannot exceed 255 characters")
    private String credentialUrl;

    public CertificateRequest() {
    }

    public CertificateRequest(String title, String issuingOrganization, String issueDate,
                              String expirationDate, String credentialId, String credentialUrl) {
        this.title = title;
        this.issuingOrganization = issuingOrganization;
        this.issueDate = issueDate;
        this.expirationDate = expirationDate;
        this.credentialId = credentialId;
        this.credentialUrl = credentialUrl;
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
}
