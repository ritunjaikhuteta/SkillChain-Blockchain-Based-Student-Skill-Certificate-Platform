package com.skillchain.controller;

import com.skillchain.dto.StudentProfileResponse;
import com.skillchain.service.RecruiterService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recruiter")
public class RecruiterController {

    private final RecruiterService recruiterService;
    private final com.skillchain.service.GraphService graphService;

    public RecruiterController(RecruiterService recruiterService, com.skillchain.service.GraphService graphService) {
        this.recruiterService = recruiterService;
        this.graphService = graphService;
    }

    @GetMapping("/students")
    public ResponseEntity<List<StudentProfileResponse>> searchStudents(@RequestParam(value = "query", required = false) String query) {
        List<StudentProfileResponse> students = recruiterService.searchStudents(query);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/students/{profileId}")
    public ResponseEntity<StudentProfileResponse> getStudentProfile(@PathVariable Long profileId) {
        StudentProfileResponse profile = recruiterService.getStudentProfile(profileId);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/candidates/ranked")
    public ResponseEntity<List<com.skillchain.dto.CandidateRankDto>> getRankedCandidates(
            @RequestParam(value = "skills", defaultValue = "") List<String> skills,
            @RequestParam(value = "limit", defaultValue = "20") int limit
    ) {
        List<com.skillchain.dto.CandidateRankDto> ranked = graphService.rankCandidatesForSkills(skills);
        if (limit > 0 && ranked.size() > limit) {
            ranked = ranked.subList(0, limit);
        }
        return ResponseEntity.ok(ranked);
    }
}
