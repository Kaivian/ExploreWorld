import { Routes, Route } from "react-router-dom";
import VietnamMap from "./components/VietnamMap";
import DaNang from "./pages/DaNang";

export default function App() {
  return (
    <main className="h-screen w-screen">
      <Routes>
        <Route path="/" element={<VietnamMap />} />
        <Route path="/da-nang" element={<DaNang />} />
      </Routes>
    </main>
  );
}
