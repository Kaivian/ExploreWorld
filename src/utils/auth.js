// src/utils/auth.js

export function isLoggedIn() {
    return !!localStorage.getItem("token");
}

export function getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    };
}
