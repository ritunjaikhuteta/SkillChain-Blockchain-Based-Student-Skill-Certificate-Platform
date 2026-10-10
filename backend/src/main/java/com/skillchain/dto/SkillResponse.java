package com.skillchain.dto;

import com.skillchain.model.Skill;

import java.time.LocalDateTime;

public class SkillResponse {

    private Long id;
    private String name;
    private String category;
    private String proficiency;
    private Integer yearsOfExperience;
    private LocalDateTime createdAt;

    public SkillResponse() {
    }

    public SkillResponse(Skill skill) {
        this.id = skill.getId();
        this.name = skill.getName();
        this.category = skill.getCategory();
        this.proficiency = skill.getProficiency();
        this.yearsOfExperience = skill.getYearsOfExperience();
        this.createdAt = skill.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getProficiency() {
        return proficiency;
    }

    public void setProficiency(String proficiency) {
        this.proficiency = proficiency;
    }

    public Integer getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(Integer yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
