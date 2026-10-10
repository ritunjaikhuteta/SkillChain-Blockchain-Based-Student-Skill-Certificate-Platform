package com.skillchain.service;

import com.skillchain.dto.SkillRequest;
import com.skillchain.dto.SkillResponse;
import com.skillchain.dto.SkillSuggestionDto;
import com.skillchain.exception.ResourceNotFoundException;
import com.skillchain.model.Skill;
import com.skillchain.model.StudentProfile;
import com.skillchain.model.User;
import com.skillchain.repository.SkillRepository;
import com.skillchain.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class SkillService {

    private final SkillRepository skillRepository;
    private final StudentProfileService profileService;
    private final UserRepository userRepository;

    public SkillService(
            SkillRepository skillRepository,
            StudentProfileService profileService,
            UserRepository userRepository
    ) {
        this.skillRepository = skillRepository;
        this.profileService = profileService;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<SkillResponse> getMySkills(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        StudentProfile profile = profileService.getOrCreateProfileForUser(user);
        return skillRepository.findByProfileId(profile.getId())
                .stream()
                .map(SkillResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public SkillResponse addSkill(String email, SkillRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        StudentProfile profile = profileService.getOrCreateProfileForUser(user);

        Skill skill = new Skill(
                profile,
                request.getName().trim(),
                request.getCategory().trim(),
                request.getProficiency().trim(),
                request.getYearsOfExperience()
        );

        Skill saved = skillRepository.save(skill);
        return new SkillResponse(saved);
    }

    @Transactional
    public SkillResponse updateSkill(String email, Long skillId, SkillRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        StudentProfile profile = profileService.getOrCreateProfileForUser(user);

        Skill skill = skillRepository.findByIdAndProfileId(skillId, profile.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + skillId));

        skill.setName(request.getName().trim());
        skill.setCategory(request.getCategory().trim());
        skill.setProficiency(request.getProficiency().trim());
        skill.setYearsOfExperience(request.getYearsOfExperience());

        Skill saved = skillRepository.save(skill);
        return new SkillResponse(saved);
    }

    @Transactional
    public void deleteSkill(String email, Long skillId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        StudentProfile profile = profileService.getOrCreateProfileForUser(user);

        Skill skill = skillRepository.findByIdAndProfileId(skillId, profile.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + skillId));

        skillRepository.delete(skill);
    }

    private static final List<SkillSuggestionDto> PREDEFINED_SKILLS = List.of(
            // J skills
            new SkillSuggestionDto("Java", "Backend", "Enterprise object-oriented programming language on the JVM"),
            new SkillSuggestionDto("JavaScript", "Frontend", "Ubiquitous dynamic scripting language for web and full-stack"),
            new SkillSuggestionDto("Jenkins", "Cloud / DevOps", "Continuous integration and automation server"),
            new SkillSuggestionDto("Jest", "Other", "Delightful JavaScript and TypeScript testing framework"),
            new SkillSuggestionDto("JPA / Hibernate", "Backend", "Java Persistence API object-relational mapping standard"),
            new SkillSuggestionDto("JSON", "Other", "Standard JavaScript Object Notation data exchange format"),
            new SkillSuggestionDto("JUnit", "Other", "Automated unit testing framework for Java applications"),
            new SkillSuggestionDto("JWT", "Backend", "JSON Web Tokens for stateless, cryptographically signed auth"),
            new SkillSuggestionDto("Julia", "AI / ML", "High-performance language for numerical computing and data science"),
            new SkillSuggestionDto("Jira", "Other", "Agile issue tracking and team project workflow management"),
            new SkillSuggestionDto("jQuery", "Frontend", "Classic lightweight JavaScript DOM manipulation library"),

            // Frontend
            new SkillSuggestionDto("React", "Frontend", "Declarative component-based UI library"),
            new SkillSuggestionDto("Next.js", "Frontend", "React framework for SSR, static generation, and full-stack apps"),
            new SkillSuggestionDto("TypeScript", "Frontend", "Statically typed superset of JavaScript for scalable codebases"),
            new SkillSuggestionDto("Tailwind CSS", "Frontend", "Utility-first CSS framework for modern responsive design"),
            new SkillSuggestionDto("Vue.js", "Frontend", "Progressive, approachable frontend JavaScript framework"),
            new SkillSuggestionDto("Angular", "Frontend", "Opinionated enterprise TypeScript frontend framework"),
            new SkillSuggestionDto("HTML5", "Frontend", "Core semantic markup language of the World Wide Web"),
            new SkillSuggestionDto("CSS3", "Frontend", "Modern cascading style sheets with flexbox and grid"),
            new SkillSuggestionDto("Redux", "Frontend", "Predictable global state container for JavaScript apps"),
            new SkillSuggestionDto("Svelte", "Frontend", "Compile-step reactive UI framework with zero virtual DOM"),
            new SkillSuggestionDto("Vite", "Frontend", "Next-generation fast frontend tooling and dev server"),

            // Backend
            new SkillSuggestionDto("Spring Boot", "Backend", "Production-grade enterprise Java backend framework"),
            new SkillSuggestionDto("Node.js", "Backend", "V8 asynchronous event-driven JavaScript backend runtime"),
            new SkillSuggestionDto("Express.js", "Backend", "Fast, unopinionated, minimalist web framework for Node.js"),
            new SkillSuggestionDto("FastAPI", "Backend", "High-performance asynchronous Python API framework"),
            new SkillSuggestionDto("Django", "Backend", "Batteries-included high-level Python web framework"),
            new SkillSuggestionDto("Go / Golang", "Backend", "Statically typed concurrent systems language by Google"),
            new SkillSuggestionDto("Rust", "Backend", "Memory-safe systems programming language without garbage collection"),
            new SkillSuggestionDto("C#", "Backend", "Modern, type-safe language for enterprise .NET applications"),
            new SkillSuggestionDto(".NET Core", "Backend", "Cross-platform high-performance framework by Microsoft"),
            new SkillSuggestionDto("Kotlin", "Backend", "Modern JVM and Android language with concise syntax"),
            new SkillSuggestionDto("PHP", "Backend", "Popular server-side scripting language for web development"),
            new SkillSuggestionDto("Ruby on Rails", "Backend", "Convention-over-configuration web application framework"),
            new SkillSuggestionDto("GraphQL", "Backend", "Query language and runtime for declarative APIs"),
            new SkillSuggestionDto("REST APIs", "Backend", "Representational State Transfer web architecture"),
            new SkillSuggestionDto("Microservices", "Backend", "Decoupled distributed service architecture pattern"),

            // Database
            new SkillSuggestionDto("MySQL", "Database", "Leading open-source relational SQL database"),
            new SkillSuggestionDto("PostgreSQL", "Database", "Advanced open-source relational object database"),
            new SkillSuggestionDto("MongoDB", "Database", "Document-oriented NoSQL database for flexible JSON schemas"),
            new SkillSuggestionDto("Redis", "Database", "In-memory key-value data structure store and cache"),
            new SkillSuggestionDto("SQLite", "Database", "Embedded serverless relational SQL database engine"),
            new SkillSuggestionDto("Elasticsearch", "Database", "Distributed RESTful search and analytics engine"),
            new SkillSuggestionDto("Supabase", "Database", "Open-source Firebase alternative powered by PostgreSQL"),
            new SkillSuggestionDto("Prisma", "Database", "Next-generation ORM for Node.js and TypeScript"),

            // Cloud / DevOps
            new SkillSuggestionDto("Docker", "Cloud / DevOps", "Platform for containerizing applications and microservices"),
            new SkillSuggestionDto("Kubernetes", "Cloud / DevOps", "Container orchestration system for automating deployment"),
            new SkillSuggestionDto("AWS", "Cloud / DevOps", "Amazon Web Services comprehensive cloud computing suite"),
            new SkillSuggestionDto("Google Cloud (GCP)", "Cloud / DevOps", "Google Cloud enterprise infrastructure and services"),
            new SkillSuggestionDto("Microsoft Azure", "Cloud / DevOps", "Cloud platform for building, deploying, and managing apps"),
            new SkillSuggestionDto("CI/CD", "Cloud / DevOps", "Continuous Integration and Continuous Delivery automation"),
            new SkillSuggestionDto("Git", "Cloud / DevOps", "Distributed version control system for tracking source code"),
            new SkillSuggestionDto("GitHub Actions", "Cloud / DevOps", "CI/CD and workflow automation directly in GitHub"),
            new SkillSuggestionDto("Terraform", "Cloud / DevOps", "Infrastructure as Code (IaC) tool by HashiCorp"),
            new SkillSuggestionDto("Linux", "Cloud / DevOps", "Open-source Unix-like operating system kernel"),
            new SkillSuggestionDto("Nginx", "Cloud / DevOps", "High-performance web server, reverse proxy, and load balancer"),

            // AI / ML
            new SkillSuggestionDto("Python", "AI / ML", "Premier versatile language for AI, data science, and web APIs"),
            new SkillSuggestionDto("Machine Learning", "AI / ML", "Algorithms and statistical models that learn from data"),
            new SkillSuggestionDto("Deep Learning", "AI / ML", "Multi-layered artificial neural network architectures"),
            new SkillSuggestionDto("PyTorch", "AI / ML", "Open source machine learning and deep learning framework"),
            new SkillSuggestionDto("TensorFlow", "AI / ML", "End-to-end open source platform for machine learning"),
            new SkillSuggestionDto("Scikit-Learn", "AI / ML", "Python machine learning library for data mining and analysis"),
            new SkillSuggestionDto("Pandas", "AI / ML", "Data manipulation and analysis library for Python"),
            new SkillSuggestionDto("NumPy", "AI / ML", "Fundamental scientific computing package for Python"),

            // Systems / Web3
            new SkillSuggestionDto("C", "Systems", "Foundational procedural systems programming language"),
            new SkillSuggestionDto("C++", "Systems", "High-performance compiled language with OOP and templates"),
            new SkillSuggestionDto("Blockchain", "Systems", "Decentralized immutable distributed ledger technology"),
            new SkillSuggestionDto("Solidity", "Systems", "Object-oriented language for writing Ethereum smart contracts"),
            new SkillSuggestionDto("Smart Contracts", "Systems", "Self-executing blockchain programs with verifiable rules"),
            new SkillSuggestionDto("Cryptography", "Systems", "Mathematical protocols for secure communications and hashing")
    );

    @Transactional(readOnly = true)
    public List<SkillSuggestionDto> getSkillSuggestions(String query) {
        String cleanQuery = (query != null) ? query.trim().toLowerCase() : "";

        if (cleanQuery.isEmpty()) {
            return PREDEFINED_SKILLS.stream().limit(12).collect(Collectors.toList());
        }

        // 1. Group predefined skills into prefix matches vs substring matches
        List<SkillSuggestionDto> prefixMatches = new ArrayList<>();
        List<SkillSuggestionDto> containsMatches = new ArrayList<>();
        Set<String> seenNames = new HashSet<>();

        for (SkillSuggestionDto skill : PREDEFINED_SKILLS) {
            String lowerName = skill.getName().toLowerCase();
            if (lowerName.startsWith(cleanQuery)) {
                prefixMatches.add(skill);
                seenNames.add(lowerName);
            } else if (lowerName.contains(cleanQuery)) {
                containsMatches.add(skill);
                seenNames.add(lowerName);
            }
        }

        // 2. Fetch any distinct custom skills from database
        try {
            List<String> dbSkills = skillRepository.findDistinctSkillNamesByQuery(cleanQuery);
            for (String dbSkillName : dbSkills) {
                if (dbSkillName == null || dbSkillName.isBlank()) continue;
                String lowerDb = dbSkillName.trim().toLowerCase();
                if (!seenNames.contains(lowerDb)) {
                    seenNames.add(lowerDb);
                    SkillSuggestionDto customDto = new SkillSuggestionDto(dbSkillName.trim(), "Other", "Community-registered skill");
                    if (lowerDb.startsWith(cleanQuery)) {
                        prefixMatches.add(customDto);
                    } else if (lowerDb.contains(cleanQuery)) {
                        containsMatches.add(customDto);
                    }
                }
            }
        } catch (Exception ignored) {
            // Fallback gracefully to predefined catalog
        }

        // Sort prefix matches alphabetically
        prefixMatches.sort((a, b) -> a.getName().compareToIgnoreCase(b.getName()));
        containsMatches.sort((a, b) -> a.getName().compareToIgnoreCase(b.getName()));

        // Combine: prefix matches first, then contains matches
        List<SkillSuggestionDto> results = new ArrayList<>(prefixMatches);
        results.addAll(containsMatches);

        return results.stream().limit(15).collect(Collectors.toList());
    }
}
