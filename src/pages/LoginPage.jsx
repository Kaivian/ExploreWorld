import React, { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from 'react-router-dom';

function LoginPage() {
    const [showPassword, setShowPassword] = useState(true);

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
                        <label className="form-label">Email address</label>
                        <input type="email" className="form-control" placeholder="Enter your email address" />
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
                                style={{ borderRight: 'none'}}
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
                        <button className="btn btn-dark">Log In</button>
                    </div>

                    <div className="text-center mb-3">
                        <hr />
                        <span className="bg-light px-2 position-relative" style={{ top: '-20px' }}>OR</span>
                    </div>

                    <div className="d-grid gap-2">
                        <button className="btn btn-outline-secondary">
                            <i className="bi bi-google me-2"></i> Continue with Google
                        </button>
                    </div>
                </div>

                <div className="border-top px-4 py-3 text-center" style={{ backgroundColor: '#f2f2f2' }}>
                    <span className="text-muted">Don’t have an account yet?</span>{' '}
                    <a href="/sign-up" className="fw-semibold text-decoration-none">Sign up</a>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;