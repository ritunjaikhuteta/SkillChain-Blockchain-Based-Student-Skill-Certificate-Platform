package com.skillchain.dto;

public class StudentStatsDto {

    private long skillsCount;
    private long projectsCount;
    private long certificatesCount;
    private int profileCompletionPercentage;

    public StudentStatsDto() {
    }

    public StudentStatsDto(long skillsCount, long projectsCount, long certificatesCount, int profileCompletionPercentage) {
        this.skillsCount = skillsCount;
        this.projectsCount = projectsCount;
        this.certificatesCount = certificatesCount;
        this.profileCompletionPercentage = profileCompletionPercentage;
    }

    public long getSkillsCount() {
        return skillsCount;
    }

    public void setSkillsCount(long skillsCount) {
        this.skillsCount = skillsCount;
    }

    public long getProjectsCount() {
        return projectsCount;
    }

    public void setProjectsCount(long projectsCount) {
        this.projectsCount = projectsCount;
    }

    public long getCertificatesCount() {
        return certificatesCount;
    }

    public void setCertificatesCount(long certificatesCount) {
        this.certificatesCount = certificatesCount;
    }

    public int getProfileCompletionPercentage() {
        return profileCompletionPercentage;
    }

    public void setProfileCompletionPercentage(int profileCompletionPercentage) {
        this.profileCompletionPercentage = profileCompletionPercentage;
    }
}
