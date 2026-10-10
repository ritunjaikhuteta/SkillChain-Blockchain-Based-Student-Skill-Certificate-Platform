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

import java.util.Optional;

@SpringBootApplication
public class SkillChainApplication {

    private static final Logger log = LoggerFactory.getLogger(SkillChainApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(SkillChainApplication.class, args);
    }

    @Bean
    public CommandLineRunner initDefaultAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.email:}") String adminEmail,
            @Value("${app.admin.password:}") String adminPassword) {
        return args -> {
            if (adminEmail == null || adminEmail.isBlank() || adminPassword == null || adminPassword.isBlank()) {
                log.info("Administrator auto-provisioning skipped: ADMIN_EMAIL and ADMIN_PASSWORD environment variables not configured.");
                return;
            }

            String cleanEmail = adminEmail.trim().toLowerCase();
            Optional<User> existing = userRepository.findByEmail(cleanEmail);
            if (existing.isEmpty()) {
                User admin = new User();
                admin.setFullName("Platform Administrator");
                admin.setEmail(cleanEmail);
                admin.setPassword(passwordEncoder.encode(adminPassword));
                admin.setRole(Role.ADMIN);
                admin.setEnabled(true);
                userRepository.save(admin);
                log.info("Provisioned platform administrator account for: {}", cleanEmail);
            } else {
                User admin = existing.get();
                if (admin.getRole() == Role.ADMIN) {
                    admin.setPassword(passwordEncoder.encode(adminPassword));
                    userRepository.save(admin);
                    log.info("Updated credentials for administrator account: {}", cleanEmail);
                }
            }
        };
    }
}
