import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function HeaderWithSidebar({
  onSearchResults,
  onClearSearch,
  sidebarWidth = 600,
  authWidth = 52,
}) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");

  const navigate = useNavigate();

  // Handle screen resizing
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle search query debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmed = query.trim();

      if (!trimmed) {
        onClearSearch?.();
        return;
      }

      const url = new URL("http://localhost:8080/api/restaurants/search");
      url.searchParams.append("dishName", trimmed);

      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error("Search failed");
          return res.json();
        })
        .then((data) => {
          onSearchResults?.(data);
          navigate("/da-nang"); // Auto-redirect to DaNang page on search
        })
        .catch((err) => {
          console.error("Search failed:", err);
          onSearchResults?.([]);
        });
    }, 500);

    return () => clearTimeout(timeout);
  }, [query]);

  // Responsive layout calculation
  const GAP = windowWidth < 768 ? 70 : 20;
  const MIN_WIDTH = 200;
  const MAX_WIDTH = 600;

  const effectiveSidebarWidth = sidebarOpen ? sidebarWidth : 0;
  const leftOffset = sidebarOpen ? effectiveSidebarWidth + GAP : 0;
  const rightOffset = authWidth + GAP;
  const availableWidth = windowWidth - leftOffset - rightOffset;
  const searchBarWidth = Math.max(Math.min(MAX_WIDTH, availableWidth), MIN_WIDTH);

  const searchBarStyle = {
    position: "fixed",
    top: 8,
    left: leftOffset + (availableWidth / 2) - (searchBarWidth / 2),
    width: `${searchBarWidth}px`,
    zIndex: 1040,
    transition: "all 0.3s ease",
    pointerEvents: "auto",
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        className="btn position-fixed top-0 start-0 m-2"
        style={{ zIndex: 1060, backgroundColor: "#ffffff" }}
        onClick={toggleSidebar}
      >
        ☰
      </button>

      {/* Sidebar Drawer */}
      <div
        className="position-fixed top-0 start-0 h-100 border-end shadow"
        style={{
          backgroundColor: "#ffffff",
          width: sidebarWidth,
          zIndex: 1050,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease-in-out",
          paddingTop: "70px",
          paddingLeft: "1rem",
          paddingRight: "1rem",
        }}
      >
        <h5>Menu</h5>
        <ul className="list-unstyled">
          <li>
            <Link to="/" className="text-decoration-none d-block py-2" onClick={toggleSidebar}>
              Trang chính
            </Link>
          </li>
          <li>
            <Link to="/da-nang" className="text-decoration-none d-block py-2" onClick={toggleSidebar}>
              Đà Nẵng
            </Link>
          </li>
          <li>
            <Link to="/login" className="text-decoration-none d-block py-2" onClick={toggleSidebar}>
              Đăng nhập
            </Link>
          </li>
        </ul>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ zIndex: 1040, backgroundColor: "rgba(0,0,0,0)" }}
          onClick={toggleSidebar}
        />
      )}

      {/* Search Bar */}
      <div style={searchBarStyle}>
        <input
          type="text"
          className="form-control shadow-sm"
          placeholder="Tìm kiếm món ăn, nhà hàng..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            height: "40px",
            borderRadius: "999px",
            padding: "0 16px",
            width: "100%",
          }}
        />
      </div>
    </>
  );
}
