package com.skillchain.dto;

import java.util.ArrayList;
import java.util.List;

public class GraphDataDto {

    private List<Node> nodes = new ArrayList<>();
    private List<Link> links = new ArrayList<>();

    public GraphDataDto() {
    }

    public GraphDataDto(List<Node> nodes, List<Link> links) {
        this.nodes = nodes;
        this.links = links;
    }

    public List<Node> getNodes() {
        return nodes;
    }

    public void setNodes(List<Node> nodes) {
        this.nodes = nodes;
    }

    public List<Link> getLinks() {
        return links;
    }

    public void setLinks(List<Link> links) {
        this.links = links;
    }

    public static class Node {
        private String id;
        private String name;
        private String group; // "student", "skill", "project", "certificate"
        private int val; // size/weight for 3D sphere
        private String color;
        private String details;

        public Node() {
        }

        public Node(String id, String name, String group, int val, String color, String details) {
            this.id = id;
            this.name = name;
            this.group = group;
            this.val = val;
            this.color = color;
            this.details = details;
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getGroup() {
            return group;
        }

        public void setGroup(String group) {
            this.group = group;
        }

        public int getVal() {
            return val;
        }

        public void setVal(int val) {
            this.val = val;
        }

        public String getColor() {
            return color;
        }

        public void setColor(String color) {
            this.color = color;
        }

        public String getDetails() {
            return details;
        }

        public void setDetails(String details) {
            this.details = details;
        }
    }

    public static class Link {
        private String source;
        private String target;
        private double value;
        private String label;

        public Link() {
        }

        public Link(String source, String target, double value, String label) {
            this.source = source;
            this.target = target;
            this.value = value;
            this.label = label;
        }

        public String getSource() {
            return source;
        }

        public void setSource(String source) {
            this.source = source;
        }

        public String getTarget() {
            return target;
        }

        public void setTarget(String target) {
            this.target = target;
        }

        public double getValue() {
            return value;
        }

        public void setValue(double value) {
            this.value = value;
        }

        public String getLabel() {
            return label;
        }

        public void setLabel(String label) {
            this.label = label;
        }
    }
}
