
package elms_backend.service;

import elms_backend.dto.RegisterRequest;
import elms_backend.dto.LoginRequest;
import elms_backend.dto.AuthResponse;
import elms_backend.entity.AppUser;
import elms_backend.entity.Role;
import elms_backend.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final LeaveBalanceService leaveBalanceService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            LeaveBalanceService leaveBalanceService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.leaveBalanceService = leaveBalanceService;
    }

    // Register new employee
    @Transactional
    public String register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        AppUser user = new AppUser();
        user.setName(request.getName());
        user.setEmail(request.getEmail());

        user.setPassword(
            passwordEncoder.encode(request.getPassword())
        );

        user.setRole(Role.EMPLOYEE);

        userRepository.save(user);

        // Automatically allocate default leave balances
        leaveBalanceService.createDefaultBalances(user.getEmail());

        return "Registration successful";
    }

    // Login user
    public AuthResponse login(LoginRequest request) {

        AppUser user = userRepository
            .findByEmail(request.getEmail())
            .orElseThrow(() ->
                new RuntimeException("Invalid email or password")
            );

        if (!passwordEncoder.matches(
                request.getPassword(), user.getPassword())) {

            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtService.generateToken(user);

        return new AuthResponse(
            token,
            user.getName(),
            user.getEmail(),
            user.getRole().name()
        );
    }
}
