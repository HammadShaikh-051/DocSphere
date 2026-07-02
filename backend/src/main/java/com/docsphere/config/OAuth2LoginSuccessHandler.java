package com.docsphere.config;

import com.docsphere.jwt.JwtUtil;
import com.docsphere.jwt.RefreshToken;
import com.docsphere.jwt.RefreshTokenRepository;
import com.docsphere.user.User;
import com.docsphere.user.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtUtil jwtUtil;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> createNewOAuthUser(email, name));

        String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getEmail());

        RefreshToken refreshToken = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .user(user)
                .expiresAt(LocalDateTime.now().plusDays(7))
                .build();

        refreshTokenRepository.save(refreshToken);

        String redirectUrl = frontendUrl + "/oauth2/callback"
                + "?accessToken=" + accessToken
                + "&refreshToken=" + refreshToken.getToken();

        response.sendRedirect(redirectUrl);
    }

    private User createNewOAuthUser(String email, String name) {
        User newUser = User.builder()
                .name(name != null ? name : "Google User")
                .email(email)
                .password(null)
                .emailVerified(true)
                .authProvider("GOOGLE")
                .build();

        return userRepository.save(newUser);
    }
}
