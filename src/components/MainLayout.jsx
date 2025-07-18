import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AuthButtons from "./AuthButtons";
import Sidebar from "./Sidebar";

// Tùy chọn: quản lý zIndex rõ ràng hơn
const Z_INDEX = {
    SIDEBAR: 1000,
    AUTH_BUTTON: 1100,
    MAP_CONTENT: 1,
};

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
                    <div style={{ zIndex: Z_INDEX.AUTH_BUTTON }}>
                        <AuthButtons ref={authRef} />
                    </div>
                </>
            )}


            <div className="position-relative" style={{ zIndex: Z_INDEX.MAP_CONTENT }}>
                <Outlet />
            </div>
        </div>
    );
}
