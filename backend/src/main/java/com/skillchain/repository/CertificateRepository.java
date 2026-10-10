package com.skillchain.repository;

import com.skillchain.model.Certificate;
import com.skillchain.model.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {

    List<Certificate> findByProfile(StudentProfile profile);

    List<Certificate> findByProfileId(Long profileId);

    Optional<Certificate> findByIdAndProfileId(Long id, Long profileId);

    long countByProfileId(Long profileId);
}
