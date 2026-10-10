package com.skillchain.dto;

import java.time.LocalDateTime;

public class BlockchainStatusDto {

    private long totalBlocks;
    private String latestBlockHash;
    private Long latestBlockIndex;
    private boolean chainValid;
    private long totalRevokedCertificates;
    private LocalDateTime latestBlockTimestamp;
    private String ledgerType;
    private String disclaimer;

    public BlockchainStatusDto() {
    }

    public BlockchainStatusDto(long totalBlocks, String latestBlockHash, Long latestBlockIndex,
                               boolean chainValid, long totalRevokedCertificates,
                               LocalDateTime latestBlockTimestamp) {
        this.totalBlocks = totalBlocks;
        this.latestBlockHash = latestBlockHash;
        this.latestBlockIndex = latestBlockIndex;
        this.chainValid = chainValid;
        this.totalRevokedCertificates = totalRevokedCertificates;
        this.latestBlockTimestamp = latestBlockTimestamp;
        this.ledgerType = "SkillChain SHA-256 Cryptographic Audit Ledger";
        this.disclaimer = "Educational application-level cryptographic hash chain. It guarantees tamper-evidence at the application tier, not distributed BFT consensus.";
    }

    public long getTotalBlocks() {
        return totalBlocks;
    }

    public void setTotalBlocks(long totalBlocks) {
        this.totalBlocks = totalBlocks;
    }

    public String getLatestBlockHash() {
        return latestBlockHash;
    }

    public void setLatestBlockHash(String latestBlockHash) {
        this.latestBlockHash = latestBlockHash;
    }

    public Long getLatestBlockIndex() {
        return latestBlockIndex;
    }

    public void setLatestBlockIndex(Long latestBlockIndex) {
        this.latestBlockIndex = latestBlockIndex;
    }

    public boolean isChainValid() {
        return chainValid;
    }

    public void setChainValid(boolean chainValid) {
        this.chainValid = chainValid;
    }

    public long getTotalRevokedCertificates() {
        return totalRevokedCertificates;
    }

    public void setTotalRevokedCertificates(long totalRevokedCertificates) {
        this.totalRevokedCertificates = totalRevokedCertificates;
    }

    public LocalDateTime getLatestBlockTimestamp() {
        return latestBlockTimestamp;
    }

    public void setLatestBlockTimestamp(LocalDateTime latestBlockTimestamp) {
        this.latestBlockTimestamp = latestBlockTimestamp;
    }

    public String getLedgerType() {
        return ledgerType;
    }

    public void setLedgerType(String ledgerType) {
        this.ledgerType = ledgerType;
    }

    public String getDisclaimer() {
        return disclaimer;
    }

    public void setDisclaimer(String disclaimer) {
        this.disclaimer = disclaimer;
    }
}
