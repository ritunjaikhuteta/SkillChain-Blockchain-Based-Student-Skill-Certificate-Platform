package com.skillchain.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillchain.dto.TechStackDetectionDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class GitHubTechStackService {

    private static final Logger log = LoggerFactory.getLogger(GitHubTechStackService.class);

    private static final Pattern GITHUB_URL_PATTERN = Pattern.compile(
            "(?:https?://)?(?:www\\.)?github\\.com/([^/]+)/([^/?#]+)"
    );

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public GitHubTechStackService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .followRedirects(HttpClient.Redirect.NORMAL)
                .build();
    }

    public TechStackDetectionDto detectTechStack(String rawUrl) {
        if (rawUrl == null || rawUrl.isBlank()) {
            return new TechStackDetectionDto("", Collections.emptyList(), false, "", "GitHub URL is empty");
        }

        String repoCoordinates = extractRepoCoordinates(rawUrl);
        if (repoCoordinates == null) {
            return new TechStackDetectionDto("", Collections.emptyList(), false, "", "Invalid GitHub repository URL");
        }

        LinkedHashSet<String> technologies = new LinkedHashSet<>();

        try {
            // 1. Fetch Languages from GitHub API: /repos/{owner}/{repo}/languages
            fetchLanguages(repoCoordinates, technologies);

            // 2. Inspect root contents for manifest indicators (pom.xml, package.json, Dockerfile, etc.)
            fetchRootManifests(repoCoordinates, technologies);

        } catch (Exception e) {
            log.warn("GitHub API tech stack detection warning for {}: {}", repoCoordinates, e.getMessage());
        }

        if (technologies.isEmpty()) {
            return new TechStackDetectionDto(
                    "",
                    Collections.emptyList(),
                    false,
                    repoCoordinates,
                    "No language information could be retrieved from this repository (it may be private or empty)."
            );
        }

        List<String> techList = new ArrayList<>(technologies);
        String techStackFormatted = String.join(", ", techList);

        return new TechStackDetectionDto(
                techStackFormatted,
                techList,
                true,
                repoCoordinates,
                "Successfully detected " + techList.size() + " technologies from GitHub"
        );
    }

    private void fetchLanguages(String repoCoordinates, LinkedHashSet<String> technologies) {
        try {
            String url = "https://api.github.com/repos/" + repoCoordinates + "/languages";
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Accept", "application/vnd.github.v3+json")
                    .header("User-Agent", "SkillChain-App")
                    .timeout(Duration.ofSeconds(10))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                JsonNode root = objectMapper.readTree(response.body());
                Iterator<Map.Entry<String, JsonNode>> fields = root.fields();
                while (fields.hasNext()) {
                    Map.Entry<String, JsonNode> entry = fields.next();
                    String lang = entry.getKey();
                    if (isValidTech(lang)) {
                        technologies.add(mapCanonicalName(lang));
                    }
                }
                if (technologies.contains("Java")) {
                    technologies.add("Spring Boot");
                }
                if (technologies.contains("TypeScript") || technologies.contains("JavaScript")) {
                    technologies.add("React");
                    technologies.add("Next.js");
                }
            } else if (response.statusCode() == 403) {
                log.warn("GitHub API unauthenticated rate limit reached (HTTP 403) on backend for {}", repoCoordinates);
            }
        } catch (Exception e) {
            log.debug("Failed fetching languages for {}: {}", repoCoordinates, e.getMessage());
        }
    }

    private void fetchRootManifests(String repoCoordinates, LinkedHashSet<String> technologies) {
        try {
            String url = "https://api.github.com/repos/" + repoCoordinates + "/contents";
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Accept", "application/vnd.github.v3+json")
                    .header("User-Agent", "SkillChain-App")
                    .timeout(Duration.ofSeconds(4))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                JsonNode items = objectMapper.readTree(response.body());
                if (items.isArray()) {
                    Set<String> files = new HashSet<>();
                    for (JsonNode item : items) {
                        String name = item.path("name").asText("").toLowerCase();
                        files.add(name);
                    }

                    if (files.contains("pom.xml")) {
                        technologies.add("Java");
                        technologies.add("Spring Boot");
                    } else if (files.contains("build.gradle") || files.contains("build.gradle.kts")) {
                        technologies.add("Gradle");
                    }

                    if (files.contains("dockerfile") || files.contains("docker-compose.yml") || files.contains("docker-compose.yaml")) {
                        technologies.add("Docker");
                    }

                    if (files.contains("package.json")) {
                        technologies.add("Node.js");
                        // Fetch package.json content to detect popular frameworks
                        detectPackageJsonFrameworks(repoCoordinates, technologies);
                    }

                    if (files.contains("requirements.txt") || files.contains("pyproject.toml")) {
                        technologies.add("Python");
                    }

                    if (files.contains("cargo.toml")) {
                        technologies.add("Rust");
                    }

                    if (files.contains("go.mod")) {
                        technologies.add("Go / Golang");
                    }
                }
            }
        } catch (Exception e) {
            log.debug("Failed checking root manifests for {}: {}", repoCoordinates, e.getMessage());
        }
    }

    private void detectPackageJsonFrameworks(String repoCoordinates, LinkedHashSet<String> technologies) {
        try {
            String url = "https://raw.githubusercontent.com/" + repoCoordinates + "/main/package.json";
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("User-Agent", "SkillChain-App")
                    .timeout(Duration.ofSeconds(3))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200) {
                // Try 'master' branch fallback
                url = "https://raw.githubusercontent.com/" + repoCoordinates + "/master/package.json";
                request = HttpRequest.newBuilder().uri(URI.create(url)).header("User-Agent", "SkillChain-App").timeout(Duration.ofSeconds(3)).GET().build();
                response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            }

            if (response.statusCode() == 200) {
                String body = response.body().toLowerCase();
                if (body.contains("\"next\"")) technologies.add("Next.js");
                if (body.contains("\"react\"")) technologies.add("React");
                if (body.contains("\"typescript\"")) technologies.add("TypeScript");
                if (body.contains("\"tailwindcss\"")) technologies.add("Tailwind CSS");
                if (body.contains("\"express\"")) technologies.add("Express.js");
                if (body.contains("\"vue\"")) technologies.add("Vue.js");
                if (body.contains("\"prisma\"")) technologies.add("Prisma");
            }
        } catch (Exception ignored) {}
    }

    private String extractRepoCoordinates(String rawUrl) {
        if (rawUrl == null) return null;
        String cleaned = rawUrl.trim().replaceAll("[?#].*$", "").replaceAll("/+$", "");
        Matcher matcher = GITHUB_URL_PATTERN.matcher(cleaned);
        if (matcher.find()) {
            String owner = matcher.group(1);
            String repo = matcher.group(2);
            if (repo.endsWith(".git")) {
                repo = repo.substring(0, repo.length() - 4);
            }
            return owner + "/" + repo;
        }
        return null;
    }

    private boolean isValidTech(String lang) {
        if (lang == null || lang.isBlank()) return false;
        String l = lang.toLowerCase();
        // Ignore binary or non-language formats if any
        return !l.equals("roff") && !l.equals("makefile") && !l.equals("batchfile");
    }

    private String mapCanonicalName(String lang) {
        if ("Go".equalsIgnoreCase(lang)) return "Go / Golang";
        if ("Dockerfile".equalsIgnoreCase(lang)) return "Docker";
        if ("Shell".equalsIgnoreCase(lang)) return "Bash";
        return lang;
    }
}
