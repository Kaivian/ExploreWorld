import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import SearchBar from "./SearchBar";
import AuthButtons from "./AuthButtons";

export default function MainLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [authWidth, setAuthWidth] = useState(0);
    const authRef = useRef(null);

    const location = useLocation();
    const isDaNangPage = location.pathname === "/da-nang";
    const isLoginPage = location.pathname === "/login";
    const isSignUpPage = location.pathname === "/sign-up";

    useEffect(() => {
        const updateAuthWidth = () => {
            if (authRef.current) {
                setAuthWidth(authRef.current.offsetWidth);
            }
        };
        updateAuthWidth();
        window.addEventListener("resize", updateAuthWidth);
        return () => window.removeEventListener("resize", updateAuthWidth);
    }, []);

    return (
        <div className="h-100 w-100 position-relative">
            {!isLoginPage && !isSignUpPage && (
                <>
                    <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                    <div style={{ zIndex: 1100 }}>
                        <AuthButtons ref={authRef} />
                    </div>
                </>
            )}

            {isDaNangPage && (
                <SearchBar
                    sidebarOpen={isSidebarOpen}
                    sidebarWidth={600}
                    authWidth={authWidth}
                />
            )}

            <div className="position-relative" style={{ zIndex: 1 }}>
                <Outlet />
            </div>
        </div>
    );
}
