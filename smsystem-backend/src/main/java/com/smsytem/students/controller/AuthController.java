package com.smsytem.students.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smsytem.students.dto.JwtAuthResponse;
import com.smsytem.students.dto.LoginDTO;
import com.smsytem.students.dto.RegisterDTO;
import com.smsytem.students.exception.ApiResponse;
import com.smsytem.students.exception.AuthException;
import com.smsytem.students.exception.ResourceNotFoundException;
import com.smsytem.students.service.AuthService;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {
    @Autowired
    private AuthService authService;

    // build api for register
    @PreAuthorize("hasAnyRole('ADMIN')")
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody(required = true) RegisterDTO registerDTO) {
        try {
            authService.register(registerDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Đăng ký thành công!", null));
        } catch (AuthException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi máy chủ nội bộ, vui lòng thử lại.."));
        }
    }

    // api for user login.,
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginDTO loginDTO) {
        try {
            String token = authService.login(loginDTO);
            JwtAuthResponse jwtAuthResponse = new JwtAuthResponse();
            jwtAuthResponse.setAccessToken(token);
            jwtAuthResponse.setMessage("Đăng nhập thành công");
            jwtAuthResponse.setStatus("Thành công");
            return ResponseEntity.status(HttpStatus.OK).body(jwtAuthResponse);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (AuthException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Đã xảy ra lỗi máy chủ nội bộ"));
        }
    }

    // Health check endpoint for deployment platforms
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "Student Management System API");
        status.put("version", "1.0.0");
        status.put("timestamp", java.time.LocalDateTime.now().toString());
        return ResponseEntity.ok(status);
    }

}
