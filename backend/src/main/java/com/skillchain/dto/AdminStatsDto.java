package com.skillchain.dto;

public class AdminStatsDto {

    private long totalUsers;
    private long totalStudents;
    private long totalRecruiters;
    private long totalAdmins;
    private long totalSkills;
    private long totalProjects;
    private long totalCertificates;

    public AdminStatsDto() {
    }

    public AdminStatsDto(long totalUsers, long totalStudents, long totalRecruiters, long totalAdmins,
                         long totalSkills, long totalProjects, long totalCertificates) {
        this.totalUsers = totalUsers;
        this.totalStudents = totalStudents;
        this.totalRecruiters = totalRecruiters;
        this.totalAdmins = totalAdmins;
        this.totalSkills = totalSkills;
        this.totalProjects = totalProjects;
        this.totalCertificates = totalCertificates;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalRecruiters() {
        return totalRecruiters;
    }

    public void setTotalRecruiters(long totalRecruiters) {
        this.totalRecruiters = totalRecruiters;
    }

    public long getTotalAdmins() {
        return totalAdmins;
    }

    public void setTotalAdmins(long totalAdmins) {
        this.totalAdmins = totalAdmins;
    }

    public long getTotalSkills() {
        return totalSkills;
    }

    public void setTotalSkills(long totalSkills) {
        this.totalSkills = totalSkills;
    }

    public long getTotalProjects() {
        return totalProjects;
    }

    public void setTotalProjects(long totalProjects) {
        this.totalProjects = totalProjects;
    }

    public long getTotalCertificates() {
        return totalCertificates;
    }

    public void setTotalCertificates(long totalCertificates) {
        this.totalCertificates = totalCertificates;
    }
}
