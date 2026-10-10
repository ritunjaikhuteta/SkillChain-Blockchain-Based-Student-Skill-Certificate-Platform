package com.skillchain;

import com.skillchain.dto.CertificateVerificationDto;
import com.skillchain.dto.ChainValidationResultDto;
import com.skillchain.model.BlockchainBlock;
import com.skillchain.model.Certificate;
import com.skillchain.model.StudentProfile;
import com.skillchain.model.User;
import com.skillchain.repository.BlockchainBlockRepository;
import com.skillchain.repository.CertificateRepository;
import com.skillchain.service.BlockchainService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BlockchainServiceTest {

    @Mock
    private BlockchainBlockRepository blockRepository;

    @Mock
    private CertificateRepository certificateRepository;

    private BlockchainService blockchainService;

    private Certificate sampleCert;
    private User sampleUser;
    private StudentProfile sampleProfile;

    @BeforeEach
    void setUp() {
        blockchainService = new BlockchainService(blockRepository, certificateRepository);

        sampleUser = new User("Alice Student", "alice@example.com", "hashed_password", com.skillchain.model.Role.STUDENT);
        sampleUser.setId(10L);

        sampleProfile = new StudentProfile(sampleUser);
        sampleProfile.setId(100L);

        sampleCert = new Certificate(
                sampleProfile,
                "AWS Solutions Architect",
                "Amazon Web Services",
                "2025-01-15",
                "2028-01-15",
                "AWS-CERT-998877",
                "https://aws.amazon.com/verify"
        );
        sampleCert.setId(500L);
    }

    @Test
    @DisplayName("Calculate deterministic SHA-256 hash")
    void testSha256Determinism() {
        String hash1 = BlockchainService.sha256("skillchain_deterministic_payload");
        String hash2 = BlockchainService.sha256("skillchain_deterministic_payload");

        assertNotNull(hash1);
        assertEquals(64, hash1.length());
        assertEquals(hash1, hash2);
    }

    @Test
    @DisplayName("Anchor certificate successfully on ledger")
    void testAnchorCertificateSuccess() {
        // Setup genesis block as existing latest
        BlockchainBlock genesis = new BlockchainBlock(
                0L, "0".repeat(64), "genesis_hash",
                0L, "GENESIS-0000", "gen_fingerprint",
                "Genesis", "SkillChain", "sys@skillchain.io", "admin@skillchain.io",
                LocalDateTime.now()
        );

        when(certificateRepository.findById(500L)).thenReturn(Optional.of(sampleCert));
        when(blockRepository.existsByCertificateId(500L)).thenReturn(false);
        when(blockRepository.existsByCredentialId("AWS-CERT-998877")).thenReturn(false);
        when(blockRepository.findTopByOrderByBlockIndexDesc()).thenReturn(Optional.of(genesis));
        when(blockRepository.save(any(BlockchainBlock.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BlockchainBlock anchored = blockchainService.anchorCertificate(500L, "issuer@skillchain.io");

        assertNotNull(anchored);
        assertEquals(1L, anchored.getBlockIndex());
        assertEquals(genesis.getHash(), anchored.getPreviousHash());
        assertEquals("AWS-CERT-998877", anchored.getCredentialId());
        assertEquals("AWS Solutions Architect", anchored.getCertificateTitle());
        assertNotNull(anchored.getHash());
        assertNotNull(sampleCert.getBlockchainHash());
        assertNotNull(sampleCert.getFingerprint());
        verify(certificateRepository, times(1)).save(sampleCert);
    }

    @Test
    @DisplayName("Prevent duplicate anchoring of same certificate")
    void testPreventDuplicateAnchoring() {
        when(certificateRepository.findById(500L)).thenReturn(Optional.of(sampleCert));
        when(blockRepository.existsByCertificateId(500L)).thenReturn(true);

        IllegalStateException ex = assertThrows(IllegalStateException.class, () ->
                blockchainService.anchorCertificate(500L, "admin@skillchain.io")
        );
        assertTrue(ex.getMessage().contains("already anchored"));
    }

    @Test
    @DisplayName("Public verification by credentialId returns verified status")
    void testVerifyByCredentialId() {
        LocalDateTime time = LocalDateTime.of(2025, 2, 1, 10, 0);
        String fingerprint = blockchainService.calculateCertificateFingerprint(sampleCert, "alice@example.com");
        String validHash = blockchainService.calculateBlockHash(
                1L, "prev_hash_123", 500L, "AWS-CERT-998877",
                fingerprint, "AWS Solutions Architect", "Amazon Web Services",
                "alice@example.com", "admin@skillchain.io", time
        );

        BlockchainBlock block = new BlockchainBlock(
                1L, "prev_hash_123", validHash, 500L, "AWS-CERT-998877",
                fingerprint, "AWS Solutions Architect", "Amazon Web Services",
                "alice@example.com", "admin@skillchain.io", time
        );

        when(blockRepository.findByCredentialId("AWS-CERT-998877")).thenReturn(Optional.of(block));

        CertificateVerificationDto result = blockchainService.verifyByCredentialId("AWS-CERT-998877");

        assertTrue(result.isVerified());
        assertEquals("VERIFIED", result.getStatus());
        assertEquals("AWS-CERT-998877", result.getCredentialId());
        assertEquals(validHash, result.getBlockHash());
        assertFalse(result.isRevoked());
    }

    @Test
    @DisplayName("Revoke certificate records reason, timestamp and marks status REVOKED")
    void testRevokeCertificate() {
        BlockchainBlock block = new BlockchainBlock(
                1L, "prev_hash", "block_hash", 500L, "AWS-CERT-998877",
                "fingerprint", "AWS Solutions Architect", "Amazon Web Services",
                "alice@example.com", "admin@skillchain.io", LocalDateTime.now()
        );

        when(certificateRepository.findById(500L)).thenReturn(Optional.of(sampleCert));
        when(blockRepository.findByCertificateId(500L)).thenReturn(Optional.of(block));
        when(blockRepository.save(any(BlockchainBlock.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BlockchainBlock revokedBlock = blockchainService.revokeCertificate(500L, "Fraudulent credential submission", "admin@skillchain.io");

        assertTrue(revokedBlock.isRevoked());
        assertEquals("Fraudulent credential submission", revokedBlock.getRevocationReason());
        assertEquals("admin@skillchain.io", revokedBlock.getRevokedBy());
        assertTrue(sampleCert.isRevoked());
        assertEquals("Fraudulent credential submission", sampleCert.getRevocationReason());

        // When queried for verification, it should return REVOKED status
        when(blockRepository.findByCredentialId("AWS-CERT-998877")).thenReturn(Optional.of(revokedBlock));
        CertificateVerificationDto verification = blockchainService.verifyByCredentialId("AWS-CERT-998877");
        assertFalse(verification.isVerified());
        assertEquals("REVOKED", verification.getStatus());
        assertEquals("Fraudulent credential submission", verification.getRevocationReason());
    }

    @Test
    @DisplayName("Audit entire blockchain detects tampering and corrupted links")
    void testValidateEntireChainTamperingDetection() {
        LocalDateTime t0 = LocalDateTime.of(2025, 1, 1, 0, 0);
        LocalDateTime t1 = LocalDateTime.of(2025, 1, 2, 0, 0);
        LocalDateTime t2 = LocalDateTime.of(2025, 1, 3, 0, 0);

        String genPrev = "0".repeat(64);
        String genHash = blockchainService.calculateBlockHash(
                0L, genPrev, 0L, "GENESIS-0000", "gen_fp", "Genesis", "SkillChain", "g@sc.io", "sys@sc.io", t0
        );
        BlockchainBlock b0 = new BlockchainBlock(0L, genPrev, genHash, 0L, "GENESIS-0000", "gen_fp", "Genesis", "SkillChain", "g@sc.io", "sys@sc.io", t0);

        String b1Hash = blockchainService.calculateBlockHash(
                1L, genHash, 10L, "CRED-1", "fp1", "Cert 1", "Org 1", "s1@sc.io", "sys@sc.io", t1
        );
        BlockchainBlock b1 = new BlockchainBlock(1L, genHash, b1Hash, 10L, "CRED-1", "fp1", "Cert 1", "Org 1", "s1@sc.io", "sys@sc.io", t1);

        String b2Hash = blockchainService.calculateBlockHash(
                2L, b1Hash, 20L, "CRED-2", "fp2", "Cert 2", "Org 2", "s2@sc.io", "sys@sc.io", t2
        );
        BlockchainBlock b2 = new BlockchainBlock(2L, b1Hash, b2Hash, 20L, "CRED-2", "fp2", "Cert 2", "Org 2", "s2@sc.io", "sys@sc.io", t2);

        List<BlockchainBlock> validChain = List.of(b0, b1, b2);
        when(blockRepository.findAllByOrderByBlockIndexAsc()).thenReturn(validChain);

        ChainValidationResultDto validAudit = blockchainService.validateEntireChain();
        assertTrue(validAudit.isChainValid());
        assertEquals(3, validAudit.getTotalBlocksAudited());
        assertEquals(0, validAudit.getCorruptedBlockCount());

        // Now simulate tampered data in block 1:
        b1.setCertificateTitle("TAMPERED TITLE BY MALICIOUS ACTOR");
        ChainValidationResultDto tamperedAudit = blockchainService.validateEntireChain();
        assertFalse(tamperedAudit.isChainValid());
        assertTrue(tamperedAudit.getCorruptedBlockCount() > 0);
        assertTrue(tamperedAudit.getErrorMessages().stream().anyMatch(msg -> msg.contains("tampering detected")));
    }
}
