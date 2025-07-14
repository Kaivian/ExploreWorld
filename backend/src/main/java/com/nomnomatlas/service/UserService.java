    package com.nomnomatlas.service;

    import com.nomnomatlas.config.JwtUtil;
    import com.nomnomatlas.model.LoginRequestDTO;
    import com.nomnomatlas.model.RegisterRequestDTO;
    import com.nomnomatlas.model.UserDTO;
    import com.nomnomatlas.repository.UserRepository;
    import com.nomnomatlas.repository.entity.UserEntity;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.HttpStatus;
    import org.springframework.security.crypto.password.PasswordEncoder;
    import org.springframework.stereotype.Service;
    import org.springframework.web.server.ResponseStatusException;

    @Service
    public class UserService {
        @Autowired
        private UserRepository userRepository;

        @Autowired
        private PasswordEncoder passwordEncoder;

        @Autowired
        private JwtUtil jwtUtil;

        public UserDTO registerUser(RegisterRequestDTO request) {

            if((userRepository.findByUsername(request.getUsername())).isPresent()){
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username already exists");
            }

            if (!request.getPassword().equals(request.getConfirmPassword())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Passwords do not match");
            }

            UserEntity user = new UserEntity();
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            userRepository.save(user);

            return mapToDTO(user);
        }

        public UserDTO login(LoginRequestDTO request){
            UserEntity userEntity = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Wrong username or password"));

            if(!passwordEncoder.matches(request.getPassword(), userEntity.getPassword())){
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Wrong username or password");
            }

            return mapToDTO(userEntity);
        }

        private UserDTO mapToDTO(UserEntity user) {
            UserDTO dto = new UserDTO();
            dto.setId(user.getId());
            dto.setUsername(user.getUsername());
            dto.setEmail(user.getEmail());

            String token = jwtUtil.generateToken(user.getUsername());
            dto.setToken(token);

            return dto;
        }

    }
