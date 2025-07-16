import { GoogleLogin } from '@react-oauth/google';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function usePostLoginRedirect() {
    return () => {
        const path = sessionStorage.getItem("postLoginRedirect") || "/dashboard";
        sessionStorage.removeItem("postLoginRedirect");
        return path;
    };
}

function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleNormalLogin = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) throw new Error('Login failed');

            const data = await res.json();

            localStorage.setItem('user', JSON.stringify(data.user));
            if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
            }

            const getRedirectPath = usePostLoginRedirect();
            navigate(getRedirectPath());
        } catch (err) {
            console.error('Login error:', err);
            alert('Login failed. Please check your credentials.');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const idToken = credentialResponse.credential;
            const decoded = jwtDecode(idToken);
            console.log('Google user:', decoded);

            const res = await fetch('http://localhost:8080/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: idToken }),
            });

            if (!res.ok) throw new Error('Google login failed');

            const data = await res.json();

            localStorage.setItem('user', JSON.stringify(data.user));
            if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
            }

            const getRedirectPath = usePostLoginRedirect();
            navigate(getRedirectPath());
        } catch (err) {
            console.error('Google login error:', err);
            alert('Google login failed.');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow-sm" style={{ width: '400px', borderRadius: '16px', overflow: 'hidden' }}>
                <div className="card-body">
                    <div className="d-flex justify-content-center mb-4">
                        <button className="btn btn-dark me-2" disabled>
                            <i className="bi bi-box-arrow-in-right me-1"></i> Login
                        </button>
                        <Link to="/sign-up" className="btn btn-outline-secondary">
                            <i className="bi bi-person-plus me-1"></i> Sign Up
                        </Link>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <div className="d-flex justify-content-between">
                            <label className="form-label">Password</label>
                            <a href="#" className="small text-decoration-none">Forgot password?</a>
                        </div>
                        <div className="input-group">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-control"
                                placeholder="Enter your password"
                                style={{ borderRight: 'none' }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <span
                                className="input-group-text bg-white"
                                style={{ cursor: 'pointer', borderLeft: 'none' }}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                            </span>
                        </div>
                    </div>

                    <div className="d-grid mb-3">
                        <button className="btn btn-dark" onClick={handleNormalLogin}>Log In</button>
                    </div>

                    <div className="text-center mb-3">
                        <hr />
                        <span className="bg-light px-2 position-relative" style={{ top: '-20px' }}>OR</span>
                    </div>

                    <div className="d-grid gap-2">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => {
                                console.log('Google login failed');
                            }}
                        />
                    </div>
                </div>

                <div className="border-top px-4 py-3 text-center" style={{ backgroundColor: '#f2f2f2' }}>
                    <span className="text-muted">Don’t have an account yet?</span>{' '}
                    <Link to="/sign-up" className="fw-semibold text-decoration-none">Sign up</Link>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
