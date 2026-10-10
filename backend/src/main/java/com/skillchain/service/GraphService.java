package com.skillchain.service;

import com.skillchain.dto.CandidateRankDto;
import com.skillchain.dto.GraphDataDto;
import com.skillchain.dto.ShortestPathDto;
import com.skillchain.dto.SkillRecommendationDto;
import com.skillchain.model.*;
import com.skillchain.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class GraphService {

    private final StudentProfileRepository profileRepository;
    private final SkillRepository skillRepository;
    private final ProjectRepository projectRepository;
    private final CertificateRepository certificateRepository;

    // In-memory weighted skill graph
    private final Map<String, List<WeightedEdge>> skillGraph = new HashMap<>();

    public GraphService(
            StudentProfileRepository profileRepository,
            SkillRepository skillRepository,
            ProjectRepository projectRepository,
            CertificateRepository certificateRepository
    ) {
        this.profileRepository = profileRepository;
        this.skillRepository = skillRepository;
        this.projectRepository = projectRepository;
        this.certificateRepository = certificateRepository;
        initPredefinedSkillNetwork();
    }

    public static class WeightedEdge {
        private final String target;
        private final double weight;
        private final String relationship;
        private final String explanation;

        public WeightedEdge(String target, double weight, String relationship, String explanation) {
            this.target = target;
            this.weight = weight;
            this.relationship = relationship;
            this.explanation = explanation;
        }

        public String getTarget() {
            return target;
        }

        public double getWeight() {
            return weight;
        }

        public String getRelationship() {
            return relationship;
        }

        public String getExplanation() {
            return explanation;
        }
    }

    private void addBidirectionalEdge(String skillA, String skillB, double weight, String relationship, String explanation) {
        String a = normalizeSkill(skillA);
        String b = normalizeSkill(skillB);
        if (a.equalsIgnoreCase(b)) return;

        skillGraph.computeIfAbsent(a, k -> new ArrayList<>());
        skillGraph.computeIfAbsent(b, k -> new ArrayList<>());

        // Prevent duplicate edges
        if (skillGraph.get(a).stream().noneMatch(e -> e.getTarget().equalsIgnoreCase(b))) {
            skillGraph.get(a).add(new WeightedEdge(b, weight, relationship, explanation));
        }
        if (skillGraph.get(b).stream().noneMatch(e -> e.getTarget().equalsIgnoreCase(a))) {
            skillGraph.get(b).add(new WeightedEdge(a, weight, relationship, explanation));
        }
    }

    private String normalizeSkill(String skill) {
        return skill != null ? skill.trim() : "";
    }

    private void initPredefinedSkillNetwork() {
        // Java ecosystem
        addBidirectionalEdge("Java", "Spring Boot", 1.0, "FRAMEWORK", "Spring Boot is the standard production framework for enterprise Java development.");
        addBidirectionalEdge("Spring Boot", "Microservices", 1.2, "ARCHITECTURE", "Spring Boot provides the backbone for microservice architectures.");
        addBidirectionalEdge("Spring Boot", "MySQL", 1.0, "PERSISTENCE", "MySQL is a standard relational database commonly integrated with Spring Boot JPA.");
        addBidirectionalEdge("Spring Boot", "PostgreSQL", 1.0, "PERSISTENCE", "PostgreSQL provides robust relational data persistence with Hibernate & Spring Data.");
        addBidirectionalEdge("Spring Boot", "Docker", 1.2, "DEPLOYMENT", "Docker containers package Spring Boot services for cloud deployments.");
        addBidirectionalEdge("Spring Boot", "Redis", 1.1, "CACHE", "Redis serves as high-speed caching and session management for Spring Boot.");
        addBidirectionalEdge("Java", "Kotlin", 1.1, "JVM_LANG", "Kotlin is a modern, statically typed language running seamlessly on the JVM alongside Java.");

        // JavaScript / Web ecosystem
        addBidirectionalEdge("JavaScript", "TypeScript", 0.8, "SUPERSET", "TypeScript adds static type definitions to JavaScript for scalable codebases.");
        addBidirectionalEdge("JavaScript", "React", 1.0, "UI_LIBRARY", "React is the leading component-based declarative UI library for JavaScript.");
        addBidirectionalEdge("TypeScript", "React", 0.9, "UI_LIBRARY", "TypeScript provides first-class type safety for modern React applications.");
        addBidirectionalEdge("React", "Next.js", 1.0, "META_FRAMEWORK", "Next.js builds upon React to enable SSR, SSG, and full-stack App Router features.");
        addBidirectionalEdge("React", "Tailwind CSS", 0.9, "STYLING", "Tailwind CSS is an efficient utility-first CSS framework commonly styled with React.");
        addBidirectionalEdge("React", "Redux", 1.2, "STATE_MANAGEMENT", "Redux manages centralized complex global application state across React components.");
        addBidirectionalEdge("JavaScript", "Node.js", 1.0, "RUNTIME", "Node.js brings JavaScript runtime capabilities to server-side backends.");
        addBidirectionalEdge("Node.js", "Express.js", 0.9, "FRAMEWORK", "Express is a fast, unopinionated minimalist web framework for Node.js.");
        addBidirectionalEdge("Node.js", "MongoDB", 1.1, "PERSISTENCE", "MongoDB is a flexible NoSQL document database often paired with Node.js/Express.");

        // Python / AI ecosystem
        addBidirectionalEdge("Python", "FastAPI", 1.0, "API_FRAMEWORK", "FastAPI provides high-performance asynchronous API endpoints in modern Python.");
        addBidirectionalEdge("Python", "Django", 1.2, "FULL_STACK", "Django is a high-level full-stack web framework emphasizing rapid development in Python.");
        addBidirectionalEdge("Python", "Machine Learning", 1.4, "DOMAIN", "Python is the primary language driving modern machine learning data pipelines.");
        addBidirectionalEdge("Machine Learning", "Deep Learning", 1.3, "SPECIALIZATION", "Deep Learning applies multi-layered neural networks to complex patterns.");
        addBidirectionalEdge("Deep Learning", "PyTorch", 1.1, "FRAMEWORK", "PyTorch is an open-source machine learning framework favored for deep learning research.");
        addBidirectionalEdge("Deep Learning", "TensorFlow", 1.1, "FRAMEWORK", "TensorFlow is an end-to-end open source platform for machine learning & AI.");

        // DevOps & Cloud
        addBidirectionalEdge("Docker", "Kubernetes", 1.3, "ORCHESTRATION", "Kubernetes orchestrates automated scaling and management of Docker containers.");
        addBidirectionalEdge("Docker", "CI/CD", 1.1, "AUTOMATION", "Docker enables deterministic, reproducible build environments in CI/CD pipelines.");
        addBidirectionalEdge("Git", "CI/CD", 1.0, "VCS_INTEGRATION", "Git repositories trigger automated test and build workflows in modern CI/CD.");
        addBidirectionalEdge("Microservices", "Kubernetes", 1.4, "ORCHESTRATION", "Kubernetes is the standard runtime platform for containerized microservice fleets.");

        // Database & Blockchain
        addBidirectionalEdge("SQL", "PostgreSQL", 0.7, "IMPLEMENTATION", "PostgreSQL implements advanced standards-compliant relational SQL.");
        addBidirectionalEdge("SQL", "MySQL", 0.7, "IMPLEMENTATION", "MySQL implements reliable and widely-adopted relational SQL.");
        addBidirectionalEdge("Blockchain", "Cryptography", 1.2, "FOUNDATION", "Cryptographic hashes (SHA-256) and signatures form the mathematical backbone of blockchain.");
        addBidirectionalEdge("Blockchain", "Smart Contracts", 1.4, "AUTOMATION", "Smart contracts execute self-enforcing verifiable code on decentralized ledgers.");
        addBidirectionalEdge("Blockchain", "SHA-256", 0.8, "SECURITY", "SHA-256 hashing secures immutable block anchoring and digital verification.");
    }

    // --- Graph Traversal: BFS ---
    public List<String> bfsTraverse(String startSkill, int maxDepth) {
        String root = normalizeSkill(startSkill);
        List<String> visitedOrder = new ArrayList<>();
        if (!skillGraph.containsKey(root)) {
            visitedOrder.add(root);
            return visitedOrder;
        }

        Set<String> visited = new HashSet<>();
        Queue<Map.Entry<String, Integer>> queue = new LinkedList<>();

        visited.add(root.toLowerCase());
        queue.add(new AbstractMap.SimpleEntry<>(root, 0));

        while (!queue.isEmpty()) {
            Map.Entry<String, Integer> current = queue.poll();
            String skill = current.getKey();
            int depth = current.getValue();
            visitedOrder.add(skill);

            if (depth < maxDepth) {
                List<WeightedEdge> edges = skillGraph.getOrDefault(skill, Collections.emptyList());
                for (WeightedEdge edge : edges) {
                    if (!visited.contains(edge.getTarget().toLowerCase())) {
                        visited.add(edge.getTarget().toLowerCase());
                        queue.add(new AbstractMap.SimpleEntry<>(edge.getTarget(), depth + 1));
                    }
                }
            }
        }
        return visitedOrder;
    }

    // --- Graph Traversal: DFS ---
    public List<String> dfsTraverse(String startSkill, int maxDepth) {
        String root = normalizeSkill(startSkill);
        List<String> visitedOrder = new ArrayList<>();
        Set<String> visited = new HashSet<>();

        dfsHelper(root, 0, maxDepth, visited, visitedOrder);
        return visitedOrder;
    }

    private void dfsHelper(String current, int currentDepth, int maxDepth, Set<String> visited, List<String> visitedOrder) {
        visited.add(current.toLowerCase());
        visitedOrder.add(current);

        if (currentDepth >= maxDepth) return;

        List<WeightedEdge> edges = skillGraph.getOrDefault(current, Collections.emptyList());
        for (WeightedEdge edge : edges) {
            if (!visited.contains(edge.getTarget().toLowerCase())) {
                dfsHelper(edge.getTarget(), currentDepth + 1, maxDepth, visited, visitedOrder);
            }
        }
    }

    // --- Weighted Shortest Path: Dijkstra's Algorithm ---
    public ShortestPathDto findShortestPath(String fromSkill, String toSkill) {
        String source = findMatchingGraphKey(fromSkill);
        String target = findMatchingGraphKey(toSkill);

        if (source == null || target == null) {
            return ShortestPathDto.noPath(fromSkill, toSkill);
        }

        if (source.equalsIgnoreCase(target)) {
            return new ShortestPathDto(source, target, true, 0.0,
                    List.of(source), List.of("Start and target skill are identical."));
        }

        Map<String, Double> distances = new HashMap<>();
        Map<String, String> previousNode = new HashMap<>();
        Map<String, WeightedEdge> edgeUsed = new HashMap<>();

        for (String node : skillGraph.keySet()) {
            distances.put(node.toLowerCase(), Double.POSITIVE_INFINITY);
        }
        distances.put(source.toLowerCase(), 0.0);

        PriorityQueue<Map.Entry<String, Double>> pq = new PriorityQueue<>(Map.Entry.comparingByValue());
        pq.add(new AbstractMap.SimpleEntry<>(source, 0.0));
        Set<String> settled = new HashSet<>();

        while (!pq.isEmpty()) {
            Map.Entry<String, Double> current = pq.poll();
            String u = current.getKey();

            if (settled.contains(u.toLowerCase())) continue;
            settled.add(u.toLowerCase());

            if (u.equalsIgnoreCase(target)) break;

            List<WeightedEdge> edges = skillGraph.getOrDefault(u, Collections.emptyList());
            for (WeightedEdge edge : edges) {
                String v = edge.getTarget();
                if (settled.contains(v.toLowerCase())) continue;

                double newDist = distances.get(u.toLowerCase()) + edge.getWeight();
                if (newDist < distances.getOrDefault(v.toLowerCase(), Double.POSITIVE_INFINITY)) {
                    distances.put(v.toLowerCase(), newDist);
                    previousNode.put(v.toLowerCase(), u);
                    edgeUsed.put(v.toLowerCase(), edge);
                    pq.add(new AbstractMap.SimpleEntry<>(v, newDist));
                }
            }
        }

        if (distances.get(target.toLowerCase()) == Double.POSITIVE_INFINITY) {
            return ShortestPathDto.noPath(fromSkill, toSkill);
        }

        // Reconstruct path
        LinkedList<String> path = new LinkedList<>();
        LinkedList<String> explanations = new LinkedList<>();
        String curr = target;

        while (curr != null && !curr.equalsIgnoreCase(source)) {
            path.addFirst(curr);
            WeightedEdge edge = edgeUsed.get(curr.toLowerCase());
            String prev = previousNode.get(curr.toLowerCase());
            if (edge != null && prev != null) {
                explanations.addFirst(String.format("Step: '%s' -> '%s' (%s, cost %.1f): %s",
                        prev, curr, edge.getRelationship(), edge.getWeight(), edge.getExplanation()));
            }
            curr = prev;
        }
        path.addFirst(source);

        double totalDist = roundToTwoDecimals(distances.get(target.toLowerCase()));
        return new ShortestPathDto(source, target, true, totalDist, path, explanations);
    }

    private String findMatchingGraphKey(String skill) {
        if (skill == null) return null;
        String trimmed = skill.trim();
        for (String key : skillGraph.keySet()) {
            if (key.equalsIgnoreCase(trimmed)) {
                return key;
            }
        }
        return null;
    }

    // --- Deterministic Recruiter Candidate Ranking (50-25-15-10) ---
    @Transactional(readOnly = true)
    public List<CandidateRankDto> rankCandidatesForSkills(List<String> targetSkills) {
        if (targetSkills == null || targetSkills.isEmpty()) {
            return Collections.emptyList();
        }

        List<String> cleanTargetSkills = targetSkills.stream()
                .filter(s -> s != null && !s.isBlank())
                .map(String::trim)
                .collect(Collectors.toList());

        if (cleanTargetSkills.isEmpty()) {
            return Collections.emptyList();
        }

        List<StudentProfile> allProfiles = profileRepository.findAll();
        List<CandidateRankDto> candidates = new ArrayList<>();

        for (StudentProfile profile : allProfiles) {
            User user = profile.getUser();
            // Filter disabled accounts and ensure STUDENT role
            if (user == null || !user.isEnabled() || user.getRole() != Role.STUDENT) {
                continue;
            }

            CandidateRankDto candidate = calculateCandidateScore(profile, cleanTargetSkills);
            candidates.add(candidate);
        }

        // Deterministic sorting:
        // 1. Composite score DESC
        // 2. Matching skills count DESC
        // 3. Verified certs count DESC
        // 4. Student ID ASC
        candidates.sort(Comparator
                .comparingDouble(CandidateRankDto::getCompositeScore).reversed()
                .thenComparingInt((CandidateRankDto c) -> c.getMatchingSkills().size()).reversed()
                .thenComparingInt(CandidateRankDto::getVerifiedCertificatesCount).reversed()
                .thenComparing(CandidateRankDto::getStudentId)
        );

        return candidates;
    }

    private CandidateRankDto calculateCandidateScore(StudentProfile profile, List<String> targetSkills) {
        User user = profile.getUser();
        List<Skill> studentSkills = profile.getSkills() != null ? profile.getSkills() : Collections.emptyList();
        List<Project> studentProjects = profile.getProjects() != null ? profile.getProjects() : Collections.emptyList();
        List<Certificate> studentCerts = profile.getCertificates() != null ? profile.getCertificates() : Collections.emptyList();

        List<String> matchingSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();
        double sumProficiencyWeights = 0.0;

        for (String target : targetSkills) {
            Optional<Skill> match = studentSkills.stream()
                    .filter(s -> s.getName().trim().equalsIgnoreCase(target.trim()))
                    .findFirst();

            if (match.isPresent()) {
                matchingSkills.add(match.get().getName());
                sumProficiencyWeights += getProficiencyWeight(match.get().getProficiency());
            } else {
                missingSkills.add(target);
            }
        }

        // 1. Skill Match Coverage (50%)
        double coverageScore = ((double) matchingSkills.size() / (double) targetSkills.size()) * 50.0;

        // 2. Proficiency Depth (25%)
        double proficiencyScore = 0.0;
        if (!matchingSkills.isEmpty()) {
            double avgProficiency = sumProficiencyWeights / (double) matchingSkills.size();
            proficiencyScore = avgProficiency * 25.0;
        }

        // 3. Project Relevance (15%)
        long matchingSkillsInProjects = 0;
        for (String matchedSkill : matchingSkills) {
            boolean inProject = studentProjects.stream().anyMatch(p ->
                    (p.getTechStack() != null && p.getTechStack().toLowerCase().contains(matchedSkill.toLowerCase())) ||
                    (p.getDescription() != null && p.getDescription().toLowerCase().contains(matchedSkill.toLowerCase()))
            );
            if (inProject) matchingSkillsInProjects++;
        }
        double projectScore = 0.0;
        if (!matchingSkills.isEmpty()) {
            projectScore = ((double) matchingSkillsInProjects / (double) matchingSkills.size()) * 15.0;
        }

        // 4. Blockchain-Verified Certificates (10%)
        long verifiedCerts = studentCerts.stream()
                .filter(c -> c.getBlockchainHash() != null && !c.isRevoked())
                .count();

        // 2 or more verified certs earns the full 10 points
        double verifiedScore = Math.min(1.0, verifiedCerts / 2.0) * 10.0;

        double composite = coverageScore + proficiencyScore + projectScore + verifiedScore;
        composite = roundToOneDecimal(composite);
        coverageScore = roundToOneDecimal(coverageScore);
        proficiencyScore = roundToOneDecimal(proficiencyScore);
        projectScore = roundToOneDecimal(projectScore);
        verifiedScore = roundToOneDecimal(verifiedScore);

        String explanation = String.format(
                "Score: %.1f%% | Skill Match: %d/%d (%.1f/50) | Proficiency: %.1f/25 | Projects: %d demonstrated (%.1f/15) | Ledger Verified: %d certs (%.1f/10)",
                composite, matchingSkills.size(), targetSkills.size(), coverageScore,
                proficiencyScore, matchingSkillsInProjects, projectScore,
                verifiedCerts, verifiedScore
        );

        CandidateRankDto dto = new CandidateRankDto();
        dto.setStudentId(user.getId());
        dto.setProfileId(profile.getId());
        dto.setStudentName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setHeadline(profile.getHeadline());
        dto.setCompositeScore(composite);
        dto.setSkillCoverageScore(coverageScore);
        dto.setProficiencyDepthScore(proficiencyScore);
        dto.setProjectRelevanceScore(projectScore);
        dto.setBlockchainVerifiedScore(verifiedScore);
        dto.setMatchingSkills(matchingSkills);
        dto.setMissingSkills(missingSkills);
        dto.setVerifiedCertificatesCount((int) verifiedCerts);
        dto.setTotalProjectsCount(studentProjects.size());
        dto.setExplanation(explanation);

        return dto;
    }

    private double getProficiencyWeight(String level) {
        if (level == null) return 0.5;
        return switch (level.trim().toUpperCase()) {
            case "BEGINNER" -> 0.25;
            case "INTERMEDIATE" -> 0.50;
            case "ADVANCED" -> 0.75;
            case "EXPERT" -> 1.00;
            default -> 0.50;
        };
    }

    // --- Student Personalized Recommendations ---
    @Transactional(readOnly = true)
    public List<SkillRecommendationDto> getRecommendationsForStudent(String email) {
        Optional<StudentProfile> profileOpt = profileRepository.findByUserEmail(email);
        if (profileOpt.isEmpty()) {
            return Collections.emptyList();
        }

        StudentProfile profile = profileOpt.get();
        List<Skill> studentSkills = profile.getSkills() != null ? profile.getSkills() : Collections.emptyList();
        Set<String> existingSkillNames = studentSkills.stream()
                .map(s -> s.getName().trim().toLowerCase())
                .collect(Collectors.toSet());

        Map<String, Double> candidateScores = new HashMap<>();
        Map<String, ShortestPathDto> candidatePaths = new HashMap<>();

        for (Skill s : studentSkills) {
            String norm = findMatchingGraphKey(s.getName());
            if (norm == null) continue;

            List<WeightedEdge> neighbors = skillGraph.getOrDefault(norm, Collections.emptyList());
            for (WeightedEdge edge : neighbors) {
                String candidate = edge.getTarget();
                if (existingSkillNames.contains(candidate.toLowerCase())) {
                    continue; // Student already possesses this skill
                }

                ShortestPathDto path = findShortestPath(norm, candidate);
                if (path.isPathFound()) {
                    double currentScore = candidateScores.getOrDefault(candidate, 0.0);
                    // Shorter distance -> higher relevance
                    double pathScore = Math.max(10.0, 100.0 - (path.getTotalDistance() * 20.0));
                    if (pathScore > currentScore) {
                        candidateScores.put(candidate, pathScore);
                        candidatePaths.put(candidate, path);
                    }
                }
            }
        }

        List<SkillRecommendationDto> recommendations = new ArrayList<>();
        for (Map.Entry<String, Double> entry : candidateScores.entrySet()) {
            String skill = entry.getKey();
            double score = roundToOneDecimal(entry.getValue());
            ShortestPathDto path = candidatePaths.get(skill);

            String reason = "Directly enhances your existing expertise in " +
                    (path != null && !path.getPathNodes().isEmpty() ? path.getPathNodes().get(0) : "technical stack");

            recommendations.add(new SkillRecommendationDto(
                    skill,
                    "Technical Competency",
                    score,
                    reason,
                    path != null ? path.getPathNodes() : List.of(skill),
                    path != null ? path.getTotalDistance() : 1.0
            ));
        }

        recommendations.sort(Comparator.comparingDouble(SkillRecommendationDto::getRelevanceScore).reversed());
        return recommendations.stream().limit(10).collect(Collectors.toList());
    }

    // --- Dynamic 3D Visualization Graph ---
    @Transactional(readOnly = true)
    public GraphDataDto getGraphVisualizationData() {
        List<GraphDataDto.Node> nodes = new ArrayList<>();
        List<GraphDataDto.Link> links = new ArrayList<>();
        Set<String> addedNodeIds = new HashSet<>();

        List<StudentProfile> profiles = profileRepository.findAll();

        // 1. Add student profiles and their connections
        for (StudentProfile profile : profiles) {
            if (profile.getUser() == null || !profile.getUser().isEnabled()) continue;

            String studentNodeId = "student-" + profile.getId();
            if (!addedNodeIds.contains(studentNodeId)) {
                nodes.add(new GraphDataDto.Node(
                        studentNodeId,
                        profile.getUser().getFullName(),
                        "student",
                        12,
                        "#5555A5",
                        profile.getHeadline() != null ? profile.getHeadline() : "SkillChain Student"
                ));
                addedNodeIds.add(studentNodeId);
            }

            // Skills
            if (profile.getSkills() != null) {
                for (Skill skill : profile.getSkills()) {
                    String skillNodeId = "skill-" + skill.getName().trim().toLowerCase().replaceAll("\\s+", "-");
                    if (!addedNodeIds.contains(skillNodeId)) {
                        nodes.add(new GraphDataDto.Node(
                                skillNodeId,
                                skill.getName(),
                                "skill",
                                8,
                                "#10B981",
                                "Category: " + (skill.getCategory() != null ? skill.getCategory() : "Technical")
                        ));
                        addedNodeIds.add(skillNodeId);
                    }
                    links.add(new GraphDataDto.Link(studentNodeId, skillNodeId, 1.5, skill.getProficiency()));
                }
            }

            // Projects
            if (profile.getProjects() != null) {
                for (Project proj : profile.getProjects()) {
                    String projNodeId = "proj-" + proj.getId();
                    if (!addedNodeIds.contains(projNodeId)) {
                        nodes.add(new GraphDataDto.Node(
                                projNodeId,
                                proj.getTitle(),
                                "project",
                                6,
                                "#3B82F6",
                                proj.getTechStack() != null ? proj.getTechStack() : "Student Project"
                        ));
                        addedNodeIds.add(projNodeId);
                    }
                    links.add(new GraphDataDto.Link(studentNodeId, projNodeId, 1.0, "built"));
                }
            }

            // Certificates
            if (profile.getCertificates() != null) {
                for (Certificate cert : profile.getCertificates()) {
                    String certNodeId = "cert-" + cert.getId();
                    if (!addedNodeIds.contains(certNodeId)) {
                        boolean verified = cert.getBlockchainHash() != null && !cert.isRevoked();
                        nodes.add(new GraphDataDto.Node(
                                certNodeId,
                                cert.getTitle(),
                                "certificate",
                                verified ? 7 : 5,
                                verified ? "#F59E0B" : "#9CA3AF",
                                verified ? "Blockchain Verified Ledger Record" : "Unverified"
                        ));
                        addedNodeIds.add(certNodeId);
                    }
                    links.add(new GraphDataDto.Link(studentNodeId, certNodeId, 1.2, "holds"));
                }
            }
        }

        // 2. Add skill relationship edges between existing skill nodes
        for (Map.Entry<String, List<WeightedEdge>> entry : skillGraph.entrySet()) {
            String sourceKey = "skill-" + entry.getKey().toLowerCase().replaceAll("\\s+", "-");
            if (!addedNodeIds.contains(sourceKey)) continue;

            for (WeightedEdge edge : entry.getValue()) {
                String targetKey = "skill-" + edge.getTarget().toLowerCase().replaceAll("\\s+", "-");
                if (addedNodeIds.contains(targetKey) && sourceKey.compareTo(targetKey) < 0) {
                    links.add(new GraphDataDto.Link(sourceKey, targetKey, edge.getWeight(), edge.getRelationship()));
                }
            }
        }

        return new GraphDataDto(nodes, links);
    }

    private double roundToOneDecimal(double val) {
        return BigDecimal.valueOf(val).setScale(1, RoundingMode.HALF_UP).doubleValue();
    }

    private double roundToTwoDecimals(double val) {
        return BigDecimal.valueOf(val).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }
}
