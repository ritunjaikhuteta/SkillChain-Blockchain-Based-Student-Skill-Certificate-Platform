package com.skillchain.repository;

import com.skillchain.model.StudentProfile;
import com.skillchain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {

    Optional<StudentProfile> findByUser(User user);

    Optional<StudentProfile> findByUserId(Long userId);

    Optional<StudentProfile> findByUserEmail(String email);

    @Query("SELECT DISTINCT sp FROM StudentProfile sp " +
           "LEFT JOIN sp.skills s " +
           "WHERE (:query IS NULL OR :query = '' OR " +
           "LOWER(sp.user.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(sp.headline) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(sp.institution) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<StudentProfile> searchProfiles(@Param("query") String query);
}
