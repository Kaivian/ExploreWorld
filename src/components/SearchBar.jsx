import { useEffect, useState } from "react";

export default function SearchBar({ sidebarOpen, sidebarWidth, authWidth }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const GAP = windowWidth < 768 ? 70 : 20;
  const MIN_WIDTH = 200;
  const MAX_WIDTH = 600;

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

  // Debounce logic
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim()) {
        performSearch(query);
      } else {
        setResults([]);
      }
    }, 500); // delay 500ms

    return () => clearTimeout(timeout);
  }, [query]);

  const performSearch = async (text) => {
    const url = new URL("http://localhost:8080/api/restaurants/search");

    // Add dish query param
    url.searchParams.append("dish", text);

    try {
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setResults(data);
      console.log("Search results:", data); // replace this with your render logic
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  return (
    <div style={containerStyle}>
      <input
        type="text"
        className="form-control shadow-sm"
        placeholder="Search dishes, category, open/close time..."
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
  );
}
