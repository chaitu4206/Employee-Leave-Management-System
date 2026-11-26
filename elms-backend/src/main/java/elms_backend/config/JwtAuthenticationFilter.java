
package elms_backend.config;

import elms_backend.entity.AppUser;
import elms_backend.repository.UserRepository;
import elms_backend.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = header.substring(7);
            String email = jwtService.extractEmail(token);

            if (SecurityContextHolder.getContext().getAuthentication() == null) {

                AppUser appUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
                System.out.println("JWT USER FOUND: " + appUser.getEmail());
                System.out.println("JWT USER ROLE: " + appUser.getRole());

                String authority = "ROLE_" + appUser.getRole().name();

                var userDetails = User.withUsername(appUser.getEmail())
                    .password("")
                    .authorities(authority)
                    .build();

                var authentication =
                    new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                    );

                authentication.setDetails(
                    new WebAuthenticationDetailsSource()
                        .buildDetails(request)
                );

                SecurityContextHolder.getContext()
                    .setAuthentication(authentication);
                System.out.println("AUTHENTICATION SET SUCCESSFULLY");
            }

        } catch (Exception ex) {
            ex.printStackTrace();
            SecurityContextHolder.clearContext();
            response.sendError(
                HttpServletResponse.SC_UNAUTHORIZED,
                "Invalid or expired token"
            );
            return;
        }

        filterChain.doFilter(request, response);
    }
}
