package com.skillchain.service;

import com.skillchain.dto.SkillRequest;
import com.skillchain.dto.SkillResponse;
import com.skillchain.exception.ResourceNotFoundException;
import com.skillchain.model.Skill;
import com.skillchain.model.StudentProfile;
import com.skillchain.model.User;
import com.skillchain.repository.SkillRepository;
import com.skillchain.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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
}
