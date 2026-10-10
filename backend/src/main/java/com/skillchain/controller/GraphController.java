package com.skillchain.controller;

import com.skillchain.dto.GraphDataDto;
import com.skillchain.dto.ShortestPathDto;
import com.skillchain.dto.SkillRecommendationDto;
import com.skillchain.service.GraphService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class GraphController {

    private final GraphService graphService;

    public GraphController(GraphService graphService) {
        this.graphService = graphService;
    }

    @GetMapping("/api/student/recommendations/graph")
    public ResponseEntity<List<SkillRecommendationDto>> getStudentRecommendations(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String email = userDetails != null ? userDetails.getUsername() : "";
        List<SkillRecommendationDto> recommendations = graphService.getRecommendationsForStudent(email);
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping({"/api/student/network/graph", "/api/recruiter/network/graph"})
    public ResponseEntity<GraphDataDto> getNetworkGraph() {
        GraphDataDto graphData = graphService.getGraphVisualizationData();
        return ResponseEntity.ok(graphData);
    }

    @GetMapping("/api/skills/pathway")
    public ResponseEntity<ShortestPathDto> getSkillLearningPathway(
            @RequestParam("from") String fromSkill,
            @RequestParam("to") String toSkill
    ) {
        ShortestPathDto pathway = graphService.findShortestPath(fromSkill, toSkill);
        return ResponseEntity.ok(pathway);
    }
}
