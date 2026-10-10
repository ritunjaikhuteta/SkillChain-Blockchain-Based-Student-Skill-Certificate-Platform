package com.skillchain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ProjectRequest {

    @NotBlank(message = "Project title is required")
    @Size(max = 150, message = "Project title cannot exceed 150 characters")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @Size(max = 255, message = "Tech stack cannot exceed 255 characters")
    private String techStack;

    @Size(max = 255, message = "Live demo URL cannot exceed 255 characters")
    private String liveDemoUrl;

    @Size(max = 255, message = "GitHub URL cannot exceed 255 characters")
    private String githubUrl;

    @Size(max = 30, message = "Start date cannot exceed 30 characters")
    private String startDate;

    @Size(max = 30, message = "End date cannot exceed 30 characters")
    private String endDate;

    private boolean featured = false;

    public ProjectRequest() {
    }

    public ProjectRequest(String title, String description, String techStack, String liveDemoUrl,
                          String githubUrl, String startDate, String endDate, boolean featured) {
        this.title = title;
        this.description = description;
        this.techStack = techStack;
        this.liveDemoUrl = liveDemoUrl;
        this.githubUrl = githubUrl;
        this.startDate = startDate;
        this.endDate = endDate;
        this.featured = featured;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTechStack() {
        return techStack;
    }

    public void setTechStack(String techStack) {
        this.techStack = techStack;
    }

    public String getLiveDemoUrl() {
        return liveDemoUrl;
    }

    public void setLiveDemoUrl(String liveDemoUrl) {
        this.liveDemoUrl = liveDemoUrl;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public boolean isFeatured() {
        return featured;
    }

    public void setFeatured(boolean featured) {
        this.featured = featured;
    }
}
