import "@fortawesome/fontawesome-free/css/all.min.css";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthButtons = forwardRef((_, ref) => {
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
        setShowDropdown((prev) => !prev);
    };

    const handleRedirect = (path) => {
        sessionStorage.setItem("postLoginRedirect", window.location.pathname);
        setShowDropdown(false);
        navigate(path);
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
                    from { opacity: 0; transform: translateY(-8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes dropdown-fade-out {
                    from { opacity: 1; transform: translateY(0); }
                    to   { opacity: 0; transform: translateY(-8px); }
                }
                `}
            </style>

            <div
                ref={ref}
                className="position-fixed top-0 end-0"
                style={{ paddingTop: "8px", paddingRight: "8px", zIndex: 1050 }}
            >
                {(user || isSmallScreen) && (
                    <div className="position-relative" ref={dropdownRef}>
                        <div
                            className="bg-white d-flex align-items-center justify-content-center"
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "0.375rem",
                                cursor: "pointer",
                            }}
                            onClick={handleAvatarClick}
                        >
                            <i className="fa-regular fa-circle-user" style={{ fontSize: "24px" }} />
                        </div>

                        {shouldRender && (
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
                                {!user ? (
                                    <>
                                        <button
                                            className="dropdown-item text-center btn btn-link p-1 m-0 border-0"
                                            style={{
                                                textDecoration: hovered === "signup" ? "underline" : "none",
                                                color: hovered === "signup" ? "#afafafff" : "#212529",
                                            }}
                                            onMouseEnter={() => setHovered("signup")}
                                            onMouseLeave={() => setHovered(null)}
                                            onClick={() => handleRedirect("/sign-up")}
                                        >
                                            Sign up
                                        </button>
                                        <div style={{ height: "2px", backgroundColor: "#bebebe", margin: "4px 0" }} />
                                        <button
                                            className="dropdown-item text-center btn btn-link fw-semibold p-1 m-0 border-0"
                                            style={{
                                                textDecoration: hovered === "login" ? "underline" : "none",
                                                color: hovered === "login" ? "#afafafff" : "#212529",
                                            }}
                                            onMouseEnter={() => setHovered("login")}
                                            onMouseLeave={() => setHovered(null)}
                                            onClick={() => handleRedirect("/login")}
                                        >
                                            Log in
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <span className="dropdown-item text-center text-muted" style={{ fontSize: "14px" }}>
                                            👋 {user.username}
                                        </span>
                                        <div style={{ height: "2px", backgroundColor: "#bebebe", margin: "4px 0" }} />
                                        <button
                                            className="dropdown-item text-center btn btn-link text-danger fw-semibold p-1 m-0 border-0"
                                            onClick={() => {
                                                localStorage.removeItem("accessToken");
                                                localStorage.removeItem("user");
                                                setShowDropdown(false);
                                                navigate("/login");
                                            }}
                                        >
                                            Logout
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {!user && !isSmallScreen && (
                    <div
                        className="d-flex align-items-center bg-white shadow-sm"
                        style={{
                            height: "40px",
                            padding: "0 16px",
                            gap: "16px",
                            borderRadius: "10px",
                            border: "1px solid #dee2e6",
                        }}
                    >
                        <button
                            className="btn btn-link p-0 m-0 border-0"
                            style={{
                                textDecoration: hovered === "signup" ? "underline" : "none",
                                color: hovered === "signup" ? "#afafafff" : "#212529",
                            }}
                            onMouseEnter={() => setHovered("signup")}
                            onMouseLeave={() => setHovered(null)}
                            onClick={() => handleRedirect("/sign-up")}
                        >
                            Sign up
                        </button>

                        <div className="vr align-self-stretch" />

                        <button
                            className="btn btn-link fw-semibold p-0 m-0 border-0"
                            style={{
                                textDecoration: hovered === "login" ? "underline" : "none",
                                color: hovered === "login" ? "#afafafff" : "#212529",
                            }}
                            onMouseEnter={() => setHovered("login")}
                            onMouseLeave={() => setHovered(null)}
                            onClick={() => handleRedirect("/login")}
                        >
                            Log in
                        </button>
                    </div>
                )}
            </div>
        </>
    );
});

export default AuthButtons;
