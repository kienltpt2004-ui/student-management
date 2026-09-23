package com.smsytem.students.security;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private JwtTokenProvider jwtTokenProvider;
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getServletPath();

        // =====================================================
        // 1. BỎ QUA CORS PREFLIGHT REQUEST
        // =====================================================
        /*
         * Browser thường gửi OPTIONS trước các request
         * GET / POST / PUT / DELETE khi sử dụng CORS.
         *
         * OPTIONS không cần JWT.
         */
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        // =====================================================
        // 2. BỎ QUA JWT CHO LOGIN / REGISTER
        // =====================================================

        if (path.equals("/api/auth/login")
                || path.equals("/api/auth/register")) {

            filterChain.doFilter(request, response);
            return;
        }

        // =====================================================
        // 3. LẤY JWT TOKEN TỪ REQUEST
        // =====================================================

        String token = getTokenFromRequest(request);

        // =====================================================
        // 4. VALIDATE JWT
        // =====================================================

        if (StringUtils.isNotBlank(token)
                && jwtTokenProvider.validateToken(token)) {

            // Lấy username từ JWT
            String username = jwtTokenProvider.getUsername(token);

            // Load user từ database
            UserDetails userDetails =
                    userDetailsService.loadUserByUsername(username);
            System.out.println(
                    "USER: " + username +
                            " | AUTHORITIES: " + userDetails.getAuthorities()
            );

            // Tạo Authentication
            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

            authenticationToken.setDetails(
                    new WebAuthenticationDetailsSource()
                            .buildDetails(request)
            );

            // Set Authentication vào SecurityContext
            SecurityContextHolder
                    .getContext()
                    .setAuthentication(authenticationToken);
        }

        // =====================================================
        // 5. TIẾP TỤC REQUEST
        // =====================================================

        filterChain.doFilter(request, response);
    }

    // =========================================================
    // GET JWT TOKEN FROM REQUEST
    // =========================================================

    private String getTokenFromRequest(HttpServletRequest request) {

        String bearerToken = request.getHeader("Authorization");

        if (StringUtils.isNotBlank(bearerToken)
                && bearerToken.startsWith("Bearer ")) {

            return bearerToken.substring(7);
        }

        return null;
    }
}