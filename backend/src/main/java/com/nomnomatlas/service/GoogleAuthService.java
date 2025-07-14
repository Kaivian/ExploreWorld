package com.nomnomatlas.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nomnomatlas.config.JwtUtil;
import com.nomnomatlas.model.AuthResponseDTO;
import com.nomnomatlas.model.UserDTO;
import com.nomnomatlas.repository.UserRepository;
import com.nomnomatlas.repository.entity.UserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class GoogleAuthService {

    private final String GOOGLE_TOKEN_INFO_URL = "https://oauth2.googleapis.com/tokeninfo?id_token=";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponseDTO authenticateGoogleToken(String idToken) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String json = restTemplate.getForObject(GOOGLE_TOKEN_INFO_URL + idToken, String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode jsonNode = mapper.readTree(json);

            String email = jsonNode.get("email").asText();
            String name = jsonNode.get("name").asText();

            Optional<UserEntity> optionalUser = userRepository.findByEmail(email);
            UserEntity user;

            if (optionalUser.isPresent()) {
                user = optionalUser.get();
            } else {
                // Tạo user mới nếu chưa có
                user = new UserEntity();
                user.setEmail(email);
                user.setUsername(email.split("@")[0]); // đơn giản hóa
                user.setPassword(""); // không cần mật khẩu
                userRepository.save(user);
            }

            UserDTO dto = new UserDTO();
            dto.setId(user.getId());
            dto.setUsername(user.getUsername());
            dto.setEmail(user.getEmail());

            String token = jwtUtil.generateToken(user.getUsername());
            return new AuthResponseDTO(dto, token);

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Google Token");
        }
    }
}
