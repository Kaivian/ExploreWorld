import SearchBar from "./SearchBar";
import { Outlet, useLocation } from "react-router-dom";

export default function MainLayout() {
    const location = useLocation();

    const isDaNangPage = location.pathname === "/da-nang";

    return (
        <div className="h-full w-full flex flex-col">
            {isDaNangPage && <SearchBar />}
            <div className="flex-1 relative">
                <Outlet />
            </div>
        </div>
    );
}
