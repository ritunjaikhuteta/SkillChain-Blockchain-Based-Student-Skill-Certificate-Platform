package com.skillchain.dto;

import java.util.ArrayList;
import java.util.List;

public class ShortestPathDto {

    private String sourceSkill;
    private String targetSkill;
    private boolean pathFound;
    private double totalDistance;
    private List<String> pathNodes = new ArrayList<>();
    private List<String> stepExplanations = new ArrayList<>();

    public ShortestPathDto() {
    }

    public ShortestPathDto(String sourceSkill, String targetSkill, boolean pathFound,
                           double totalDistance, List<String> pathNodes, List<String> stepExplanations) {
        this.sourceSkill = sourceSkill;
        this.targetSkill = targetSkill;
        this.pathFound = pathFound;
        this.totalDistance = totalDistance;
        this.pathNodes = pathNodes != null ? pathNodes : new ArrayList<>();
        this.stepExplanations = stepExplanations != null ? stepExplanations : new ArrayList<>();
    }

    public static ShortestPathDto noPath(String source, String target) {
        ShortestPathDto dto = new ShortestPathDto();
        dto.setSourceSkill(source);
        dto.setTargetSkill(target);
        dto.setPathFound(false);
        dto.setTotalDistance(Double.POSITIVE_INFINITY);
        dto.getStepExplanations().add("No connected learning pathway found between '" + source + "' and '" + target + "'.");
        return dto;
    }

    public String getSourceSkill() {
        return sourceSkill;
    }

    public void setSourceSkill(String sourceSkill) {
        this.sourceSkill = sourceSkill;
    }

    public String getTargetSkill() {
        return targetSkill;
    }

    public void setTargetSkill(String targetSkill) {
        this.targetSkill = targetSkill;
    }

    public boolean isPathFound() {
        return pathFound;
    }

    public void setPathFound(boolean pathFound) {
        this.pathFound = pathFound;
    }

    public double getTotalDistance() {
        return totalDistance;
    }

    public void setTotalDistance(double totalDistance) {
        this.totalDistance = totalDistance;
    }

    public List<String> getPathNodes() {
        return pathNodes;
    }

    public void setPathNodes(List<String> pathNodes) {
        this.pathNodes = pathNodes;
    }

    public List<String> getStepExplanations() {
        return stepExplanations;
    }

    public void setStepExplanations(List<String> stepExplanations) {
        this.stepExplanations = stepExplanations;
    }
}
