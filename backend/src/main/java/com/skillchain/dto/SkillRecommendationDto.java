package com.skillchain.dto;

import java.util.ArrayList;
import java.util.List;

public class SkillRecommendationDto {

    private String skillName;
    private String category;
    private double relevanceScore; // 0.0 - 100.0
    private String reason;
    private List<String> learningPath = new ArrayList<>();
    private double learningDistance;

    public SkillRecommendationDto() {
    }

    public SkillRecommendationDto(String skillName, String category, double relevanceScore,
                                  String reason, List<String> learningPath, double learningDistance) {
        this.skillName = skillName;
        this.category = category;
        this.relevanceScore = relevanceScore;
        this.reason = reason;
        this.learningPath = learningPath != null ? learningPath : new ArrayList<>();
        this.learningDistance = learningDistance;
    }

    public String getSkillName() {
        return skillName;
    }

    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public double getRelevanceScore() {
        return relevanceScore;
    }

    public void setRelevanceScore(double relevanceScore) {
        this.relevanceScore = relevanceScore;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public List<String> getLearningPath() {
        return learningPath;
    }

    public void setLearningPath(List<String> learningPath) {
        this.learningPath = learningPath;
    }

    public double getLearningDistance() {
        return learningDistance;
    }

    public void setLearningDistance(double learningDistance) {
        this.learningDistance = learningDistance;
    }
}
