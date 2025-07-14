import { Outlet, useLocation } from "react-router-dom";
import SearchBar from "./SearchBar";
import AuthButtons from "./AuthButtons";

export default function MainLayout() {
    const location = useLocation();
    const isDaNangPage = location.pathname === "/da-nang";
    const isLoginPage = location.pathname === "/login";
    const isSignUpPage = location.pathname === "/sign-up";

    return (
        <div className="h-full w-full flex flex-col position-relative">
            {!isLoginPage && !isSignUpPage && <AuthButtons />}
            {isDaNangPage && <SearchBar />}
            <div className="flex-1 relative">
                <Outlet />
            </div>
        </div>
    );
}
