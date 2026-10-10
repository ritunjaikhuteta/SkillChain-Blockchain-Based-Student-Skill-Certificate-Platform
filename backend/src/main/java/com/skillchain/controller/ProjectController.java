package com.skillchain.controller;

import com.skillchain.dto.ProjectRequest;
import com.skillchain.dto.ProjectResponse;
import com.skillchain.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getMyProjects(@AuthenticationPrincipal UserDetails userDetails) {
        List<ProjectResponse> projects = projectService.getMyProjects(userDetails.getUsername());
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/detect-tech-stack")
    public ResponseEntity<com.skillchain.dto.TechStackDetectionDto> detectTechStack(
            @RequestParam("url") String githubUrl
    ) {
        return ResponseEntity.ok(projectService.detectTechStackFromGitHub(githubUrl));
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> addProject(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ProjectRequest request
    ) {
        ProjectResponse created = projectService.addProject(userDetails.getUsername(), request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> updateProject(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody ProjectRequest request
    ) {
        ProjectResponse updated = projectService.updateProject(userDetails.getUsername(), id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        projectService.deleteProject(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
