import { useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import HeaderWithSidebar from "./HeaderWithSidebar";
import AuthButtons from "./AuthButtons";

export default function MainLayout() {
    const [authWidth, setAuthWidth] = useState(0);
    const authRef = useRef(null);
    const [searchResults, setSearchResults] = useState([]);
    const location = useLocation();

    const isLoginPage = location.pathname === "/login";
    const isSignUpPage = location.pathname === "/sign-up";

    return (
        <div className="h-100 w-100 position-relative">
            {!isLoginPage && !isSignUpPage && (
                <div style={{ zIndex: 1100 }}>
                    <AuthButtons ref={authRef} />
                </div>
            )}

            <div className="position-relative" style={{ zIndex: 1 }}>
                <Outlet context={{ searchResults }} />
            </div>
        </div>
    );
}
