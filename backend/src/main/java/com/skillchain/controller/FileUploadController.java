package com.skillchain.controller;

import com.skillchain.model.Certificate;
import com.skillchain.service.CertificateService;
import com.skillchain.service.StudentProfileService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/files")
@SuppressWarnings("null")
public class FileUploadController {

    private final CertificateService certificateService;
    private final StudentProfileService profileService;

    public FileUploadController(CertificateService certificateService, StudentProfileService profileService) {
        this.certificateService = certificateService;
        this.profileService = profileService;
    }

    @GetMapping("/avatars/{userId}")
    public ResponseEntity<Resource> getAvatar(@PathVariable Long userId) {
        Resource resource = profileService.getAvatarResourceByUserId(userId);
        String rawFilename = (resource != null) ? resource.getFilename() : null;
        String filename = (rawFilename != null) ? rawFilename : "avatar.png";
        MediaType mediaType = filename.toLowerCase().endsWith(".png") ? MediaType.IMAGE_PNG : MediaType.IMAGE_JPEG;

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CACHE_CONTROL, "max-age=86400, public")
                .body(resource);
    }

    @GetMapping("/certificates/{certificateId}/download")
    public ResponseEntity<Resource> downloadCertificatePdf(
            @PathVariable Long certificateId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String email = userDetails != null ? userDetails.getUsername() : "";
        boolean isStaffOrRecruiter = userDetails != null && userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_RECRUITER"));

        Resource resource = certificateService.getCertificatePdfResource(certificateId, email, isStaffOrRecruiter);
        Certificate cert = certificateService.getCertificateById(certificateId);
        String downloadName = cert.getFileName() != null ? cert.getFileName() : "certificate.pdf";
        MediaType mediaType = resolveMediaType(cert);

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + downloadName + "\"")
                .body(resource);
    }

    @GetMapping("/certificates/{certificateId}/preview")
    public ResponseEntity<Resource> previewCertificatePdf(
            @PathVariable Long certificateId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String email = userDetails != null ? userDetails.getUsername() : "";
        boolean isStaffOrRecruiter = userDetails != null && userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_RECRUITER"));

        Resource resource = certificateService.getCertificatePdfResource(certificateId, email, isStaffOrRecruiter);
        Certificate cert = certificateService.getCertificateById(certificateId);
        String previewName = cert.getFileName() != null ? cert.getFileName() : "certificate.pdf";
        MediaType mediaType = resolveMediaType(cert);

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + previewName + "\"")
                .body(resource);
    }

    private MediaType resolveMediaType(Certificate cert) {
        if (cert.getContentType() != null && !cert.getContentType().isBlank()) {
            try {
                return MediaType.parseMediaType(cert.getContentType());
            } catch (Exception ignored) {}
        }
        String fileName = cert.getFileName() != null ? cert.getFileName().toLowerCase() : "";
        if (fileName.endsWith(".png")) return MediaType.IMAGE_PNG;
        if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) return MediaType.IMAGE_JPEG;
        return MediaType.APPLICATION_PDF;
    }
}
