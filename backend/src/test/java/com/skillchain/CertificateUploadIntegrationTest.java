package com.skillchain;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillchain.dto.RegisterRequest;
import com.skillchain.model.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class CertificateUploadIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String studentToken;
    private String studentEmail;

    @BeforeEach
    void setUp() throws Exception {
        studentEmail = "student_uploader_" + System.currentTimeMillis() + "@skillchain.com";
        RegisterRequest registerReq = new RegisterRequest("Test Student", studentEmail, "Password@123", Role.STUDENT);

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerReq)))
                .andExpect(status().isCreated())
                .andReturn();

        studentToken = objectMapper.readTree(result.getResponse().getContentAsString()).get("token").asText();
    }

    @Test
    @DisplayName("Upload valid PDF certificate file creates certificate and anchors to blockchain")
    void testCreateCertificateWithPdf() throws Exception {
        byte[] pdfBytes = "%PDF-1.7\nSample SkillChain AWS Certified Developer document content.".getBytes();
        MockMultipartFile file = new MockMultipartFile(
                "file", "cert-dev.pdf", "application/pdf", pdfBytes
        );

        String credId = "AWS-DEV-" + System.currentTimeMillis();

        mockMvc.perform(multipart("/api/student/certificates")
                        .file(file)
                        .param("title", "AWS Certified Developer")
                        .param("issuingOrganization", "Amazon Web Services")
                        .param("issueDate", "2026-05")
                        .param("credentialId", credId)
                        .param("credentialUrl", "https://aws.amazon.com/verify")
                        .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("AWS Certified Developer"))
                .andExpect(jsonPath("$.issuingOrganization").value("Amazon Web Services"))
                .andExpect(jsonPath("$.credentialId").value(credId))
                .andExpect(jsonPath("$.fileName").value("cert-dev.pdf"))
                .andExpect(jsonPath("$.contentType").value("application/pdf"))
                .andExpect(jsonPath("$.fileHash").isNotEmpty())
                .andExpect(jsonPath("$.blockchainHash").isNotEmpty())
                .andExpect(jsonPath("$.hasDocument").value(true));

        // Public verification by credential ID
        mockMvc.perform(get("/api/certificates/verify/" + credId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.verified").value(true))
                .andExpect(jsonPath("$.status").value("VERIFIED"))
                .andExpect(jsonPath("$.hasDocument").value(true))
                .andExpect(jsonPath("$.fileIntegrityVerified").value(true))
                .andExpect(jsonPath("$.issuerDirectlyAuthenticated").value(false))
                .andExpect(jsonPath("$.recordExists").value(true))
                .andExpect(jsonPath("$.ledgerAnchored").value(true));
    }

    @Test
    @DisplayName("Upload valid PNG certificate image succeeds with image content type")
    void testCreateCertificateWithPng() throws Exception {
        byte[] pngBytes = new byte[]{(byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x05, 0x06};
        MockMultipartFile file = new MockMultipartFile(
                "file", "badge.png", "image/png", pngBytes
        );

        mockMvc.perform(multipart("/api/student/certificates")
                        .file(file)
                        .param("title", "Google Cloud Associate Engineer")
                        .param("issuingOrganization", "Google Cloud")
                        .param("issueDate", "2026-06")
                        .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Google Cloud Associate Engineer"))
                .andExpect(jsonPath("$.contentType").value("image/png"))
                .andExpect(jsonPath("$.isSystemCredentialId").value(true))
                .andExpect(jsonPath("$.hasDocument").value(true));
    }

    @Test
    @DisplayName("Oversized certificate file (>5MB) is rejected with 400 Bad Request")
    void testRejectOversizedUpload() throws Exception {
        byte[] header = "%PDF-".getBytes();
        byte[] oversized = new byte[6 * 1024 * 1024];
        System.arraycopy(header, 0, oversized, 0, header.length);

        MockMultipartFile file = new MockMultipartFile(
                "file", "huge.pdf", "application/pdf", oversized
        );

        mockMvc.perform(multipart("/api/student/certificates")
                        .file(file)
                        .param("title", "Oversized Cert")
                        .param("issuingOrganization", "Huge Org")
                        .param("issueDate", "2026-01")
                        .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("exceeds maximum limit of 5MB")));
    }

    @Test
    @DisplayName("Invalid executable masquerading as PDF is rejected")
    void testRejectInvalidFormat() throws Exception {
        byte[] invalidBytes = new byte[]{'M', 'Z', 0x00, 0x05, 0x09};
        MockMultipartFile file = new MockMultipartFile(
                "file", "malicious.pdf", "application/pdf", invalidBytes
        );

        mockMvc.perform(multipart("/api/student/certificates")
                        .file(file)
                        .param("title", "Malicious Test")
                        .param("issuingOrganization", "Fake Org")
                        .param("issueDate", "2026-01")
                        .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("not a valid PDF document")));
    }

    @Test
    @DisplayName("Uploading certificate without authentication returns 401 Unauthorized")
    void testUploadUnauthorized() throws Exception {
        byte[] pdfBytes = "%PDF-1.4 sample".getBytes();
        MockMultipartFile file = new MockMultipartFile("file", "cert.pdf", "application/pdf", pdfBytes);

        mockMvc.perform(multipart("/api/student/certificates")
                        .file(file)
                        .param("title", "Cert Without Token")
                        .param("issuingOrganization", "Org")
                        .param("issueDate", "2026-01"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Public verification by uploading matching file detects authentic record and hash match")
    void testVerifyByFileMatchesAnchoredCertificate() throws Exception {
        byte[] pdfBytes = "%PDF-1.4 Verified Document Content for File Check".getBytes();
        MockMultipartFile file = new MockMultipartFile("file", "audited.pdf", "application/pdf", pdfBytes);

        String credId = "AUDIT-ID-" + System.currentTimeMillis();

        mockMvc.perform(multipart("/api/student/certificates")
                        .file(file)
                        .param("title", "Certified Security Analyst")
                        .param("issuingOrganization", "CompTIA")
                        .param("issueDate", "2026-07")
                        .param("credentialId", credId)
                        .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isCreated());

        // Upload the same file to public verify endpoint
        MockMultipartFile verifyFile = new MockMultipartFile("file", "audited.pdf", "application/pdf", pdfBytes);
        mockMvc.perform(multipart("/api/certificates/verify/file")
                        .file(verifyFile))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.verified").value(true))
                .andExpect(jsonPath("$.status").value("VERIFIED"))
                .andExpect(jsonPath("$.credentialId").value(credId))
                .andExpect(jsonPath("$.fileIntegrityVerified").value(true));

        // Upload a tampered version of the file
        byte[] tamperedBytes = "%PDF-1.4 TAMPERED Document Content".getBytes();
        MockMultipartFile tamperedFile = new MockMultipartFile("file", "tampered.pdf", "application/pdf", tamperedBytes);
        mockMvc.perform(multipart("/api/certificates/verify/file")
                        .file(tamperedFile))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.verified").value(false))
                .andExpect(jsonPath("$.status").value("NOT_FOUND"));
    }
}
