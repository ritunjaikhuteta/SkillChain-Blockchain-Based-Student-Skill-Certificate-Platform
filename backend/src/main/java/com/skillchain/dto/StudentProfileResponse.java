package com.skillchain.dto;

import com.skillchain.model.Role;
import com.skillchain.model.StudentProfile;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class StudentProfileResponse {

    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private Role role;
    private String headline;
    private String bio;
    private String phone;
    private String location;
    private String institution;
    private String degree;
    private String graduationYear;
    private String githubUrl;
    private String linkedinUrl;
    private String portfolioUrl;
    private String avatarUrl;
    private List<SkillResponse> skills;
    private List<ProjectResponse> projects;
    private List<CertificateResponse> certificates;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public StudentProfileResponse() {
    }

    public StudentProfileResponse(StudentProfile profile) {
        this.id = profile.getId();
        if (profile.getUser() != null) {
            this.userId = profile.getUser().getId();
            this.fullName = profile.getUser().getFullName();
            this.email = profile.getUser().getEmail();
            this.role = profile.getUser().getRole();
        }
        this.headline = profile.getHeadline();
        this.bio = profile.getBio();
        this.phone = profile.getPhone();
        this.location = profile.getLocation();
        this.institution = profile.getInstitution();
        this.degree = profile.getDegree();
        this.graduationYear = profile.getGraduationYear();
        this.githubUrl = profile.getGithubUrl();
        this.linkedinUrl = profile.getLinkedinUrl();
        this.portfolioUrl = profile.getPortfolioUrl();
        this.avatarUrl = profile.getAvatarUrl();
        this.skills = profile.getSkills() != null
                ? profile.getSkills().stream().map(SkillResponse::new).collect(Collectors.toList())
                : Collections.emptyList();
        this.projects = profile.getProjects() != null
                ? profile.getProjects().stream().map(ProjectResponse::new).collect(Collectors.toList())
                : Collections.emptyList();
        this.certificates = profile.getCertificates() != null
                ? profile.getCertificates().stream().map(CertificateResponse::new).collect(Collectors.toList())
                : Collections.emptyList();
        this.createdAt = profile.getCreatedAt();
        this.updatedAt = profile.getUpdatedAt();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getInstitution() {
        return institution;
    }

    public void setInstitution(String institution) {
        this.institution = institution;
    }

    public String getDegree() {
        return degree;
    }

    public void setDegree(String degree) {
        this.degree = degree;
    }

    public String getGraduationYear() {
        return graduationYear;
    }

    public void setGraduationYear(String graduationYear) {
        this.graduationYear = graduationYear;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }

    public String getLinkedinUrl() {
        return linkedinUrl;
    }

    public void setLinkedinUrl(String linkedinUrl) {
        this.linkedinUrl = linkedinUrl;
    }

    public String getPortfolioUrl() {
        return portfolioUrl;
    }

    public void setPortfolioUrl(String portfolioUrl) {
        this.portfolioUrl = portfolioUrl;
    }

    public List<SkillResponse> getSkills() {
        return skills;
    }

    public void setSkills(List<SkillResponse> skills) {
        this.skills = skills;
    }

    public List<ProjectResponse> getProjects() {
        return projects;
    }

    public void setProjects(List<ProjectResponse> projects) {
        this.projects = projects;
    }

    public List<CertificateResponse> getCertificates() {
        return certificates;
    }

    public void setCertificates(List<CertificateResponse> certificates) {
        this.certificates = certificates;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
