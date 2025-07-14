package com.nomnomatlas.controller;

import com.nomnomatlas.model.LoginRequestDTO;
import com.nomnomatlas.model.RegisterRequestDTO;
import com.nomnomatlas.model.UserDTO;
import com.nomnomatlas.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
    @Autowired
    UserService userService;

    @PostMapping(value="/api/auth/register")
    public ResponseEntity<UserDTO> register(@RequestBody RegisterRequestDTO registerRequestDTO){
        UserDTO userDTO = userService.registerUser(registerRequestDTO);
        return ResponseEntity.ok(userDTO);
    }

    @PostMapping(value="/api/auth/login")
    public ResponseEntity<UserDTO> login(@RequestBody LoginRequestDTO loginRequestDTO){
        UserDTO userDTO = userService.login(loginRequestDTO);
        return ResponseEntity.ok(userDTO);
    }
}
