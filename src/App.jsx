import { Routes, Route } from "react-router-dom";
import VietnamMap from "./components/VietnamMap";
import DaNang from "./pages/DaNang";
import MainLayout from "./components/MainLayout";

export default function App() {
    return (
        <Routes>
            <Route element={<MainLayout />}> {}
                <Route path="/" element={<VietnamMap />} />
                <Route path="/da-nang" element={<DaNang />} />
            </Route>
        </Routes>
    );
}
