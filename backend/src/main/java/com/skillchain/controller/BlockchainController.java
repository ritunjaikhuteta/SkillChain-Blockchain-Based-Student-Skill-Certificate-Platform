package com.skillchain.controller;

import com.skillchain.dto.BlockchainStatusDto;
import com.skillchain.dto.CertificateVerificationDto;
import com.skillchain.dto.ChainValidationResultDto;
import com.skillchain.dto.RevocationRequestDto;
import com.skillchain.model.BlockchainBlock;
import com.skillchain.service.BlockchainService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class BlockchainController {

    private final BlockchainService blockchainService;

    public BlockchainController(BlockchainService blockchainService) {
        this.blockchainService = blockchainService;
    }

    // --- Public Verification Endpoints (PermitAll) ---

    @GetMapping("/api/certificates/verify/{credentialId}")
    public ResponseEntity<CertificateVerificationDto> verifyCertificateByCredentialId(
            @PathVariable String credentialId
    ) {
        CertificateVerificationDto result = blockchainService.verifyByCredentialId(credentialId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/api/certificates/verify/fingerprint/{fingerprint}")
    public ResponseEntity<CertificateVerificationDto> verifyCertificateByFingerprint(
            @PathVariable String fingerprint
    ) {
        CertificateVerificationDto result = blockchainService.verifyByFingerprint(fingerprint);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/api/certificates/verify/hash/{hash}")
    public ResponseEntity<CertificateVerificationDto> verifyCertificateByHash(
            @PathVariable String hash
    ) {
        CertificateVerificationDto result = blockchainService.verifyByBlockHash(hash);
        return ResponseEntity.ok(result);
    }

    @PostMapping(value = "/api/certificates/verify/file", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CertificateVerificationDto> verifyCertificateByFile(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file
    ) {
        CertificateVerificationDto result = blockchainService.verifyByFile(file);
        return ResponseEntity.ok(result);
    }

    // --- Admin Endpoints (Require ROLE_ADMIN) ---

    @GetMapping("/api/admin/blockchain/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BlockchainStatusDto> getBlockchainStatus() {
        BlockchainStatusDto status = blockchainService.getChainStatus();
        return ResponseEntity.ok(status);
    }

    @GetMapping("/api/admin/blockchain/validate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ChainValidationResultDto> validateBlockchain() {
        ChainValidationResultDto audit = blockchainService.validateEntireChain();
        return ResponseEntity.ok(audit);
    }

    @GetMapping("/api/admin/blockchain/blocks")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BlockchainBlock>> getAllBlocks() {
        List<BlockchainBlock> blocks = blockchainService.getAllBlocks();
        return ResponseEntity.ok(blocks);
    }

    @PostMapping("/api/admin/blockchain/anchor/{certificateId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BlockchainBlock> anchorCertificate(
            @PathVariable Long certificateId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String actorEmail = userDetails != null ? userDetails.getUsername() : "admin@skillchain.io";
        BlockchainBlock block = blockchainService.anchorCertificate(certificateId, actorEmail);
        return ResponseEntity.ok(block);
    }

    @PostMapping("/api/admin/blockchain/revoke/{certificateId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BlockchainBlock> revokeCertificate(
            @PathVariable Long certificateId,
            @Valid @RequestBody RevocationRequestDto request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String actorEmail = userDetails != null ? userDetails.getUsername() : "admin@skillchain.io";
        BlockchainBlock block = blockchainService.revokeCertificate(certificateId, request.getReason(), actorEmail);
        return ResponseEntity.ok(block);
    }
}
