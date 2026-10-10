package com.skillchain.service;

import com.skillchain.dto.ProjectRequest;
import com.skillchain.dto.ProjectResponse;
import com.skillchain.exception.ResourceNotFoundException;
import com.skillchain.model.Project;
import com.skillchain.model.StudentProfile;
import com.skillchain.model.User;
import com.skillchain.repository.ProjectRepository;
import com.skillchain.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final StudentProfileService profileService;
    private final UserRepository userRepository;
    private final GitHubTechStackService gitHubTechStackService;

    public ProjectService(
            ProjectRepository projectRepository,
            StudentProfileService profileService,
            UserRepository userRepository,
            GitHubTechStackService gitHubTechStackService
    ) {
        this.projectRepository = projectRepository;
        this.profileService = profileService;
        this.userRepository = userRepository;
        this.gitHubTechStackService = gitHubTechStackService;
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getMyProjects(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        StudentProfile profile = profileService.getOrCreateProfileForUser(user);
        return projectRepository.findByProfileId(profile.getId())
                .stream()
                .map(ProjectResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProjectResponse addProject(String email, ProjectRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        StudentProfile profile = profileService.getOrCreateProfileForUser(user);

        String stack = resolveTechStack(request.getTechStack(), request.getGithubUrl());

        Project project = new Project(
                profile,
                request.getTitle().trim(),
                request.getDescription().trim(),
                stack,
                request.getLiveDemoUrl() != null ? request.getLiveDemoUrl().trim() : null,
                request.getGithubUrl() != null ? request.getGithubUrl().trim() : null,
                request.getStartDate() != null ? request.getStartDate().trim() : null,
                request.getEndDate() != null ? request.getEndDate().trim() : null,
                request.isFeatured()
        );

        Project saved = projectRepository.save(project);
        return new ProjectResponse(saved);
    }

    @Transactional
    public ProjectResponse updateProject(String email, Long projectId, ProjectRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        StudentProfile profile = profileService.getOrCreateProfileForUser(user);

        Project project = projectRepository.findByIdAndProfileId(projectId, profile.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        String stack = resolveTechStack(request.getTechStack(), request.getGithubUrl());

        project.setTitle(request.getTitle().trim());
        project.setDescription(request.getDescription().trim());
        project.setTechStack(stack);
        project.setLiveDemoUrl(request.getLiveDemoUrl() != null ? request.getLiveDemoUrl().trim() : null);
        project.setGithubUrl(request.getGithubUrl() != null ? request.getGithubUrl().trim() : null);
        project.setStartDate(request.getStartDate() != null ? request.getStartDate().trim() : null);
        project.setEndDate(request.getEndDate() != null ? request.getEndDate().trim() : null);
        project.setFeatured(request.isFeatured());

        Project saved = projectRepository.save(project);
        return new ProjectResponse(saved);
    }

    public com.skillchain.dto.TechStackDetectionDto detectTechStackFromGitHub(String githubUrl) {
        return gitHubTechStackService.detectTechStack(githubUrl);
    }

    private String resolveTechStack(String providedStack, String githubUrl) {
        if (providedStack != null && !providedStack.trim().isBlank()) {
            return providedStack.trim();
        }
        if (githubUrl != null && !githubUrl.trim().isBlank()) {
            com.skillchain.dto.TechStackDetectionDto detected = gitHubTechStackService.detectTechStack(githubUrl);
            if (detected.isDetected() && detected.getTechStack() != null && !detected.getTechStack().isBlank()) {
                return detected.getTechStack();
            }
        }
        return null;
    }

    @Transactional
    public void deleteProject(String email, Long projectId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        StudentProfile profile = profileService.getOrCreateProfileForUser(user);

        Project project = projectRepository.findByIdAndProfileId(projectId, profile.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        projectRepository.delete(project);
    }
}
