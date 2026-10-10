package com.skillchain.controller;

import com.skillchain.dto.CertificateRequest;
import com.skillchain.dto.CertificateResponse;
import com.skillchain.service.CertificateService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/certificates")
public class CertificateController {

    private final CertificateService certificateService;

    public CertificateController(CertificateService certificateService) {
        this.certificateService = certificateService;
    }

    @GetMapping
    public ResponseEntity<List<CertificateResponse>> getMyCertificates(@AuthenticationPrincipal UserDetails userDetails) {
        List<CertificateResponse> certificates = certificateService.getMyCertificates(userDetails.getUsername());
        return ResponseEntity.ok(certificates);
    }

    @PostMapping
    public ResponseEntity<CertificateResponse> addCertificate(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CertificateRequest request
    ) {
        CertificateResponse created = certificateService.addCertificate(userDetails.getUsername(), request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CertificateResponse> updateCertificate(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody CertificateRequest request
    ) {
        CertificateResponse updated = certificateService.updateCertificate(userDetails.getUsername(), id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCertificate(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        certificateService.deleteCertificate(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/{id}/upload", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CertificateResponse> uploadCertificateDocument(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file
    ) {
        CertificateResponse response = certificateService.uploadCertificateDocument(userDetails.getUsername(), id, file);
        return ResponseEntity.ok(response);
    }
}
