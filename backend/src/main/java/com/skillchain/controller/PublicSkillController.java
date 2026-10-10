package com.skillchain.controller;

import com.skillchain.dto.SkillSuggestionDto;
import com.skillchain.service.SkillService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class PublicSkillController {

    private final SkillService skillService;

    public PublicSkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @GetMapping("/suggest")
    public ResponseEntity<List<SkillSuggestionDto>> suggestSkills(
            @RequestParam(value = "q", defaultValue = "") String query
    ) {
        List<SkillSuggestionDto> suggestions = skillService.getSkillSuggestions(query);
        return ResponseEntity.ok(suggestions);
    }
}
