package com.skillchain.dto;

import java.util.List;

public class TechStackDetectionDto {

    private String techStack;
    private List<String> technologies;
    private boolean detected;
    private String repository;
    private String message;

    public TechStackDetectionDto() {}

    public TechStackDetectionDto(String techStack, List<String> technologies, boolean detected, String repository, String message) {
        this.techStack = techStack;
        this.technologies = technologies;
        this.detected = detected;
        this.repository = repository;
        this.message = message;
    }

    public String getTechStack() {
        return techStack;
    }

    public void setTechStack(String techStack) {
        this.techStack = techStack;
    }

    public List<String> getTechnologies() {
        return technologies;
    }

    public void setTechnologies(List<String> technologies) {
        this.technologies = technologies;
    }

    public boolean isDetected() {
        return detected;
    }

    public void setDetected(boolean detected) {
        this.detected = detected;
    }

    public String getRepository() {
        return repository;
    }

    public void setRepository(String repository) {
        this.repository = repository;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
