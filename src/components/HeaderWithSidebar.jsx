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
    const [dishList, setDishList] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const cityID = sessionStorage.getItem("cityID") || 1;

        fetch(`http://localhost:8080/api/city/${cityID}/dishes`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch dishes by city");
                return res.json();
            })
            .then(setDishList)
            .catch((err) => console.error("Error loading city dishes:", err));
    }, []);

    // Responsive layout updates
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
                    navigate("/da-nang");
                })
                .catch((err) => {
                    console.error("Search failed:", err);
                    onSearchResults?.([]);
                });
        }, 500);

        return () => clearTimeout(timeout);
    }, [query]);

    // Open sidebar automatically if user is typing
    useEffect(() => {
        if (query.trim()) setSidebarOpen(true);
    }, [query]);

    // Filter dishes by search query
    const filteredDishes = query.trim()
        ? dishList.filter(d => d.name.toLowerCase().includes(query.trim().toLowerCase()))
        : [];

    // Layout calculations
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

            {/* Sidebar with dish results */}
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
                    overflowY: "auto",
                }}
            >
                <h5>Kết quả tìm kiếm</h5>
                {query.trim() === "" ? (
                    <>
                        <p className="text-muted">Gợi ý một số món ăn</p>
                        <ul className="list-unstyled">
                            {dishList.slice(0, 5).map((dish) => (
                                <li key={dish.id} className="py-2 border-bottom">
                                    <Link
                                        to={`/dish/${dish.id}`}
                                        className="text-decoration-none d-flex align-items-center"
                                        onClick={toggleSidebar}
                                    >
                                        <img
                                            src={dish.imageUrl}
                                            alt={dish.name}
                                            style={{
                                                width: "48px",
                                                height: "48px",
                                                objectFit: "cover",
                                                borderRadius: "8px",
                                                marginRight: "12px"
                                            }}
                                        />
                                        <span>{dish.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </>
                ) : filteredDishes.length === 0 ? (
                    <p className="text-muted">Không tìm thấy món ăn nào</p>
                ) : (
                    <ul className="list-unstyled">
                        {filteredDishes.map((dish) => (
                            <li key={dish.id} className="py-2 border-bottom">
                                <Link
                                    to={`/dish/${dish.id}`}
                                    className="text-decoration-none d-flex align-items-center"
                                    onClick={toggleSidebar}
                                >
                                    <img
                                        src={dish.imageUrl}
                                        alt={dish.name}
                                        style={{
                                            width: "48px",
                                            height: "48px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                            marginRight: "12px"
                                        }}
                                    />
                                    <span>{dish.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
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
