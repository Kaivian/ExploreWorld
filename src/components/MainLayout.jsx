import SearchBar from "./SearchBar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        <div className="h-full w-full flex flex-col">
            <SearchBar />
            <div className="flex-1 relative">
                <Outlet />
            </div>
        </div>
    );
}
