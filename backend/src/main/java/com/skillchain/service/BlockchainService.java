package com.skillchain.service;

import com.skillchain.dto.BlockchainStatusDto;
import com.skillchain.dto.CertificateVerificationDto;
import com.skillchain.dto.ChainValidationResultDto;
import com.skillchain.exception.ResourceNotFoundException;
import com.skillchain.model.BlockchainBlock;
import com.skillchain.model.Certificate;
import com.skillchain.repository.BlockchainBlockRepository;
import com.skillchain.repository.CertificateRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BlockchainService {

    private static final Logger log = LoggerFactory.getLogger(BlockchainService.class);
    private static final String GENESIS_PREV_HASH = "0".repeat(64);

    private final BlockchainBlockRepository blockRepository;
    private final CertificateRepository certificateRepository;
    private final FileStorageService fileStorageService;

    @org.springframework.beans.factory.annotation.Autowired
    public BlockchainService(BlockchainBlockRepository blockRepository,
                             CertificateRepository certificateRepository,
                             FileStorageService fileStorageService) {
        this.blockRepository = blockRepository;
        this.certificateRepository = certificateRepository;
        this.fileStorageService = fileStorageService;
    }

    public BlockchainService(BlockchainBlockRepository blockRepository,
                             CertificateRepository certificateRepository) {
        this(blockRepository, certificateRepository, null);
    }

    public static String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder(64);
            for (byte b : hashBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 algorithm not available", e);
        }
    }

    public String calculateCertificateFingerprint(Certificate cert, String studentEmail) {
        String canonicalData = String.join("|",
                cert.getTitle() != null ? cert.getTitle().trim() : "",
                cert.getIssuingOrganization() != null ? cert.getIssuingOrganization().trim() : "",
                cert.getIssueDate() != null ? cert.getIssueDate().trim() : "",
                cert.getCredentialId() != null ? cert.getCredentialId().trim() : "",
                studentEmail != null ? studentEmail.trim().toLowerCase() : "",
                cert.getFileHash() != null ? cert.getFileHash().trim() : ""
        );
        return sha256(canonicalData);
    }

    public String calculateBlockHash(Long blockIndex, String previousHash, Long certificateId,
                                     String credentialId, String fingerprint, String title,
                                     String issuingOrg, String studentEmail, String issuerEmail,
                                     LocalDateTime timestamp) {
        String timeStr = timestamp != null
                ? timestamp.truncatedTo(java.time.temporal.ChronoUnit.SECONDS).toString()
                : "";
        String canonical = String.join(":",
                String.valueOf(blockIndex),
                previousHash != null ? previousHash : "",
                certificateId != null ? String.valueOf(certificateId) : "0",
                credentialId != null ? credentialId : "",
                fingerprint != null ? fingerprint : "",
                title != null ? title : "",
                issuingOrg != null ? issuingOrg : "",
                studentEmail != null ? studentEmail : "",
                issuerEmail != null ? issuerEmail : "",
                timeStr
        );
        return sha256(canonical);
    }

    @Transactional
    public synchronized BlockchainBlock initializeGenesisBlockIfEmpty() {
        Optional<BlockchainBlock> latest = blockRepository.findTopByOrderByBlockIndexDesc();
        if (latest.isPresent()) {
            return latest.get();
        }

        LocalDateTime genesisTime = LocalDateTime.of(2025, 1, 1, 0, 0, 0);
        String genesisFingerprint = sha256("SKILLCHAIN_GENESIS_SEED");
        String genesisHash = calculateBlockHash(
                0L,
                GENESIS_PREV_HASH,
                0L,
                "GENESIS-0000",
                genesisFingerprint,
                "SkillChain Genesis Block",
                "SkillChain Network",
                "genesis@skillchain.io",
                "system@skillchain.io",
                genesisTime
        );

        BlockchainBlock genesis = new BlockchainBlock(
                0L,
                GENESIS_PREV_HASH,
                genesisHash,
                0L,
                "GENESIS-0000",
                genesisFingerprint,
                "SkillChain Genesis Block",
                "SkillChain Network",
                "genesis@skillchain.io",
                "system@skillchain.io",
                genesisTime
        );

        return blockRepository.save(genesis);
    }

    @Transactional
    public synchronized BlockchainBlock anchorCertificate(Long certificateId, String actorEmail) {
        Certificate cert = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found with id: " + certificateId));

        if (blockRepository.existsByCertificateId(certificateId) || cert.getBlockchainHash() != null) {
            throw new IllegalStateException("Certificate is already anchored on the blockchain ledger (ID: " + certificateId + ")");
        }

        if (cert.getCredentialId() != null && !cert.getCredentialId().isBlank()) {
            if (blockRepository.existsByCredentialId(cert.getCredentialId())) {
                throw new IllegalStateException("A block with credential ID '" + cert.getCredentialId() + "' already exists");
            }
        }

        // Ensure genesis block exists
        initializeGenesisBlockIfEmpty();

        BlockchainBlock latestBlock = blockRepository.findTopByOrderByBlockIndexDesc()
                .orElseThrow(() -> new IllegalStateException("Failed to retrieve previous block in chain"));

        long nextIndex = latestBlock.getBlockIndex() + 1;
        String prevHash = latestBlock.getHash();

        String studentEmail = (cert.getProfile() != null && cert.getProfile().getUser() != null)
                ? cert.getProfile().getUser().getEmail()
                : "student@skillchain.io";

        String fingerprint = calculateCertificateFingerprint(cert, studentEmail);
        LocalDateTime now = LocalDateTime.now().truncatedTo(java.time.temporal.ChronoUnit.SECONDS);

        String blockHash = calculateBlockHash(
                nextIndex,
                prevHash,
                cert.getId(),
                cert.getCredentialId(),
                fingerprint,
                cert.getTitle(),
                cert.getIssuingOrganization(),
                studentEmail,
                actorEmail,
                now
        );

        BlockchainBlock block = new BlockchainBlock(
                nextIndex,
                prevHash,
                blockHash,
                cert.getId(),
                cert.getCredentialId(),
                fingerprint,
                cert.getTitle(),
                cert.getIssuingOrganization(),
                studentEmail,
                actorEmail,
                now
        );

        BlockchainBlock savedBlock = blockRepository.save(block);

        cert.setBlockchainHash(blockHash);
        cert.setFingerprint(fingerprint);
        certificateRepository.save(cert);

        log.info("Certificate ID {} anchored to blockchain at index {} with hash {}", cert.getId(), nextIndex, blockHash);
        return savedBlock;
    }

    @Transactional(readOnly = true)
    public CertificateVerificationDto verifyByCredentialId(String credentialId) {
        if (credentialId == null || credentialId.isBlank()) {
            return CertificateVerificationDto.notFound(credentialId);
        }

        Optional<BlockchainBlock> blockOpt = blockRepository.findByCredentialId(credentialId.trim());
        if (blockOpt.isEmpty()) {
            return CertificateVerificationDto.notFound(credentialId);
        }

        BlockchainBlock block = blockOpt.get();
        return evaluateBlockVerification(block);
    }

    @Transactional(readOnly = true)
    public CertificateVerificationDto verifyByFingerprint(String fingerprint) {
        if (fingerprint == null || fingerprint.isBlank()) {
            return CertificateVerificationDto.notFound(fingerprint);
        }

        Optional<BlockchainBlock> blockOpt = blockRepository.findByCertificateFingerprint(fingerprint.trim());
        if (blockOpt.isEmpty()) {
            return CertificateVerificationDto.notFound(fingerprint);
        }

        BlockchainBlock block = blockOpt.get();
        return evaluateBlockVerification(block);
    }

    @Transactional(readOnly = true)
    public CertificateVerificationDto verifyByBlockHash(String hash) {
        if (hash == null || hash.isBlank()) {
            return CertificateVerificationDto.notFound(hash);
        }

        Optional<BlockchainBlock> blockOpt = blockRepository.findByHash(hash.trim());
        if (blockOpt.isEmpty()) {
            return CertificateVerificationDto.notFound(hash);
        }

        BlockchainBlock block = blockOpt.get();
        return evaluateBlockVerification(block);
    }

    private CertificateVerificationDto evaluateBlockVerification(BlockchainBlock block) {
        CertificateVerificationDto dto;
        if (block.isRevoked()) {
            dto = CertificateVerificationDto.revoked(
                    block.getBlockIndex(),
                    block.getHash(),
                    block.getCredentialId(),
                    block.getCertificateTitle(),
                    block.getIssuingOrganization(),
                    block.getRevocationReason(),
                    block.getRevokedAt()
            );
        } else {
            // Verify cryptographic validity of this individual block's hash
            String expectedHash = calculateBlockHash(
                    block.getBlockIndex(),
                    block.getPreviousHash(),
                    block.getCertificateId(),
                    block.getCredentialId(),
                    block.getCertificateFingerprint(),
                    block.getCertificateTitle(),
                    block.getIssuingOrganization(),
                    block.getStudentEmail(),
                    block.getIssuerEmail(),
                    block.getTimestamp()
            );

            if (!expectedHash.equalsIgnoreCase(block.getHash())) {
                CertificateVerificationDto tamperedDto = new CertificateVerificationDto();
                tamperedDto.setVerified(false);
                tamperedDto.setStatus("TAMPERED");
                tamperedDto.setMessage("Cryptographic hash mismatch: block data has been tampered with or modified.");
                tamperedDto.setBlockIndex(block.getBlockIndex());
                tamperedDto.setBlockHash(block.getHash());
                tamperedDto.setCredentialId(block.getCredentialId());
                tamperedDto.setCertificateTitle(block.getCertificateTitle());
                tamperedDto.setIssuingOrganization(block.getIssuingOrganization());
                tamperedDto.setRecordExists(true);
                tamperedDto.setLedgerAnchored(false);
                tamperedDto.setIssuerDirectlyAuthenticated(false);
                return tamperedDto;
            }

            dto = CertificateVerificationDto.verified(
                    block.getBlockIndex(),
                    block.getHash(),
                    block.getPreviousHash(),
                    block.getCredentialId(),
                    block.getCertificateTitle(),
                    block.getIssuingOrganization(),
                    block.getCertificateFingerprint(),
                    block.getTimestamp()
            );
        }

        dto.setRecordExists(true);
        dto.setLedgerAnchored(!block.isRevoked());
        dto.setIssuerDirectlyAuthenticated(false);
        dto.setVerificationNotice("SkillChain cryptographically verifies ledger existence and uploaded document SHA-256 hash integrity. This does not represent an independent direct validation by the external issuing organization.");

        // Check associated certificate and file document
        if (block.getCertificateId() != null) {
            certificateRepository.findById(block.getCertificateId()).ifPresent(cert -> {
                dto.setSystemCredentialId(cert.isSystemCredentialId() || (cert.getCredentialId() != null && cert.getCredentialId().startsWith("SKC-")));
                if (cert.getFileHash() != null) {
                    dto.setHasDocument(true);
                    dto.setFileName(cert.getFileName());
                    dto.setFileHash(cert.getFileHash());
                    dto.setFileSize(cert.getFileSize());
                    dto.setContentType(cert.getContentType());
                    if (fileStorageService != null && cert.getFileKey() != null) {
                        dto.setFileIntegrityVerified(fileStorageService.verifyFileIntegrity(cert.getFileKey(), cert.getFileHash()));
                    } else {
                        dto.setFileIntegrityVerified(true);
                    }
                }
            });
        }

        return dto;
    }

    @Transactional(readOnly = true)
    public CertificateVerificationDto verifyByFile(org.springframework.web.multipart.MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return CertificateVerificationDto.notFound("Uploaded verification file is empty");
        }
        try {
            byte[] bytes = file.getBytes();
            String hash = FileStorageService.calculateSha256(bytes);
            Optional<Certificate> certOpt = certificateRepository.findFirstByFileHash(hash);
            if (certOpt.isPresent()) {
                Certificate cert = certOpt.get();
                if (cert.getCredentialId() != null) {
                    CertificateVerificationDto dto = verifyByCredentialId(cert.getCredentialId());
                    dto.setFileIntegrityVerified(true);
                    return dto;
                }
            }
            return CertificateVerificationDto.notFound("Document with SHA-256 checksum '" + hash + "' is not registered on the ledger.");
        } catch (Exception e) {
            return CertificateVerificationDto.notFound("Failed to compute SHA-256 for uploaded document.");
        }
    }

    @Transactional
    public BlockchainBlock revokeCertificate(Long certificateId, String reason, String actorEmail) {
        Certificate cert = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found with id: " + certificateId));

        BlockchainBlock block = blockRepository.findByCertificateId(certificateId)
                .orElseThrow(() -> new IllegalStateException("Certificate ID " + certificateId + " has not been anchored on the blockchain"));

        if (block.isRevoked()) {
            throw new IllegalStateException("Certificate ID " + certificateId + " is already revoked");
        }

        LocalDateTime now = LocalDateTime.now().truncatedTo(java.time.temporal.ChronoUnit.SECONDS);

        block.setRevoked(true);
        block.setRevocationReason(reason);
        block.setRevokedAt(now);
        block.setRevokedBy(actorEmail);
        BlockchainBlock updatedBlock = blockRepository.save(block);

        cert.setRevoked(true);
        cert.setRevocationReason(reason);
        cert.setRevokedAt(now);
        cert.setRevokedBy(actorEmail);
        certificateRepository.save(cert);

        log.info("Certificate ID {} revoked on ledger by {}. Reason: {}", certificateId, actorEmail, reason);
        return updatedBlock;
    }

    @Transactional(readOnly = true)
    public ChainValidationResultDto validateEntireChain() {
        List<BlockchainBlock> chain = blockRepository.findAllByOrderByBlockIndexAsc();
        ChainValidationResultDto result = new ChainValidationResultDto(true, chain.size(), 0);

        if (chain.isEmpty()) {
            return result;
        }

        for (int i = 0; i < chain.size(); i++) {
            BlockchainBlock current = chain.get(i);

            // 1. Verify sequence index
            if (current.getBlockIndex() != i) {
                result.addError(current.getBlockIndex(),
                        "Broken sequence: Block at list position " + i + " has blockIndex " + current.getBlockIndex());
            }

            // 2. Verify genesis block previous hash
            if (i == 0) {
                if (!GENESIS_PREV_HASH.equals(current.getPreviousHash())) {
                    result.addError(0L, "Genesis block previous hash is invalid: " + current.getPreviousHash());
                }
            } else {
                // 3. Verify link to previous block
                BlockchainBlock previous = chain.get(i - 1);
                if (!current.getPreviousHash().equals(previous.getHash())) {
                    result.addError(current.getBlockIndex(),
                            "Broken hash link at block " + current.getBlockIndex() +
                                    ": previousHash does not match hash of block " + previous.getBlockIndex());
                }
            }

            // 4. Verify canonical data re-hash
            String expectedHash = calculateBlockHash(
                    current.getBlockIndex(),
                    current.getPreviousHash(),
                    current.getCertificateId(),
                    current.getCredentialId(),
                    current.getCertificateFingerprint(),
                    current.getCertificateTitle(),
                    current.getIssuingOrganization(),
                    current.getStudentEmail(),
                    current.getIssuerEmail(),
                    current.getTimestamp()
            );

            if (!expectedHash.equalsIgnoreCase(current.getHash())) {
                result.addError(current.getBlockIndex(),
                        "Data tampering detected at block " + current.getBlockIndex() +
                                ": stored hash " + current.getHash() + " does not match calculated " + expectedHash);
            }
        }

        return result;
    }

    @Transactional(readOnly = true)
    public BlockchainStatusDto getChainStatus() {
        long totalBlocks = blockRepository.count();
        Optional<BlockchainBlock> latest = blockRepository.findTopByOrderByBlockIndexDesc();
        ChainValidationResultDto audit = validateEntireChain();
        long revokedCount = blockRepository.countByRevokedTrue();

        return new BlockchainStatusDto(
                totalBlocks,
                latest.map(BlockchainBlock::getHash).orElse("0".repeat(64)),
                latest.map(BlockchainBlock::getBlockIndex).orElse(null),
                audit.isChainValid(),
                revokedCount,
                latest.map(BlockchainBlock::getTimestamp).orElse(null)
        );
    }

    @Transactional(readOnly = true)
    public List<BlockchainBlock> getAllBlocks() {
        return blockRepository.findAllByOrderByBlockIndexAsc();
    }
}
