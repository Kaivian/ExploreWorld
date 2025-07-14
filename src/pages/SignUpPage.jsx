import React, { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from 'react-router-dom';

function SignUpPage() {
    const [showPassword, setShowPassword] = useState(true);
    const [showConfirmPassword, setShowConfirmPassword] = useState(true);

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
                        <label className="form-label">Full Name</label>
                        <input type="text" className="form-control" placeholder="Enter your full name" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email address</label>
                        <input type="email" className="form-control" placeholder="Enter your email address" />
                    </div>

                    {/* Mật khẩu */}
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <div className="input-group">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-control"
                                placeholder="Enter your password"
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

                    {/* Xác nhận mật khẩu */}
                    <div className="mb-3">
                        <label className="form-label">Confirm Password</label>
                        <div className="input-group">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                className="form-control"
                                placeholder="Re-enter your password"
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
                        <button className="btn btn-dark">Create Account</button>
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

                {/* Phần chuyển sang login */}
                <div className="border-top px-4 py-3 text-center" style={{ backgroundColor: '#f2f2f2' }}>
                    <span className="text-muted">Already have an account?</span>{' '}
                    <a href="/login" className="fw-semibold text-decoration-none">Log in</a>
                </div>
            </div>
        </div>
    );
}

export default SignUpPage;
