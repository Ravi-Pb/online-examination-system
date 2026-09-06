package com.example.oes.config;

import com.example.oes.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

                // =========================
                // CORS
                // =========================

                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )

                // Disable CSRF because this is a stateless REST API
                .csrf(csrf -> csrf.disable())

                // JWT-based authentication
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // Allow browser CORS preflight requests
                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()


                        // =========================
                        // AUTHENTICATION
                        // =========================

                        .requestMatchers(
                                "/api/auth/**"
                        ).permitAll()


                        // =========================
                        // EXAMS
                        // =========================

                        // Create exam
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/exams"
                        ).hasRole("TEACHER")

                        // View exams
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/exams/**"
                        ).hasAnyRole(
                                "TEACHER",
                                "STUDENT"
                        )

                        // Delete exam
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/exams/**"
                        ).hasRole("TEACHER")

                        // Publish exam
                        .requestMatchers(
                                HttpMethod.PATCH,
                                "/api/exams/*/publish"
                        ).hasRole("TEACHER")


                        // =========================
                        // QUESTIONS
                        // =========================

                        // Create question
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/exams/*/questions"
                        ).hasRole("TEACHER")



                        // View questions of an exam
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/exams/*/questions"
                        ).hasAnyRole(
                                "TEACHER",
                                "STUDENT"
                        )

                        // View individual question
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/questions/**"
                        ).hasAnyRole(
                                "TEACHER",
                                "STUDENT"
                        )

                        // Update question
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/questions/**"
                        ).hasRole("TEACHER")

                        // Delete question
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/questions/**"
                        ).hasRole("TEACHER")


                        // =========================
                        // STUDENT EXAM ATTEMPT
                        // =========================

                        // Start exam
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/exams/*/start"
                        ).hasRole("STUDENT")

                        // Active attempt
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/exams/*/active-attempt"
                        ).hasRole("STUDENT")

                        // Get questions for current attempt
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/attempts/*/questions"
                        ).hasRole("STUDENT")

                        // Save answer
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/attempts/*/answers"
                        ).hasRole("STUDENT")

                        // Submit exam
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/attempts/*/submit"
                        ).hasRole("STUDENT")


                        // =========================
                        // STUDENT RESULTS
                        // =========================

                        // Student's own attempt history
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/attempts/my"
                        ).hasRole("STUDENT")

                        // Result
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/attempts/*/result"
                        ).hasRole("STUDENT")

                        // Detailed answer review
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/attempts/*/review"
                        ).hasRole("STUDENT")


                        // =========================
                        // ATTEMPTS
                        // =========================

                        // General attempt access
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/attempts/**"
                        ).hasAnyRole(
                                "STUDENT",
                                "TEACHER"
                        )

                                // =========================
// USERS / PROFILES
// =========================

// Teacher's own profile
                                .requestMatchers(
                                        HttpMethod.GET,
                                        "/api/users/teacher/me"
                                ).hasRole("TEACHER")


// Student's own profile
                                .requestMatchers(
                                        HttpMethod.GET,
                                        "/api/users/student/me"
                                ).hasAnyRole("STUDENT","TEACHER")


// Teacher can view all students
                                .requestMatchers(
                                        HttpMethod.GET,
                                        "/api/users/teacher/students"
                                ).hasRole("TEACHER")


                        // =========================
                        // EVERYTHING ELSE
                        // =========================

                        .anyRequest().authenticated()
                )

                // Add JWT authentication filter
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }


    // =====================================================
    // CORS CONFIGURATION
    // =====================================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        // React development server
        configuration.setAllowedOrigins(
                List.of("http://localhost:5173",
                        "https://online-examination-system-black-psi.vercel.app"
                        )
        );

        // HTTP methods used by our frontend
        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "PATCH",
                        "DELETE",
                        "OPTIONS"
                )
        );

        // Headers used by React/Axios/JWT
        configuration.setAllowedHeaders(
                List.of(
                        "Authorization",
                        "Content-Type"
                )
        );

        // Allow credentials when required
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
}