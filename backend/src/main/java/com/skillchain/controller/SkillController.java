package com.skillchain.controller;

import com.skillchain.dto.SkillRequest;
import com.skillchain.dto.SkillResponse;
import com.skillchain.service.SkillService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/skills")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @GetMapping
    public ResponseEntity<List<SkillResponse>> getMySkills(@AuthenticationPrincipal UserDetails userDetails) {
        List<SkillResponse> skills = skillService.getMySkills(userDetails.getUsername());
        return ResponseEntity.ok(skills);
    }

    @GetMapping("/suggest")
    public ResponseEntity<List<com.skillchain.dto.SkillSuggestionDto>> suggestSkills(
            @RequestParam(value = "q", defaultValue = "") String query
    ) {
        return ResponseEntity.ok(skillService.getSkillSuggestions(query));
    }

    @PostMapping
    public ResponseEntity<SkillResponse> addSkill(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody SkillRequest request
    ) {
        SkillResponse created = skillService.addSkill(userDetails.getUsername(), request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SkillResponse> updateSkill(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody SkillRequest request
    ) {
        SkillResponse updated = skillService.updateSkill(userDetails.getUsername(), id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSkill(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        skillService.deleteSkill(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
