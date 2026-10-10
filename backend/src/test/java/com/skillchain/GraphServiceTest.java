package com.skillchain;

import com.skillchain.dto.CandidateRankDto;
import com.skillchain.dto.ShortestPathDto;
import com.skillchain.model.*;
import com.skillchain.repository.*;
import com.skillchain.service.GraphService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GraphServiceTest {

    @Mock
    private StudentProfileRepository profileRepository;

    @Mock
    private SkillRepository skillRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private CertificateRepository certificateRepository;

    private GraphService graphService;

    @BeforeEach
    void setUp() {
        graphService = new GraphService(profileRepository, skillRepository, projectRepository, certificateRepository);
    }

    @Test
    @DisplayName("BFS traversal explores reachable skill network in level order")
    void testBfsTraversal() {
        List<String> visited = graphService.bfsTraverse("Java", 2);
        assertNotNull(visited);
        assertFalse(visited.isEmpty());
        assertEquals("Java", visited.get(0));
        assertTrue(visited.contains("Spring Boot"));
    }

    @Test
    @DisplayName("DFS traversal visits deep skill paths without infinite looping on cycles")
    void testDfsTraversalWithCycles() {
        List<String> visited = graphService.dfsTraverse("React", 3);
        assertNotNull(visited);
        assertFalse(visited.isEmpty());
        assertEquals("React", visited.get(0));
        assertTrue(visited.contains("JavaScript") || visited.contains("TypeScript"));
    }

    @Test
    @DisplayName("Dijkstra finds weighted shortest path between related skills with step explanations")
    void testDijkstraShortestPath() {
        ShortestPathDto result = graphService.findShortestPath("Java", "Docker");
        assertTrue(result.isPathFound());
        assertTrue(result.getTotalDistance() > 0);
        assertTrue(result.getPathNodes().contains("Java"));
        assertTrue(result.getPathNodes().contains("Spring Boot"));
        assertTrue(result.getPathNodes().contains("Docker"));
        assertFalse(result.getStepExplanations().isEmpty());
    }

    @Test
    @DisplayName("Dijkstra handles disconnected skill nodes gracefully")
    void testDijkstraDisconnectedNodes() {
        ShortestPathDto result = graphService.findShortestPath("Java", "CompletelyUnrelatedUnknownSkill");
        assertFalse(result.isPathFound());
        assertEquals(Double.POSITIVE_INFINITY, result.getTotalDistance());
    }

    @Test
    @DisplayName("Candidate ranking applies deterministic 50-25-15-10 formula and excludes disabled users")
    void testDeterministicCandidateRankingFormula() {
        // Create Active Student 1: Matches all skills with EXPERT, has project, has blockchain verified cert
        User u1 = new User("Alice Expert", "alice@example.com", "pass", Role.STUDENT);
        u1.setId(1L);
        u1.setEnabled(true);
        StudentProfile p1 = new StudentProfile(u1);
        p1.setId(10L);
        Skill s1 = new Skill(p1, "Java", "Backend", "EXPERT", 5);
        Skill s2 = new Skill(p1, "Spring Boot", "Backend", "EXPERT", 4);
        p1.setSkills(List.of(s1, s2));

        Project proj1 = new Project(p1, "FinTech Engine", "Spring Boot payment processing", "Java, Spring Boot, MySQL", "https://demo.io", "https://github.com/alice/fintech", "2024-01-01", "2024-06-01", true);
        p1.setProjects(List.of(proj1));

        Certificate c1 = new Certificate(p1, "Java Certified Pro", "Oracle", "2024-01-01", null, "ORA-1", null);
        c1.setBlockchainHash("a".repeat(64)); // Verified on blockchain
        c1.setRevoked(false);
        Certificate c2 = new Certificate(p1, "Spring Master", "VMware", "2024-06-01", null, "SPR-2", null);
        c2.setBlockchainHash("b".repeat(64)); // Verified on blockchain
        c2.setRevoked(false);
        p1.setCertificates(List.of(c1, c2));

        // Create Active Student 2: Matches 1 skill with BEGINNER, no projects, no verified certs
        User u2 = new User("Bob Beginner", "bob@example.com", "pass", Role.STUDENT);
        u2.setId(2L);
        u2.setEnabled(true);
        StudentProfile p2 = new StudentProfile(u2);
        p2.setId(20L);
        Skill s3 = new Skill(p2, "Java", "Backend", "BEGINNER", 1);
        p2.setSkills(List.of(s3));

        // Create Inactive Student 3 (Disabled): Should be filtered out
        User u3 = new User("Charlie Disabled", "charlie@example.com", "pass", Role.STUDENT);
        u3.setId(3L);
        u3.setEnabled(false);
        StudentProfile p3 = new StudentProfile(u3);
        p3.setId(30L);
        p3.setSkills(List.of(new Skill(p3, "Java", "Backend", "EXPERT", 5)));

        when(profileRepository.findAll()).thenReturn(List.of(p1, p2, p3));

        List<CandidateRankDto> ranked = graphService.rankCandidatesForSkills(List.of("Java", "Spring Boot"));

        // Only 2 active students should be returned
        assertEquals(2, ranked.size());

        CandidateRankDto first = ranked.get(0);
        CandidateRankDto second = ranked.get(1);

        assertEquals("Alice Expert", first.getStudentName());
        assertEquals("Bob Beginner", second.getStudentName());

        // Alice:
        // Coverage (2/2): 50.0
        // Proficiency (EXPERT=1.0): 25.0
        // Project (both demonstrated): 15.0
        // Verified certs (2 verified): 10.0
        // Total = 100.0
        assertEquals(100.0, first.getCompositeScore(), 0.1);
        assertEquals(50.0, first.getSkillCoverageScore(), 0.1);
        assertEquals(25.0, first.getProficiencyDepthScore(), 0.1);
        assertEquals(15.0, first.getProjectRelevanceScore(), 0.1);
        assertEquals(10.0, first.getBlockchainVerifiedScore(), 0.1);

        // Bob:
        // Coverage (1/2): 25.0
        // Proficiency (BEGINNER=0.25): 6.3
        // Project (none): 0.0
        // Verified certs (none): 0.0
        // Total = 31.3
        assertTrue(second.getCompositeScore() < first.getCompositeScore());
        assertEquals(25.0, second.getSkillCoverageScore(), 0.1);
        assertEquals(6.3, second.getProficiencyDepthScore(), 0.1);
    }
}
