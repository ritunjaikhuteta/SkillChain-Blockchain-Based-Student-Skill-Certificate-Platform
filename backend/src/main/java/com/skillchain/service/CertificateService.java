package com.skillchain.service;

import com.skillchain.dto.CertificateRequest;
import com.skillchain.dto.CertificateResponse;
import com.skillchain.exception.ResourceNotFoundException;
import com.skillchain.model.Certificate;
import com.skillchain.model.StudentProfile;
import com.skillchain.model.User;
import com.skillchain.repository.CertificateRepository;
import com.skillchain.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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

        Certificate certificate = new Certificate(
                profile,
                request.getTitle().trim(),
                request.getIssuingOrganization().trim(),
                request.getIssueDate().trim(),
                request.getExpirationDate() != null ? request.getExpirationDate().trim() : null,
                request.getCredentialId() != null ? request.getCredentialId().trim() : null,
                request.getCredentialUrl() != null ? request.getCredentialUrl().trim() : null
        );

        Certificate saved = certificateRepository.save(certificate);
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
    public CertificateResponse uploadCertificateDocument(String email, Long certificateId, org.springframework.web.multipart.MultipartFile file) {
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

        FileStorageService.StoredFileMeta meta = fileStorageService.storeCertificatePdf(file);
        certificate.setFileKey(meta.getFileKey());
        certificate.setFileName(meta.getOriginalFilename());
        certificate.setFileHash(meta.getFileHash());
        certificate.setFileSize(meta.getFileSize());

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
    public org.springframework.core.io.Resource getCertificatePdfResource(Long certificateId, String userEmail, boolean isStaffOrRecruiter) {
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

        return fileStorageService.loadCertificatePdfAsResource(certificate.getFileKey());
    }
}
