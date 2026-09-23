package com.smsytem.students.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.smsytem.students.security.CustomUserDetailsService;
import com.smsytem.students.security.JwtAuthenticationEntryPoint;
import com.smsytem.students.security.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SpringSecurityConfig extends WebSecurityConfigurerAdapter {

    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthenticationEntryPoint authenticationEntryPoint;
    private final JwtAuthenticationFilter authenticationFilter;

    public SpringSecurityConfig(
            CustomUserDetailsService userDetailsService,
            JwtAuthenticationEntryPoint authenticationEntryPoint,
            JwtAuthenticationFilter authenticationFilter) {

        this.userDetailsService = userDetailsService;
        this.authenticationEntryPoint = authenticationEntryPoint;
        this.authenticationFilter = authenticationFilter;
    }

    // =========================================================
    // PASSWORD ENCODER
    // =========================================================

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // =========================================================
    // CORS CONFIGURATION
    // =========================================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        /*
         * Frontend thường chạy ở:
         * React/Vite:  http://localhost:5173
         * React CRA:   http://localhost:3000
         *
         * Nếu frontend của bạn chạy port khác thì thêm vào đây.
         */
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",
                "http://localhost:5173"
        ));

        configuration.setAllowedMethods(Arrays.asList(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "PATCH",
                "OPTIONS"
        ));

        configuration.setAllowedHeaders(Arrays.asList("*"));

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    // =========================================================
    // SPRING SECURITY CONFIGURATION
    // =========================================================

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http
                // Enable CORS
                .cors()
                .and()

                // Disable CSRF because this is a REST API using JWT
                .csrf()
                .disable()

                // Exception handling
                .exceptionHandling()
                .authenticationEntryPoint(authenticationEntryPoint)
                .and()

                // Stateless session because authentication uses JWT
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()

                // Authorization rules
                .authorizeRequests()

                // =================================================
                // CORS PREFLIGHT
                // =================================================

                /*
                 * Browser sends OPTIONS before many GET/POST/PUT/DELETE
                 * requests when CORS is involved.
                 *
                 * OPTIONS must NOT require JWT.
                 */
                .antMatchers(HttpMethod.OPTIONS, "/**")
                .permitAll()

                // =================================================
                // PUBLIC AUTH ENDPOINTS
                // =================================================

                .antMatchers("/api/auth/**")
                .permitAll()

                // =================================================
                // SWAGGER
                // =================================================

                .antMatchers(
                        "/swagger-ui/**",
                        "/swagger-ui.html",
                        "/swagger-resources/**",
                        "/v2/api-docs",
                        "/v3/api-docs/**",
                        "/webjars/**",
                        "/configuration/ui",
                        "/configuration/security"
                )
                .permitAll()

                // =================================================
                // STUDENTS - ADMIN
                // =================================================

                .antMatchers(
                        HttpMethod.POST,
                        "/api/students"
                )
                .hasRole("ADMIN")

                .antMatchers(
                        HttpMethod.PUT,
                        "/api/students/**"
                )
                .hasRole("ADMIN")

                .antMatchers(
                        HttpMethod.DELETE,
                        "/api/students/**"
                )
                .hasRole("ADMIN")

                // =================================================
                // TEACHERS - ADMIN
                // =================================================

                .antMatchers(
                        HttpMethod.POST,
                        "/api/teachers"
                )
                .hasRole("ADMIN")

                .antMatchers(
                        HttpMethod.PUT,
                        "/api/teachers/**"
                )
                .hasRole("ADMIN")

                .antMatchers(
                        HttpMethod.DELETE,
                        "/api/teachers/**"
                )
                .hasRole("ADMIN")

                // =================================================
                // CLASSES - ADMIN
                // =================================================

                .antMatchers(
                        HttpMethod.POST,
                        "/api/classes"
                )
                .hasRole("ADMIN")

                .antMatchers(
                        HttpMethod.PUT,
                        "/api/classes/**"
                )
                .hasRole("ADMIN")

                .antMatchers(
                        HttpMethod.DELETE,
                        "/api/classes/**"
                )
                .hasRole("ADMIN")

                // =================================================
                // SUBJECTS - ADMIN
                // =================================================

                .antMatchers(
                        HttpMethod.POST,
                        "/api/subjects"
                )
                .hasRole("ADMIN")

                .antMatchers(
                        HttpMethod.PUT,
                        "/api/subjects/**"
                )
                .hasRole("ADMIN")

                .antMatchers(
                        HttpMethod.DELETE,
                        "/api/subjects/**"
                )
                .hasRole("ADMIN")

                // =================================================
                // ATTENDANCE
                // ADMIN + TEACHER
                // =================================================

                .antMatchers(
                        HttpMethod.POST,
                        "/api/attendance",
                        "/api/attendance/**"
                )
                .hasAnyRole("ADMIN", "TEACHER")

                .antMatchers(
                        HttpMethod.PUT,
                        "/api/attendance/**"
                )
                .hasAnyRole("ADMIN", "TEACHER")

                .antMatchers(
                        HttpMethod.DELETE,
                        "/api/attendance/**"
                )
                .hasAnyRole("ADMIN", "TEACHER")

                // =================================================
                // EXAMS
                // ADMIN + TEACHER
                // =================================================

                .antMatchers(
                        HttpMethod.POST,
                        "/api/exams"
                )
                .hasAnyRole("ADMIN", "TEACHER")

                .antMatchers(
                        HttpMethod.PUT,
                        "/api/exams/**"
                )
                .hasAnyRole("ADMIN", "TEACHER")

                .antMatchers(
                        HttpMethod.DELETE,
                        "/api/exams/**"
                )
                .hasAnyRole("ADMIN", "TEACHER")

                // =================================================
                // EXAM RESULTS
                // ADMIN + TEACHER
                // =================================================

                .antMatchers(
                        HttpMethod.POST,
                        "/api/exam-results"
                )
                .hasAnyRole("ADMIN", "TEACHER")

                .antMatchers(
                        HttpMethod.PUT,
                        "/api/exam-results/**"
                )
                .hasAnyRole("ADMIN", "TEACHER")

                .antMatchers(
                        HttpMethod.DELETE,
                        "/api/exam-results/**"
                )
                .hasAnyRole("ADMIN", "TEACHER")

                // =================================================
                // FEES
                // ADMIN + ACCOUNTANT
                // =================================================

                .antMatchers(
                        HttpMethod.POST,
                        "/api/fees"
                )
                .hasAnyRole("ADMIN", "ACCOUNTANT")

                .antMatchers(
                        HttpMethod.PUT,
                        "/api/fees/**"
                )
                .hasAnyRole("ADMIN", "ACCOUNTANT")

                .antMatchers(
                        HttpMethod.DELETE,
                        "/api/fees/**"
                )
                .hasAnyRole("ADMIN", "ACCOUNTANT")

                // =================================================
                // NOTIFICATIONS
                // ADMIN + TEACHER
                // =================================================

                .antMatchers(
                        HttpMethod.POST,
                        "/api/notifications"
                )
                .hasAnyRole("ADMIN", "TEACHER")

                .antMatchers(
                        HttpMethod.PUT,
                        "/api/notifications/**"
                )
                .hasAnyRole("ADMIN", "TEACHER")

                .antMatchers(
                        HttpMethod.DELETE,
                        "/api/notifications/**"
                )
                .hasAnyRole("ADMIN", "TEACHER")

                // =================================================
                // TIMETABLE
                // ADMIN + TEACHER
                // =================================================

                .antMatchers(
                        HttpMethod.POST,
                        "/api/timetable"
                )
                .hasAnyRole("ADMIN", "TEACHER")

                .antMatchers(
                        HttpMethod.PUT,
                        "/api/timetable/**"
                )
                .hasAnyRole("ADMIN", "TEACHER")

                .antMatchers(
                        HttpMethod.DELETE,
                        "/api/timetable/**"
                )
                .hasAnyRole("ADMIN", "TEACHER")

                // =================================================
                // PARENT - ADMIN
                // =================================================

                .antMatchers(
                        HttpMethod.POST,
                        "/api/parent"
                )
                .hasRole("ADMIN")

                .antMatchers(
                        HttpMethod.PUT,
                        "/api/parent/**"
                )
                .hasRole("ADMIN")

                .antMatchers(
                        HttpMethod.DELETE,
                        "/api/parent/**"
                )
                .hasRole("ADMIN")

                // =================================================
                // ALL OTHER REQUESTS
                // =================================================

                .anyRequest()
                .authenticated();

        // =====================================================
        // JWT FILTER
        // =====================================================

        http.addFilterBefore(
                authenticationFilter,
                UsernamePasswordAuthenticationFilter.class
        );
    }

    // =========================================================
    // AUTHENTICATION MANAGER
    // =========================================================

    @Override
    protected void configure(
            AuthenticationManagerBuilder auth) throws Exception {

        auth
                .userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder());
    }

    // =========================================================
    // AUTHENTICATION MANAGER BEAN
    // =========================================================

    @Override
    @Bean
    public AuthenticationManager authenticationManagerBean()
            throws Exception {

        return super.authenticationManagerBean();
    }
}