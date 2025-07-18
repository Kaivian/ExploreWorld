import { GoogleLogin } from '@react-oauth/google';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SignUpPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const isValidUsername = (username) => /^[a-zA-Z0-9_.]{4,20}$/.test(username);

    const handleSignUp = async () => {
        if (!isValidUsername(username)) {
            alert('Username must be 4–20 characters and can only contain letters, numbers, _ and .');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        try {
            const res = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) throw new Error('Registration failed');

            const data = await res.json();
            localStorage.setItem('user', JSON.stringify(data.user));
            if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
            }

            const redirectTo = sessionStorage.getItem("postLoginRedirect") || "/";
            sessionStorage.removeItem("postLoginRedirect");
            navigate(redirectTo, { replace: true });

        } catch (err) {
            console.error('Signup error:', err);
            alert('Signup failed.');
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

            if (!res.ok) throw new Error('Google signup failed');

            const data = await res.json();
            localStorage.setItem('user', JSON.stringify(data.user));
            if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
            }

            const redirectTo = sessionStorage.getItem('postLoginRedirect') || '/dashboard';
            sessionStorage.removeItem('postLoginRedirect');
            navigate(redirectTo);
        } catch (err) {
            console.error('Google signup error:', err);
            alert('Google signup failed.');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow-sm" style={{ width: '400px', borderRadius: '16px', overflow: 'hidden' }}>
                <div className="card-body">
                    <div className="d-flex justify-content-center mb-4">
                        <Link to="/login" className="btn btn-outline-secondary me-2">
                            <i className="bi bi-box-arrow-in-right me-1"></i> Login
                        </Link>
                        <button className="btn btn-dark" disabled>
                            <i className="bi bi-person-plus me-1"></i> Sign Up
                        </button>
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
                        <label className="form-label">Password</label>
                        <div className="input-group">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ borderRight: 'none' }}
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

                    <div className="mb-3">
                        <label className="form-label">Confirm Password</label>
                        <div className="input-group">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                className="form-control"
                                placeholder="Re-enter your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={{ borderRight: 'none' }}
                            />
                            <span
                                className="input-group-text bg-white"
                                style={{ cursor: 'pointer', borderLeft: 'none' }}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                            </span>
                        </div>
                    </div>

                    <div className="d-grid mb-3">
                        <button className="btn btn-dark" onClick={handleSignUp}>Create Account</button>
                    </div>

                    <div className="text-center mb-3">
                        <hr />
                        <span className="bg-light px-2 position-relative" style={{ top: '-20px' }}>OR</span>
                    </div>

                    <div className="d-grid gap-2">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => {
                                console.log('Google sign-up failed');
                            }}
                        />
                    </div>
                </div>

                <div className="border-top px-4 py-3 text-center" style={{ backgroundColor: '#f2f2f2' }}>
                    <span className="text-muted">Already have an account?</span>{' '}
                    <Link to="/login" className="fw-semibold text-decoration-none">Log in</Link>
                </div>
            </div>
        </div>
    );
}

export default SignUpPage;
