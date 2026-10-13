package com.skillchain;

import com.skillchain.model.Role;
import com.skillchain.model.User;
import com.skillchain.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.skillchain.model.StudentProfile;
import com.skillchain.repository.StudentProfileRepository;

import java.util.Optional;

@SpringBootApplication
public class SkillChainApplication {

    private static final Logger log = LoggerFactory.getLogger(SkillChainApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(SkillChainApplication.class, args);
    }

    @Bean
    public CommandLineRunner initDemoUsers(
            UserRepository userRepository,
            StudentProfileRepository studentProfileRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.email:admin@skillchain.com}") String adminEmail,
            @Value("${app.admin.password:Admin@SkillChain123}") String adminPassword) {
        return args -> {
            // 1. Admin Provisioning
            String cleanAdminEmail = (adminEmail == null || adminEmail.isBlank()) ? "admin@skillchain.com" : adminEmail.trim().toLowerCase();
            String cleanAdminPassword = (adminPassword == null || adminPassword.isBlank()) ? "Admin@SkillChain123" : adminPassword;
            Optional<User> existingAdmin = userRepository.findByEmail(cleanAdminEmail);
            if (existingAdmin.isEmpty()) {
                User admin = new User("Platform Administrator", cleanAdminEmail, passwordEncoder.encode(cleanAdminPassword), Role.ADMIN);
                admin.setEnabled(true);
                userRepository.save(admin);
                log.info("Provisioned platform administrator account for: {}", cleanAdminEmail);
            }

            // 2. Demo Student Provisioning
            String studentEmail = "student@skillchain.edu";
            if (userRepository.findByEmail(studentEmail).isEmpty()) {
                User student = new User("Alex Chen", studentEmail, passwordEncoder.encode("Password@123"), Role.STUDENT);
                student.setEnabled(true);
                User savedStudent = userRepository.save(student);

                StudentProfile profile = new StudentProfile(savedStudent);
                profile.setHeadline("Full Stack Engineer & Blockchain Researcher");
                profile.setInstitution("Massachusetts Institute of Technology");
                profile.setDegree("B.S. Computer Science");
                profile.setGraduationYear("2025");
                profile.setBio("Passionate about distributed systems, microservices, and cryptographic credential ledgers.");
                studentProfileRepository.save(profile);
                log.info("Provisioned demo student account for: {}", studentEmail);
            }

            // 3. Demo Recruiter Provisioning
            String recruiterEmail = "recruiter@skillchain.com";
            if (userRepository.findByEmail(recruiterEmail).isEmpty()) {
                User recruiter = new User("Sarah Connor", recruiterEmail, passwordEncoder.encode("Password@123"), Role.RECRUITER);
                recruiter.setEnabled(true);
                userRepository.save(recruiter);
                log.info("Provisioned demo recruiter account for: {}", recruiterEmail);
            }
        };
    }
}
