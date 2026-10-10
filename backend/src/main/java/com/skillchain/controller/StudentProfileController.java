package com.skillchain.controller;

import com.skillchain.dto.StudentProfileRequest;
import com.skillchain.dto.StudentProfileResponse;
import com.skillchain.dto.StudentStatsDto;
import com.skillchain.service.StudentProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student")
public class StudentProfileController {

    private final StudentProfileService profileService;

    public StudentProfileController(StudentProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/profile")
    public ResponseEntity<StudentProfileResponse> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        StudentProfileResponse response = profileService.getProfileByEmail(userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<StudentProfileResponse> updateMyProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody StudentProfileRequest request
    ) {
        StudentProfileResponse response = profileService.updateProfileByEmail(userDetails.getUsername(), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    public ResponseEntity<StudentStatsDto> getMyStats(@AuthenticationPrincipal UserDetails userDetails) {
        StudentStatsDto stats = profileService.getStudentStatsByEmail(userDetails.getUsername());
        return ResponseEntity.ok(stats);
    }

    @PostMapping(value = "/profile/avatar", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<StudentProfileResponse> uploadAvatar(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file
    ) {
        StudentProfileResponse response = profileService.uploadAvatar(userDetails.getUsername(), file);
        return ResponseEntity.ok(response);
    }
}
