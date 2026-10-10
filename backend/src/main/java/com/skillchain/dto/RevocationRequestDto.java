package com.skillchain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RevocationRequestDto {

    @NotBlank(message = "Revocation reason is required")
    @Size(max = 255, message = "Reason cannot exceed 255 characters")
    private String reason;

    public RevocationRequestDto() {
    }

    public RevocationRequestDto(String reason) {
        this.reason = reason;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
