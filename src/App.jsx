import { Routes, Route } from "react-router-dom";
import VietnamMap from "./components/VietnamMap";
import DaNang from "./pages/DaNang";
import Debug from "./pages/MapDebug";
import MainLayout from "./components/MainLayout";

export default function App() {
    return (
        <Routes>
            <Route element={<MainLayout />}> {}
                <Route path="/" element={<VietnamMap />} />
                <Route path="/da-nang" element={<DaNang />} />
                <Route path="/debug" element={<Debug />} />
            </Route>
        </Routes>
    );
}
