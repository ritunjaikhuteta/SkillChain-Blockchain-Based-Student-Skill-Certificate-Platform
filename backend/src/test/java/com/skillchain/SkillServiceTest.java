package com.skillchain;

import com.skillchain.dto.SkillRequest;
import com.skillchain.dto.SkillResponse;
import com.skillchain.model.Role;
import com.skillchain.model.Skill;
import com.skillchain.model.StudentProfile;
import com.skillchain.model.User;
import com.skillchain.repository.SkillRepository;
import com.skillchain.repository.UserRepository;
import com.skillchain.service.SkillService;
import com.skillchain.service.StudentProfileService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SkillServiceTest {

    @Mock
    private SkillRepository skillRepository;

    @Mock
    private StudentProfileService profileService;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SkillService skillService;

    private User sampleUser;
    private StudentProfile sampleProfile;

    @BeforeEach
    void setUp() {
        sampleUser = new User("Student John", "student@example.com", "pass", Role.STUDENT);
        sampleUser.setId(10L);
        sampleProfile = new StudentProfile(sampleUser);
        sampleProfile.setId(20L);
    }

    @Test
    void addSkill_Success() {
        SkillRequest req = new SkillRequest("Java", "Backend", "ADVANCED", 3);
        when(userRepository.findByEmail("student@example.com")).thenReturn(Optional.of(sampleUser));
        when(profileService.getOrCreateProfileForUser(sampleUser)).thenReturn(sampleProfile);

        Skill savedSkill = new Skill(sampleProfile, "Java", "Backend", "ADVANCED", 3);
        savedSkill.setId(100L);
        when(skillRepository.save(any(Skill.class))).thenReturn(savedSkill);

        SkillResponse resp = skillService.addSkill("student@example.com", req);

        assertNotNull(resp);
        assertEquals("Java", resp.getName());
        assertEquals("Backend", resp.getCategory());
        assertEquals("ADVANCED", resp.getProficiency());
        assertEquals(3, resp.getYearsOfExperience());
    }

    @Test
    void getMySkills_Success() {
        when(userRepository.findByEmail("student@example.com")).thenReturn(Optional.of(sampleUser));
        when(profileService.getOrCreateProfileForUser(sampleUser)).thenReturn(sampleProfile);

        Skill skill1 = new Skill(sampleProfile, "React", "Frontend", "INTERMEDIATE", 2);
        skill1.setId(101L);
        when(skillRepository.findByProfileId(20L)).thenReturn(List.of(skill1));

        List<SkillResponse> list = skillService.getMySkills("student@example.com");

        assertEquals(1, list.size());
        assertEquals("React", list.get(0).getName());
    }

    @Test
    void deleteSkill_Success() {
        when(userRepository.findByEmail("student@example.com")).thenReturn(Optional.of(sampleUser));
        when(profileService.getOrCreateProfileForUser(sampleUser)).thenReturn(sampleProfile);

        Skill skill = new Skill(sampleProfile, "Docker", "DevOps", "BEGINNER", 1);
        skill.setId(102L);
        when(skillRepository.findByIdAndProfileId(102L, 20L)).thenReturn(Optional.of(skill));

        skillService.deleteSkill("student@example.com", 102L);

        verify(skillRepository, times(1)).delete(skill);
    }
}
