package com.skillchain.service;

import com.skillchain.dto.AdminStatsDto;
import com.skillchain.dto.UserSummaryDto;
import com.skillchain.exception.ResourceNotFoundException;
import com.skillchain.model.Role;
import com.skillchain.model.User;
import com.skillchain.repository.CertificateRepository;
import com.skillchain.repository.ProjectRepository;
import com.skillchain.repository.SkillRepository;
import com.skillchain.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final ProjectRepository projectRepository;
    private final CertificateRepository certificateRepository;

    public AdminService(
            UserRepository userRepository,
            SkillRepository skillRepository,
            ProjectRepository projectRepository,
            CertificateRepository certificateRepository
    ) {
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.projectRepository = projectRepository;
        this.certificateRepository = certificateRepository;
    }

    @Transactional(readOnly = true)
    public AdminStatsDto getPlatformStats() {
        long totalUsers = userRepository.count();
        long totalStudents = userRepository.countByRole(Role.STUDENT);
        long totalRecruiters = userRepository.countByRole(Role.RECRUITER);
        long totalAdmins = userRepository.countByRole(Role.ADMIN);
        long totalSkills = skillRepository.count();
        long totalProjects = projectRepository.count();
        long totalCertificates = certificateRepository.count();

        return new AdminStatsDto(
                totalUsers,
                totalStudents,
                totalRecruiters,
                totalAdmins,
                totalSkills,
                totalProjects,
                totalCertificates
        );
    }

    @Transactional(readOnly = true)
    public List<UserSummaryDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserSummaryDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserSummaryDto toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setEnabled(!user.isEnabled());
        User saved = userRepository.save(user);
        return new UserSummaryDto(saved);
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        userRepository.delete(user);
    }
}
