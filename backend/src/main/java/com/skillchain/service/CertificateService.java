package com.skillchain.service;

import com.skillchain.dto.CertificateRequest;
import com.skillchain.dto.CertificateResponse;
import com.skillchain.exception.ResourceNotFoundException;
import com.skillchain.model.Certificate;
import com.skillchain.model.StudentProfile;
import com.skillchain.model.User;
import com.skillchain.repository.CertificateRepository;
import com.skillchain.repository.UserRepository;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final StudentProfileService profileService;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final BlockchainService blockchainService;

    public CertificateService(
            CertificateRepository certificateRepository,
            StudentProfileService profileService,
            UserRepository userRepository,
            FileStorageService fileStorageService,
            BlockchainService blockchainService
    ) {
        this.certificateRepository = certificateRepository;
        this.profileService = profileService;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
        this.blockchainService = blockchainService;
    }

    @Transactional(readOnly = true)
    public List<CertificateResponse> getMyCertificates(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        StudentProfile profile = profileService.getOrCreateProfileForUser(user);
        return certificateRepository.findByProfileId(profile.getId())
                .stream()
                .map(CertificateResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public CertificateResponse addCertificate(String email, CertificateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        StudentProfile profile = profileService.getOrCreateProfileForUser(user);

        boolean isSystemId = false;
        String credId = request.getCredentialId() != null ? request.getCredentialId().trim() : null;
        if (credId == null || credId.isBlank()) {
            credId = "SKC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            isSystemId = true;
        }

        Certificate certificate = new Certificate(
                profile,
                request.getTitle().trim(),
                request.getIssuingOrganization().trim(),
                request.getIssueDate().trim(),
                request.getExpirationDate() != null ? request.getExpirationDate().trim() : null,
                credId,
                request.getCredentialUrl() != null ? request.getCredentialUrl().trim() : null
        );
        certificate.setSystemCredentialId(isSystemId);

        Certificate saved = certificateRepository.save(certificate);

        // Auto-anchor to blockchain ledger
        try {
            blockchainService.anchorCertificate(saved.getId(), email);
            saved = certificateRepository.findById(saved.getId()).orElse(saved);
        } catch (Exception ex) {
            // Proceed safely
        }

        return new CertificateResponse(saved);
    }

    @Transactional
    public CertificateResponse addCertificateWithFile(
            String email,
            String title,
            String issuingOrganization,
            String issueDate,
            String expirationDate,
            String credentialId,
            String credentialUrl,
            MultipartFile file
    ) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        StudentProfile profile = profileService.getOrCreateProfileForUser(user);

        boolean isSystemId = false;
        String credId = credentialId != null ? credentialId.trim() : null;
        if (credId == null || credId.isBlank()) {
            credId = "SKC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            isSystemId = true;
        }

        Certificate certificate = new Certificate(
                profile,
                title.trim(),
                issuingOrganization.trim(),
                issueDate.trim(),
                expirationDate != null && !expirationDate.isBlank() ? expirationDate.trim() : null,
                credId,
                credentialUrl != null && !credentialUrl.isBlank() ? credentialUrl.trim() : null
        );
        certificate.setSystemCredentialId(isSystemId);

        if (file != null && !file.isEmpty()) {
            FileStorageService.StoredFileMeta meta = fileStorageService.storeCertificateFile(file);
            certificate.setFileKey(meta.getFileKey());
            certificate.setFileName(meta.getOriginalFilename());
            certificate.setFileHash(meta.getFileHash());
            certificate.setFileSize(meta.getFileSize());
            certificate.setContentType(meta.getContentType());
            certificate.setStorageProvider(meta.getStorageProvider());
            try {
                certificate.setFileData(file.getBytes());
            } catch (Exception ignored) {}
        }

        Certificate saved = certificateRepository.save(certificate);

        // Auto-anchor to blockchain ledger
        try {
            blockchainService.anchorCertificate(saved.getId(), email);
            saved = certificateRepository.findById(saved.getId()).orElse(saved);
        } catch (Exception ex) {
            // Proceed safely
        }

        return new CertificateResponse(saved);
    }

    @Transactional
    public CertificateResponse updateCertificate(String email, Long certificateId, CertificateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        StudentProfile profile = profileService.getOrCreateProfileForUser(user);

        Certificate certificate = certificateRepository.findByIdAndProfileId(certificateId, profile.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found with id: " + certificateId));

        certificate.setTitle(request.getTitle().trim());
        certificate.setIssuingOrganization(request.getIssuingOrganization().trim());
        certificate.setIssueDate(request.getIssueDate().trim());
        certificate.setExpirationDate(request.getExpirationDate() != null ? request.getExpirationDate().trim() : null);
        certificate.setCredentialId(request.getCredentialId() != null ? request.getCredentialId().trim() : null);
        certificate.setCredentialUrl(request.getCredentialUrl() != null ? request.getCredentialUrl().trim() : null);

        Certificate saved = certificateRepository.save(certificate);
        return new CertificateResponse(saved);
    }

    @Transactional
    public void deleteCertificate(String email, Long certificateId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        StudentProfile profile = profileService.getOrCreateProfileForUser(user);

        Certificate certificate = certificateRepository.findByIdAndProfileId(certificateId, profile.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found with id: " + certificateId));

        if (certificate.getFileKey() != null) {
            fileStorageService.deleteCertificateFile(certificate.getFileKey());
        }
        certificateRepository.delete(certificate);
    }

    @Transactional
    public CertificateResponse uploadCertificateDocument(String email, Long certificateId, MultipartFile file) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        StudentProfile profile = profileService.getOrCreateProfileForUser(user);

        Certificate certificate = certificateRepository.findByIdAndProfileId(certificateId, profile.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found with id: " + certificateId));

        if (certificate.isRevoked()) {
            throw new IllegalStateException("Cannot replace document on a revoked certificate");
        }

        // Delete previous document if exists
        if (certificate.getFileKey() != null) {
            fileStorageService.deleteCertificateFile(certificate.getFileKey());
        }

        FileStorageService.StoredFileMeta meta = fileStorageService.storeCertificateFile(file);
        certificate.setFileKey(meta.getFileKey());
        certificate.setFileName(meta.getOriginalFilename());
        certificate.setFileHash(meta.getFileHash());
        certificate.setFileSize(meta.getFileSize());
        certificate.setContentType(meta.getContentType());
        certificate.setStorageProvider(meta.getStorageProvider());
        try {
            certificate.setFileData(file.getBytes());
        } catch (Exception ignored) {}

        Certificate saved = certificateRepository.save(certificate);

        // Auto-anchor to blockchain ledger if not already anchored
        if (saved.getBlockchainHash() == null) {
            try {
                blockchainService.anchorCertificate(saved.getId(), email);
                saved = certificateRepository.findById(saved.getId()).orElse(saved);
            } catch (Exception ex) {
                // If already anchored under another flow, proceed safely
            }
        }

        return new CertificateResponse(saved);
    }

    @Transactional(readOnly = true)
    public Certificate getCertificateById(Long certificateId) {
        return certificateRepository.findById(certificateId)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found with id: " + certificateId));
    }

    @Transactional(readOnly = true)
    public Resource getCertificateDocumentResource(Long certificateId, String userEmail, boolean isStaffOrRecruiter) {
        Certificate certificate = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found with id: " + certificateId));

        // Ownership or recruiter/admin check
        if (!isStaffOrRecruiter) {
            String ownerEmail = certificate.getProfile() != null && certificate.getProfile().getUser() != null
                    ? certificate.getProfile().getUser().getEmail() : "";
            if (!ownerEmail.equalsIgnoreCase(userEmail)) {
                throw new org.springframework.security.access.AccessDeniedException("You are not authorized to access this document");
            }
        }

        if (certificate.getFileKey() == null) {
            throw new ResourceNotFoundException("No document file associated with this certificate");
        }

        try {
            return fileStorageService.loadCertificateDocumentAsResource(certificate.getFileKey());
        } catch (ResourceNotFoundException e) {
            // Ephemeral filesystem recovery: if disk was wiped (e.g. Render redeploy), serve from database backup
            if (certificate.getFileData() != null && certificate.getFileData().length > 0) {
                final String fileName = certificate.getFileName() != null ? certificate.getFileName() : "certificate.pdf";
                try {
                    fileStorageService.saveCertificateBytes(certificate.getFileKey(), certificate.getFileData(), certificate.getContentType());
                } catch (Exception ignored) {}

                return new org.springframework.core.io.ByteArrayResource(certificate.getFileData()) {
                    @Override
                    public String getFilename() {
                        return fileName;
                    }
                };
            }
            throw new ResourceNotFoundException(
                    "Certificate document file was not found on server storage (ephemeral storage was reset). Please click 'Replace File' to re-attach your document."
            );
        }
    }

    @Transactional(readOnly = true)
    public Resource getCertificatePdfResource(Long certificateId, String userEmail, boolean isStaffOrRecruiter) {
        return getCertificateDocumentResource(certificateId, userEmail, isStaffOrRecruiter);
    }
}
