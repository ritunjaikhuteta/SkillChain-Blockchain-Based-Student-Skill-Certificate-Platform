package com.skillchain.service;

import com.skillchain.dto.StudentProfileResponse;
import com.skillchain.exception.ResourceNotFoundException;
import com.skillchain.model.Role;
import com.skillchain.model.StudentProfile;
import com.skillchain.repository.StudentProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecruiterService {

    private final StudentProfileRepository profileRepository;

    public RecruiterService(StudentProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @Transactional(readOnly = true)
    public List<StudentProfileResponse> searchStudents(String query) {
        List<StudentProfile> profiles;
        if (query == null || query.trim().isEmpty()) {
            profiles = profileRepository.findAll();
        } else {
            profiles = profileRepository.searchProfiles(query.trim());
        }

        return profiles.stream()
                .filter(p -> p.getUser() != null && p.getUser().getRole() == Role.STUDENT && p.getUser().isEnabled())
                .map(StudentProfileResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StudentProfileResponse getStudentProfile(Long profileId) {
        StudentProfile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found with id: " + profileId));
        return new StudentProfileResponse(profile);
    }
}
