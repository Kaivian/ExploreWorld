import { useEffect, useState } from "react";

export default function HeaderWithSidebar({
    onSearchResults,
    onClearSearch,
}) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [dishList, setDishList] = useState([]);
    const [selectedDish, setSelectedDish] = useState(null);

    // Fetch all dishes based on cityID
    useEffect(() => {
        const cityID = sessionStorage.getItem("cityID") || 1;

        fetch(`http://localhost:8080/api/city/${cityID}/dishes`)
            .then((res) => res.json())
            .then(setDishList)
            .catch((err) => console.error("Error loading city dishes:", err));
    }, []);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (query.trim()) {
            setSidebarOpen(true);
        }
    }, [query]);

    const filteredDishes = query.trim()
        ? dishList.filter(d =>
            d.name.toLowerCase().includes(query.trim().toLowerCase())
        )
        : [];

    useEffect(() => {
        if (query.trim() && filteredDishes.length > 0) {
            onSearchResults?.(filteredDishes);
        } else if (!query.trim()) {
            onClearSearch?.();
        }
    }, [query, filteredDishes]);

    const handleDishClick = (dishId) => {
        fetch(`http://localhost:8080/api/dish/${dishId}`)
            .then((res) => res.json())
            .then((data) => {
                setSelectedDish(data);
                setSidebarOpen(true);
            })
            .catch((err) => console.error("Failed to fetch dish detail:", err));
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
        if (sidebarOpen) setSelectedDish(null);
    };

    const searchBarStyle = {
        position: "fixed",
        top: 8,
        zIndex: 1040,
        transition: "all 0.3s ease",
        pointerEvents: "auto",
        ...(sidebarOpen
            ? {
                width: "470px",
                left: "40%",
            }
            : {
                left: "50%",
                transform: "translateX(-50%)",
                width: "600px",
            }),
    };

    return (
        <>
            {/* Toggle Sidebar Button */}
            <button
                className="btn position-fixed top-0 start-0 m-2"
                style={{ zIndex: 1060, backgroundColor: "#ffffff" }}
                onClick={toggleSidebar}
            >
                ☰
            </button>

            {/* Sidebar */}
            <div
                className="position-fixed top-0 start-0 h-100 border-end shadow"
                style={{
                    backgroundColor: "#ffffff",
                    width: 400,
                    zIndex: 1050,
                    transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
                    transition: "transform 0.3s ease-in-out",
                    paddingTop: "70px",
                    paddingLeft: "1rem",
                    paddingRight: "1rem",
                    overflowY: "auto",
                }}
            >
                {selectedDish ? (
                    <>
                        <h4>{selectedDish.name}</h4>
                        <p><strong>City:</strong> {selectedDish.cityName}</p>
                        <p><strong>Category:</strong> {selectedDish.categoryName}</p>
                        {selectedDish.dishImageDTOList?.length > 0 ? (
                            selectedDish.dishImageDTOList.map((img, index) => (
                                <img
                                    key={index}
                                    src={img.imageUrl}
                                    alt={selectedDish.name}
                                    style={{
                                        width: "100%",
                                        maxHeight: "200px",
                                        borderRadius: "8px",
                                        objectFit: "cover",
                                        marginBottom: "12px",
                                    }}
                                />
                            ))
                        ) : (
                            <p className="text-muted">No images available.</p>
                        )}
                    </>
                ) : (
                    <>
                        <h5>{query.trim() ? "Kết quả tìm kiếm" : "Gợi ý món ăn"}</h5>
                        <ul className="list-unstyled">
                            {(query.trim() ? filteredDishes : dishList).map((dish) => (
                                <li key={dish.id} className="py-2 border-bottom">
                                    <div
                                        className="d-flex align-items-center"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleDishClick(dish.id)}
                                    >
                                        <img
                                            src={dish.imageUrl}
                                            alt={dish.name}
                                            style={{
                                                width: "36px",
                                                height: "36px",
                                                objectFit: "cover",
                                                borderRadius: "6px",
                                                marginRight: "12px"
                                            }}
                                        />
                                        <span>{dish.name}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        {query.trim() && filteredDishes.length === 0 && (
                            <p className="text-muted">Không tìm thấy món ăn nào</p>
                        )}
                    </>
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
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setSelectedDish(null);
                    }}
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
