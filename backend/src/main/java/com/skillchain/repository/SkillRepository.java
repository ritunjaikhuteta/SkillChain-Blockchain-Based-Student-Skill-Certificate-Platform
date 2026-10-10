package com.skillchain.repository;

import com.skillchain.model.Skill;
import com.skillchain.model.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {

    List<Skill> findByProfile(StudentProfile profile);

    List<Skill> findByProfileId(Long profileId);

    Optional<Skill> findByIdAndProfileId(Long id, Long profileId);

    long countByProfileId(Long profileId);
}
