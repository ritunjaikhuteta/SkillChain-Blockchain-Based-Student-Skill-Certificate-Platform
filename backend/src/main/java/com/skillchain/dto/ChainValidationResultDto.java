package com.skillchain.dto;

import java.util.ArrayList;
import java.util.List;

public class ChainValidationResultDto {

    private boolean chainValid;
    private long totalBlocksAudited;
    private int corruptedBlockCount;
    private List<String> errorMessages = new ArrayList<>();
    private List<Long> corruptedBlockIndices = new ArrayList<>();

    public ChainValidationResultDto() {
    }

    public ChainValidationResultDto(boolean chainValid, long totalBlocksAudited, int corruptedBlockCount) {
        this.chainValid = chainValid;
        this.totalBlocksAudited = totalBlocksAudited;
        this.corruptedBlockCount = corruptedBlockCount;
    }

    public void addError(Long blockIndex, String error) {
        this.chainValid = false;
        this.corruptedBlockCount++;
        if (blockIndex != null && !this.corruptedBlockIndices.contains(blockIndex)) {
            this.corruptedBlockIndices.add(blockIndex);
        }
        this.errorMessages.add(error);
    }

    public boolean isChainValid() {
        return chainValid;
    }

    public void setChainValid(boolean chainValid) {
        this.chainValid = chainValid;
    }

    public long getTotalBlocksAudited() {
        return totalBlocksAudited;
    }

    public void setTotalBlocksAudited(long totalBlocksAudited) {
        this.totalBlocksAudited = totalBlocksAudited;
    }

    public int getCorruptedBlockCount() {
        return corruptedBlockCount;
    }

    public void setCorruptedBlockCount(int corruptedBlockCount) {
        this.corruptedBlockCount = corruptedBlockCount;
    }

    public List<String> getErrorMessages() {
        return errorMessages;
    }

    public void setErrorMessages(List<String> errorMessages) {
        this.errorMessages = errorMessages;
    }

    public List<Long> getCorruptedBlockIndices() {
        return corruptedBlockIndices;
    }

    public void setCorruptedBlockIndices(List<Long> corruptedBlockIndices) {
        this.corruptedBlockIndices = corruptedBlockIndices;
    }
}
