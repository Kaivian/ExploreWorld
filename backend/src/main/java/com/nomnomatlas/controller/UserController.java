package com.nomnomatlas.controller;

import com.nomnomatlas.model.*;
import com.nomnomatlas.service.UserService;
import com.nomnomatlas.service.GoogleAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private GoogleAuthService googleAuthService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@RequestBody RegisterRequestDTO registerDTO) {
        AuthResponseDTO response = userService.registerUser(registerDTO);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginRequestDTO loginDTO) {
        AuthResponseDTO response = userService.login(loginDTO);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponseDTO> googleLogin(@RequestBody GoogleLoginRequestDTO googleDTO) {
        AuthResponseDTO response = googleAuthService.authenticateGoogleToken(googleDTO.getToken());
        return ResponseEntity.ok(response);
    }
}
