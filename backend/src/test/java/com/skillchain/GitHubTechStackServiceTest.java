package com.skillchain;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillchain.dto.TechStackDetectionDto;
import com.skillchain.service.GitHubTechStackService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class GitHubTechStackServiceTest {

    private GitHubTechStackService gitHubTechStackService;

    @BeforeEach
    void setUp() {
        gitHubTechStackService = new GitHubTechStackService(new ObjectMapper());
    }

    @Test
    @DisplayName("Empty or null URL returns not detected with clear message")
    void testEmptyUrlHandling() {
        TechStackDetectionDto dto = gitHubTechStackService.detectTechStack(null);
        assertNotNull(dto);
        assertFalse(dto.isDetected());
        assertEquals("GitHub URL is empty", dto.getMessage());

        TechStackDetectionDto dto2 = gitHubTechStackService.detectTechStack("   ");
        assertNotNull(dto2);
        assertFalse(dto2.isDetected());
    }

    @Test
    @DisplayName("Non-GitHub URL returns invalid repository message")
    void testNonGithubUrl() {
        TechStackDetectionDto dto = gitHubTechStackService.detectTechStack("https://gitlab.com/user/project");
        assertNotNull(dto);
        assertFalse(dto.isDetected());
        assertEquals("Invalid GitHub repository URL", dto.getMessage());
    }

    @Test
    @DisplayName("Malformed URL returns invalid repository message")
    void testMalformedUrl() {
        TechStackDetectionDto dto = gitHubTechStackService.detectTechStack("not-a-url");
        assertNotNull(dto);
        assertFalse(dto.isDetected());
        assertEquals("Invalid GitHub repository URL", dto.getMessage());
    }
}
