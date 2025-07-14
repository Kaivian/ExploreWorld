import { Routes, Route } from "react-router-dom";
import VietnamMap from "./components/VietnamMap";
import DaNang from "./pages/DaNang";
import MainLayout from "./components/MainLayout";
import Login from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

export default function App() {
    return (
        <Routes>
            <Route element={<MainLayout />}> {}
                <Route path="/" element={<VietnamMap />} />
                <Route path="/da-nang" element={<DaNang />} />
                <Route path="/login" element={<Login />} />
                <Route path="/sign-up" element={<SignUpPage />} />
            </Route>
        </Routes>
    );
}
