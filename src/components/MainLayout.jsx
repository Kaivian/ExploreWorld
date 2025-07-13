import SearchBar from "./SearchBar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        <>
            <SearchBar />
            <div className="pt-20">
                <Outlet />
            </div>
        </>
    );
}
