package com.skillchain.service;

import com.skillchain.dto.StudentProfileRequest;
import com.skillchain.dto.StudentProfileResponse;
import com.skillchain.dto.StudentStatsDto;
import com.skillchain.exception.BadRequestException;
import com.skillchain.exception.ResourceNotFoundException;
import com.skillchain.model.Role;
import com.skillchain.model.StudentProfile;
import com.skillchain.model.User;
import com.skillchain.repository.CertificateRepository;
import com.skillchain.repository.ProjectRepository;
import com.skillchain.repository.SkillRepository;
import com.skillchain.repository.StudentProfileRepository;
import com.skillchain.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StudentProfileService {

    private final StudentProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final ProjectRepository projectRepository;
    private final CertificateRepository certificateRepository;
    private final FileStorageService fileStorageService;

    public StudentProfileService(
            StudentProfileRepository profileRepository,
            UserRepository userRepository,
            SkillRepository skillRepository,
            ProjectRepository projectRepository,
            CertificateRepository certificateRepository,
            FileStorageService fileStorageService
    ) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.projectRepository = projectRepository;
        this.certificateRepository = certificateRepository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional
    public StudentProfile getOrCreateProfileForUser(User user) {
        if (user.getRole() != Role.STUDENT && user.getRole() != Role.ADMIN) {
            throw new BadRequestException("Only students have a student profile");
        }
        return profileRepository.findByUser(user)
                .orElseGet(() -> {
                    StudentProfile newProfile = new StudentProfile(user);
                    return profileRepository.save(newProfile);
                });
    }

    @Transactional(readOnly = true)
    public StudentProfileResponse getProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        StudentProfile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user: " + email));
        return new StudentProfileResponse(profile);
    }

    @Transactional
    public StudentProfileResponse updateProfileByEmail(String email, StudentProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        StudentProfile profile = getOrCreateProfileForUser(user);

        if (request.getHeadline() != null) profile.setHeadline(request.getHeadline().trim());
        if (request.getBio() != null) profile.setBio(request.getBio().trim());
        if (request.getPhone() != null) profile.setPhone(request.getPhone().trim());
        if (request.getLocation() != null) profile.setLocation(request.getLocation().trim());
        if (request.getInstitution() != null) profile.setInstitution(request.getInstitution().trim());
        if (request.getDegree() != null) profile.setDegree(request.getDegree().trim());
        if (request.getGraduationYear() != null) profile.setGraduationYear(request.getGraduationYear().trim());
        if (request.getGithubUrl() != null) profile.setGithubUrl(request.getGithubUrl().trim());
        if (request.getLinkedinUrl() != null) profile.setLinkedinUrl(request.getLinkedinUrl().trim());
        if (request.getPortfolioUrl() != null) profile.setPortfolioUrl(request.getPortfolioUrl().trim());

        StudentProfile saved = profileRepository.save(profile);
        return new StudentProfileResponse(saved);
    }

    @Transactional(readOnly = true)
    public StudentStatsDto getStudentStatsByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        StudentProfile profile = getOrCreateProfileForUser(user);

        long skillsCount = skillRepository.countByProfileId(profile.getId());
        long projectsCount = projectRepository.countByProfileId(profile.getId());
        long certificatesCount = certificateRepository.countByProfileId(profile.getId());

        int completion = calculateCompletion(profile, skillsCount, projectsCount, certificatesCount);

        return new StudentStatsDto(skillsCount, projectsCount, certificatesCount, completion);
    }

    private int calculateCompletion(StudentProfile p, long skillsCount, long projectsCount, long certsCount) {
        int score = 0;
        if (p.getHeadline() != null && !p.getHeadline().isBlank()) score += 15;
        if (p.getBio() != null && !p.getBio().isBlank()) score += 15;
        if (p.getLocation() != null && !p.getLocation().isBlank()) score += 10;
        if (p.getInstitution() != null && !p.getInstitution().isBlank()) score += 10;
        if (p.getDegree() != null && !p.getDegree().isBlank()) score += 10;
        if (p.getGithubUrl() != null && !p.getGithubUrl().isBlank()) score += 10;
        if (skillsCount > 0) score += 15;
        if (projectsCount > 0) score += 10;
        if (certsCount > 0) score += 5;
        return Math.min(score, 100);
    }

    @Transactional
    public StudentProfileResponse uploadAvatar(String email, org.springframework.web.multipart.MultipartFile file) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        StudentProfile profile = getOrCreateProfileForUser(user);

        // Remove old avatar if exists
        if (profile.getAvatarKey() != null) {
            fileStorageService.deleteAvatarFile(profile.getAvatarKey());
        }

        FileStorageService.StoredFileMeta meta = fileStorageService.storeAvatarImage(file);
        profile.setAvatarKey(meta.getFileKey());
        profile.setAvatarUrl("/api/files/avatars/" + user.getId());

        StudentProfile saved = profileRepository.save(profile);
        return new StudentProfileResponse(saved);
    }

    @Transactional(readOnly = true)
    public org.springframework.core.io.Resource getAvatarResourceByUserId(Long userId) {
        StudentProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user ID: " + userId));

        if (profile.getAvatarKey() == null) {
            throw new ResourceNotFoundException("Avatar not configured for this user");
        }
        return fileStorageService.loadAvatarAsResource(profile.getAvatarKey());
    }
}
