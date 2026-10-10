package com.skillchain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class BlockchainAndGraphIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("Public certificate verification endpoint returns 200 without JWT token")
    void testPublicCertificateVerificationNoAuthRequired() throws Exception {
        mockMvc.perform(get("/api/certificates/verify/NON-EXISTENT-CRED-ID"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.verified").value(false))
                .andExpect(jsonPath("$.status").value("NOT_FOUND"));
    }

    @Test
    @DisplayName("Public skill pathway endpoint returns 200 without JWT token")
    void testPublicSkillPathwayNoAuthRequired() throws Exception {
        mockMvc.perform(get("/api/skills/pathway")
                        .param("from", "Java")
                        .param("to", "Docker"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pathFound").value(true))
                .andExpect(jsonPath("$.sourceSkill").value("Java"))
                .andExpect(jsonPath("$.targetSkill").value("Docker"));
    }

    @Test
    @DisplayName("Admin blockchain status endpoint rejects unauthenticated access with 401")
    void testAdminBlockchainStatusRejectsUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/admin/blockchain/status"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Recruiter candidates ranked endpoint rejects unauthenticated access with 401")
    void testRecruiterCandidatesRankedRejectsUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/recruiter/candidates/ranked")
                        .param("skills", "Java,Spring Boot"))
                .andExpect(status().isUnauthorized());
    }
}
