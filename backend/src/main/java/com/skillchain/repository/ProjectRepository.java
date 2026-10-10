package com.skillchain.repository;

import com.skillchain.model.Project;
import com.skillchain.model.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByProfile(StudentProfile profile);

    List<Project> findByProfileId(Long profileId);

    Optional<Project> findByIdAndProfileId(Long id, Long profileId);

    long countByProfileId(Long profileId);
}
