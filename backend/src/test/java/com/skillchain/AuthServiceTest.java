package com.skillchain;

import com.skillchain.dto.AuthRequest;
import com.skillchain.dto.AuthResponse;
import com.skillchain.dto.RegisterRequest;
import com.skillchain.exception.BadRequestException;
import com.skillchain.model.Role;
import com.skillchain.model.User;
import com.skillchain.repository.StudentProfileRepository;
import com.skillchain.repository.UserRepository;
import com.skillchain.security.JwtService;
import com.skillchain.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private StudentProfileRepository studentProfileRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User("Alice Walker", "alice@example.com", "encoded-pass", Role.STUDENT);
        sampleUser.setId(1L);
    }

    @Test
    void register_SuccessfulStudentRegistration() {
        RegisterRequest req = new RegisterRequest("Alice Walker", "alice@example.com", "Secret@123", Role.STUDENT);
        when(userRepository.existsByEmail("alice@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Secret@123")).thenReturn("encoded-pass");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(jwtService.generateToken(any(), any(User.class))).thenReturn("fake-jwt-token");

        AuthResponse resp = authService.register(req);

        assertNotNull(resp);
        assertEquals("fake-jwt-token", resp.getToken());
        assertEquals("alice@example.com", resp.getEmail());
        assertEquals(Role.STUDENT, resp.getRole());
        verify(studentProfileRepository, times(1)).save(any());
    }

    @Test
    void register_ThrowsBadRequestWhenEmailAlreadyExists() {
        RegisterRequest req = new RegisterRequest("Bob Jones", "bob@example.com", "Secret@123", Role.STUDENT);
        when(userRepository.existsByEmail("bob@example.com")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(req));
        verify(userRepository, never()).save(any());
    }

    @Test
    void login_SuccessfulLogin() {
        AuthRequest req = new AuthRequest("alice@example.com", "Secret@123");
        when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.of(sampleUser));
        when(jwtService.generateToken(any(), any(User.class))).thenReturn("jwt-token-xyz");

        AuthResponse resp = authService.login(req);

        assertNotNull(resp);
        assertEquals("jwt-token-xyz", resp.getToken());
        assertEquals("alice@example.com", resp.getEmail());
    }
}
