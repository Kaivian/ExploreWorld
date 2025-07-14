import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function AuthButtons() {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });

    const [hovered, setHovered] = useState(null);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);
    const dropdownRef = useRef();

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 870);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (showDropdown) {
            setShouldRender(true);
        } else {
            const timeout = setTimeout(() => setShouldRender(false), 200);
            return () => clearTimeout(timeout);
        }
    }, [showDropdown]);

    const handleAvatarClick = () => {
        if (user) {
            navigate("/profile");
        } else {
            setShowDropdown((prev) => !prev);
        }
    };

    return (
        <>
            <style>
                {`
            .fade-in {
                animation: dropdown-fade-in 200ms ease-out forwards;
            }
            .fade-out {
                animation: dropdown-fade-out 200ms ease-in forwards;
            }
            @keyframes dropdown-fade-in {
                from {
                    opacity: 0;
                    transform: translateY(-8px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            @keyframes dropdown-fade-out {
                from {
                    opacity: 1;
                    transform: translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateY(-8px);
                }
            }
        `}
            </style>

            <div
                className="position-fixed top-0 end-0"
                style={{ paddingTop: "8px", paddingRight: "16px", zIndex: 1050 }}
            >
                {user || isSmallScreen ? (
                    <div className="position-relative" ref={dropdownRef}>
                        <div
                            className="bg-white rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                                width: "38px",
                                height: "38px",
                                cursor: "pointer",
                            }}
                            onClick={handleAvatarClick}
                        >
                            <i
                                className="fa-regular fa-circle-user"
                                style={{
                                    fontSize: "24px",
                                    color: "#212529",
                                }}
                            />
                        </div>

                        {!user && shouldRender && (
                            <div
                                className={`dropdown-menu mt-2 shadow-sm ${showDropdown ? "fade-in" : "fade-out"}`}
                                style={{
                                    display: "block",
                                    position: "absolute",
                                    top: "100%",
                                    right: 0,
                                    borderRadius: "0.5rem",
                                    minWidth: "120px",
                                    backgroundColor: "#fff",
                                    padding: "8px 0",
                                    zIndex: 1060,
                                }}
                            >
                                <button
                                    className="dropdown-item text-center btn btn-link p-1 m-0 border-0"
                                    style={{
                                        background: "none",
                                        border: "none",
                                        width: "100%",
                                        color: hovered === "signup" ? "#afafafff" : "#212529",
                                        textDecoration: hovered === "signup" ? "underline" : "none",
                                        fontSize: "16px",
                                    }}
                                    onMouseEnter={() => setHovered("signup")}
                                    onMouseLeave={() => setHovered(null)}
                                    onClick={() => {
                                        setShowDropdown(false);
                                        navigate("/signup");
                                    }}
                                >
                                    Sign up
                                </button>
                                <div style={{ height: "2px", backgroundColor: "#bebebe", margin: "4px 0" }} />
                                <button
                                    className="dropdown-item text-center btn btn-link fw-semibold p-1 m-0 border-0"
                                    style={{
                                        background: "none",
                                        border: "none",
                                        width: "100%",
                                        color: hovered === "login" ? "#afafafff" : "#212529",
                                        textDecoration: hovered === "login" ? "underline" : "none",
                                        fontSize: "16px",
                                    }}
                                    onMouseEnter={() => setHovered("login")}
                                    onMouseLeave={() => setHovered(null)}
                                    onClick={() => {
                                        setShowDropdown(false);
                                        navigate("/login");
                                    }}
                                >
                                    Log in
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div
                        className="d-flex align-items-center bg-white shadow-sm rounded-pill"
                        style={{
                            height: "38px",
                            paddingLeft: "14px",
                            paddingRight: "14px",
                            gap: "12px",
                            fontSize: "16px",
                            lineHeight: "2",
                        }}
                    >
                        <button
                            className="btn btn-link p-0 m-0 border-0"
                            style={{
                                textDecoration: hovered === "signup" ? "underline" : "none",
                                fontSize: "16px",
                                color: hovered === "signup" ? "#afafafff" : "#212529",
                                transition: "color 0.2s ease",
                            }}
                            onMouseEnter={() => setHovered("signup")}
                            onMouseLeave={() => setHovered(null)}
                            onClick={() => {
                                sessionStorage.setItem("postLoginRedirect", window.location.pathname);
                                navigate("/sign-up");
                            }}
                        >
                            Sign up
                        </button>

                        <div className="vr align-self-stretch" style={{ height: "100%" }} />

                        <button
                            className="btn btn-link fw-semibold p-0 m-0 border-0"
                            style={{
                                textDecoration: hovered === "login" ? "underline" : "none",
                                fontSize: "16px",
                                color: hovered === "login" ? "#afafafff" : "#212529",
                                transition: "color 0.2s ease",
                            }}
                            onMouseEnter={() => setHovered("login")}
                            onMouseLeave={() => setHovered(null)}
                            onClick={() => {
                                sessionStorage.setItem("postLoginRedirect", window.location.pathname);
                                navigate("/login");
                            }}
                        >
                            Log in
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
