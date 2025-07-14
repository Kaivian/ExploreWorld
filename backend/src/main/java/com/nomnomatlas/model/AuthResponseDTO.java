package com.nomnomatlas.model;

public class AuthResponseDTO {
    private UserDTO user;
    private String accessToken;

    public AuthResponseDTO(UserDTO user, String accessToken) {
        this.user = user;
        this.accessToken = accessToken;
    }

    public UserDTO getUser() {
        return user;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }
}
