import { useEffect, useState } from "react";

export default function SearchBar({ sidebarOpen, sidebarWidth, authWidth }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const GAP = windowWidth < 768 ? 70 : 20;
  const MIN_WIDTH = 200;
  const MAX_WIDTH = 600;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Tính toán vị trí và kích thước
  const leftOffset = sidebarOpen ? sidebarWidth + GAP : 0;
  const rightOffset = authWidth + GAP;
  const availableWidth = windowWidth - leftOffset - rightOffset;
  const searchBarWidth = Math.max(Math.min(MAX_WIDTH, availableWidth), MIN_WIDTH);

  const containerStyle = {
    position: "fixed",
    top: 8,
    left: sidebarOpen ? `${leftOffset}px` : "50%",
    transform: sidebarOpen ? "none" : "translateX(-50%)",
    width: `${searchBarWidth}px`,
    zIndex: 1040,
    pointerEvents: "auto",
    transition: "all 0.3s ease",
  };

  return (
    <div style={containerStyle}>
      <input
        type="text"
        className="form-control shadow-sm"
        placeholder="Search..."
        style={{
          height: "40px",
          borderRadius: "999px",
          padding: "0 16px",
          width: "100%",
        }}
      />
    </div>
  );
}
