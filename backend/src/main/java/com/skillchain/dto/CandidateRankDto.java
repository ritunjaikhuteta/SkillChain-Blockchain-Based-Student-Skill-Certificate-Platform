package com.skillchain.dto;

import java.util.ArrayList;
import java.util.List;

public class CandidateRankDto {

    private Long studentId;
    private Long profileId;
    private String studentName;
    private String email;
    private String headline;
    private double compositeScore;
    private double skillCoverageScore;      // 0 - 50
    private double proficiencyDepthScore;    // 0 - 25
    private double projectRelevanceScore;    // 0 - 15
    private double blockchainVerifiedScore;  // 0 - 10
    private List<String> matchingSkills = new ArrayList<>();
    private List<String> missingSkills = new ArrayList<>();
    private int verifiedCertificatesCount;
    private int totalProjectsCount;
    private String explanation;

    public CandidateRankDto() {
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getProfileId() {
        return profileId;
    }

    public void setProfileId(Long profileId) {
        this.profileId = profileId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public double getCompositeScore() {
        return compositeScore;
    }

    public void setCompositeScore(double compositeScore) {
        this.compositeScore = compositeScore;
    }

    public double getSkillCoverageScore() {
        return skillCoverageScore;
    }

    public void setSkillCoverageScore(double skillCoverageScore) {
        this.skillCoverageScore = skillCoverageScore;
    }

    public double getProficiencyDepthScore() {
        return proficiencyDepthScore;
    }

    public void setProficiencyDepthScore(double proficiencyDepthScore) {
        this.proficiencyDepthScore = proficiencyDepthScore;
    }

    public double getProjectRelevanceScore() {
        return projectRelevanceScore;
    }

    public void setProjectRelevanceScore(double projectRelevanceScore) {
        this.projectRelevanceScore = projectRelevanceScore;
    }

    public double getBlockchainVerifiedScore() {
        return blockchainVerifiedScore;
    }

    public void setBlockchainVerifiedScore(double blockchainVerifiedScore) {
        this.blockchainVerifiedScore = blockchainVerifiedScore;
    }

    public List<String> getMatchingSkills() {
        return matchingSkills;
    }

    public void setMatchingSkills(List<String> matchingSkills) {
        this.matchingSkills = matchingSkills;
    }

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(List<String> missingSkills) {
        this.missingSkills = missingSkills;
    }

    public int getVerifiedCertificatesCount() {
        return verifiedCertificatesCount;
    }

    public void setVerifiedCertificatesCount(int verifiedCertificatesCount) {
        this.verifiedCertificatesCount = verifiedCertificatesCount;
    }

    public int getTotalProjectsCount() {
        return totalProjectsCount;
    }

    public void setTotalProjectsCount(int totalProjectsCount) {
        this.totalProjectsCount = totalProjectsCount;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
}
