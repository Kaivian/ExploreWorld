import { useEffect, useState } from "react";

export default function SearchBar({ onSearchResults, onClearSearch, sidebarOpen, sidebarWidth, authWidth }) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [query, setQuery] = useState("");

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

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
                .then(res => {
                    if (!res.ok) throw new Error("Search failed");
                    return res.json();
                })
                .then(data => onSearchResults?.(data))
                .catch(err => {
                    console.error("Search failed:", err);
                    onSearchResults?.([]);
                });
        }, 500);

        return () => clearTimeout(timeout);
    }, [query, onSearchResults, onClearSearch]);

    const GAP = windowWidth < 768 ? 70 : 20;
    const MIN_WIDTH = 200;
    const MAX_WIDTH = 600;

    const effectiveSidebarWidth = sidebarOpen ? sidebarWidth : 0;
    const leftOffset = sidebarOpen ? effectiveSidebarWidth + GAP : 0;
    const rightOffset = authWidth + GAP;
    const availableWidth = windowWidth - leftOffset - rightOffset;
    const searchBarWidth = Math.max(Math.min(MAX_WIDTH, availableWidth), MIN_WIDTH);

    const containerStyle = {
        position: "fixed",
        top: 8,
        left: `calc(50% - ${searchBarWidth / 2}px - ${authWidth / 2}px)`,
        transform: "none",
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
    );
}
