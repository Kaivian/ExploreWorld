import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useNavigate } from "react-router-dom";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

function showReviewForm(place) {
    const user = JSON.parse(localStorage.getItem("user")); // kiểm tra login

    if (!user) {       
        alert("Bạn cần đăng nhập để đánh giá.");
        return;
    }

    const formHtml = `
        <div style="font-size: 14px; padding: 6px 10px;">
            <strong>Đánh giá ${place.name}</strong><br/>
            <textarea id="review-comment" placeholder="Bình luận..." rows="2" style="width: 100%; margin-top: 5px;"></textarea><br/>
            <input id="review-rating" type="number" min="1" max="5" placeholder="Rating từ 1 đến 5" style="width: 100%; margin-top: 5px;" /><br/>
            <button id="submit-review" style="margin-top: 5px;">Gửi</button>
        </div>
    `;

    const popup = new mapboxgl.Popup({ offset: 25 })
        .setLngLat([place.longitude, place.latitude])
        .setHTML(formHtml)
        .addTo(map.current);

    setTimeout(() => {
        document.getElementById("submit-review").onclick = async () => {
            const comment = document.getElementById("review-comment").value;
            const rating = parseFloat(document.getElementById("review-rating").value);

            if (!comment || !rating || rating < 1 || rating > 5) {
                alert("Vui lòng nhập bình luận và rating hợp lệ (1-5).");
                return;
            }

            try {
                const res = await fetch(`http://localhost:8080/api/restaurant/${place.id}/review`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${user.token}`, // nếu backend cần token
                    },
                    body: JSON.stringify({ comment, rating }),
                });

                if (!res.ok) throw new Error("Lỗi gửi đánh giá");

                const newAvgRating = await res.text();

                popup.setHTML(`
                    <div style="font-size: 14px; padding: 6px 10px;">
                        Cảm ơn bạn đã đánh giá!<br/>
                        ⭐ Rating mới: <strong>${newAvgRating}</strong>
                    </div>
                `);
            } catch (err) {
                console.error("Lỗi khi gửi đánh giá:", err);
                alert("Đã có lỗi xảy ra.");
            }
        };
    }, 0);
}

export default function DaNang() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const popupRef = useRef(new mapboxgl.Popup({ closeButton: false, closeOnClick: false }));
    const vnMapRef = useRef(null);
    const daNangMapRef = useRef(null);
    const navigate = useNavigate();
    const restaurantLoaded = useRef(false);

    const showReviewForm = (place) => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return alert("Bạn cần đăng nhập để đánh giá.");

        const formHtml = `
            <div style="font-size: 14px; padding: 6px 10px;">
                <strong>Đánh giá ${place.name}</strong><br/>
                <textarea id="review-comment" placeholder="Bình luận..." rows="2" style="width: 100%; margin-top: 5px;"></textarea><br/>
                <input id="review-rating" type="number" min="1" max="5" placeholder="Rating từ 1 đến 5" style="width: 100%; margin-top: 5px;" /><br/>
                <button id="submit-review" style="margin-top: 5px;">Gửi</button>
            </div>`;

        const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
            offset: 25,
        }).setHTML("").addTo(map.current);

        let isHoveringPopup = false;
        let popupTimeout;

        data.forEach((place) => {
            const marker = new mapboxgl.Marker({ color: '#ff6347' })
                .setLngLat([place.longitude, place.latitude])
                .addTo(map.current);

            const popupHtml = `
        <div class="custom-popup" style="font-size: 14px; padding: 6px 10px;">
            <strong>${place.name}</strong><br/>
            <span id="avg-rating-${place.id}">Loading...</span>
        </div>
    `;

            const element = marker.getElement();

            element.addEventListener("mouseenter", async () => {
                clearTimeout(popupTimeout);

                try {
                    const res = await fetch(`http://localhost:8080/api/restaurant/${place.id}/review`);
                    const avgRating = await res.text();

                    popup.setLngLat([place.longitude, place.latitude])
                        .setHTML(`
                    <div class="custom-popup" style="font-size: 14px; padding: 6px 10px;">
                        <strong>${place.name}</strong><br/>
                        ⭐ Rating trung bình: <strong>${avgRating}</strong>
                    </div>
                `)
                        .addTo(map.current);

                    setTimeout(() => {
                        const popupEl = document.querySelector('.mapboxgl-popup-content');
                        if (popupEl) {
                            popupEl.addEventListener('mouseenter', () => isHoveringPopup = true);
                            popupEl.addEventListener('mouseleave', () => {
                                isHoveringPopup = false;
                                popup.remove();
                            });
                        }
                    }, 0);

                } catch (err) {
                    console.error("Lỗi khi lấy rating trung bình:", err);
                }
            });

            element.addEventListener("mouseleave", () => {
                popupTimeout = setTimeout(() => {
                    if (!isHoveringPopup) {
                        popup.remove();
                    }
                }, 300);
            });

            map.current.restaurantMarkers.push(marker);
        });
    };

    const loadRestaurants = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/city/3");
            const data = await res.json();

            if (map.current.restaurantMarkers) {
                map.current.restaurantMarkers.forEach(marker => marker.remove());
            }
            map.current.restaurantMarkers = [];

            const popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 25 });

            data.forEach((place) => {
                const marker = new mapboxgl.Marker({ color: '#ff6347' })
                    .setLngLat([place.longitude, place.latitude])
                    .addTo(map.current);

                const markerEl = marker.getElement();

                markerEl.addEventListener("mouseenter", async () => {
                    try {
                        const res = await fetch(`http://localhost:8080/api/restaurant/${place.id}/review`);
                        const avgRating = await res.text();

                        popup.setLngLat([place.longitude, place.latitude])
                            .setHTML(`
                                <div style="font-size: 14px; padding: 6px 10px;">
                                    <strong>${place.name}</strong><br/>
                                    ⭐ Rating trung bình: <strong>${avgRating}</strong><br/>
                                    <button id="review-btn" style="margin-top: 5px; font-size: 12px;">Viết đánh giá</button>
                                </div>`)
                            .addTo(map.current);

                        setTimeout(() => {
                            const btn = document.getElementById("review-btn");
                            if (btn) btn.onclick = () => showReviewForm(place);
                        }, 0);
                    } catch (err) {
                        console.error("Lỗi khi lấy rating trung bình:", err);
                    }
                });

                markerEl.addEventListener("mouseleave", () => popup.remove());
                map.current.restaurantMarkers.push(marker);
            });

            restaurantLoaded.current = true;
        } catch (err) {
            console.error("Lỗi tải nhà hàng:", err);
        }
    };

    const center = [108.2022, 15.8544];
    const zoom = 9;

    // Tính diện tích polygon
    function getPolygonArea(coords) {
        let area = 0;
        for (let i = 0; i < coords.length - 1; i++) {
            const [x1, y1] = coords[i];
            const [x2, y2] = coords[i + 1];
            area += x1 * y2 - x2 * y1;
        }
        return Math.abs(area / 2);
    }

    // Tính centroid đơn giản
    function centroid(coords) {
        let x = 0, y = 0;
        coords.forEach(([lng, lat]) => {
            x += lng;
            y += lat;
        });
        return [x / coords.length, y / coords.length];
    }

    // Tạo label 1 lần duy nhất cho mỗi quận
    const createLabelFeatures = (geojson) => {
        const labelMap = {};

        geojson.features.forEach((feature) => {
            const name = feature.properties.NAME_2 || feature.properties.NAME_1;
            let area = 0;
            let coords = [];

            if (feature.geometry.type === "Polygon") {
                coords = feature.geometry.coordinates[0];
                area = getPolygonArea(coords);
            } else if (feature.geometry.type === "MultiPolygon") {
                let maxArea = 0;
                feature.geometry.coordinates.forEach((poly) => {
                    const a = getPolygonArea(poly[0]);
                    if (a > maxArea) {
                        maxArea = a;
                        coords = poly[0];
                    }
                });
                area = maxArea;
            }

            if (!labelMap[name] || area > labelMap[name].area) {
                labelMap[name] = {
                    name,
                    coordinates: centroid(coords),
                    area,
                };
            }
        });

        return {
            type: "FeatureCollection",
            features: Object.values(labelMap).map(({ name, coordinates }) => ({
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates,
                },
                properties: {
                    name,
                },
            })),
        };
    };

    const hideDefaultLabels = () => {
        const layers = map.current.getStyle().layers;
        layers.forEach((layer) => {
            if (layer.type === "symbol") {
                map.current.setLayoutProperty(layer.id, "visibility", "none");
            }
        });
    };

    const loadLayers = async () => {
        // 1. Load VN-MAP.json và lọc bỏ Đà Nẵng
        if (!vnMapRef.current) {
            const res = await fetch("/data/VN-MAP.json");
            const fullVNMap = await res.json();
            vnMapRef.current = {
                ...fullVNMap,
                features: fullVNMap.features.filter(
                    (f) => !f.properties.NAME_1.toLowerCase().includes("đà nẵng")
                ),
            };
        }

        map.current.addSource("vn-other-provinces", {
            type: "geojson",
            data: vnMapRef.current,
        });

        map.current.addLayer({
            id: "vn-other-provinces-fill",
            type: "fill",
            source: "vn-other-provinces",
            paint: {
                "fill-color": "#cccccc",
                "fill-opacity": 0.9,
            },
        });

        // 2. Load DA_NANG_MAP.json
        if (!daNangMapRef.current) {
            const res = await fetch("/data/DA_NANG_MAP.json");
            daNangMapRef.current = await res.json();
        }

        map.current.addSource("da-nang", {
            type: "geojson",
            data: daNangMapRef.current,
        });

        map.current.addLayer({
            id: "da-nang-fill",
            type: "fill",
            source: "da-nang",
            paint: {
                "fill-color": "#2cf3c3",
                "fill-opacity": 0.0,
            },
        });

        map.current.addLayer({
            id: "da-nang-border",
            type: "line",
            source: "da-nang",
            paint: {
                "line-color": "#da5c32",
                "line-width": 2,
            },
        });

        // 3. Tạo label 1 lần duy nhất cho mỗi quận
        const labelGeoJSON = createLabelFeatures(daNangMapRef.current);
        map.current.addSource("da-nang-labels", {
            type: "geojson",
            data: labelGeoJSON,
        });

        map.current.addLayer({
            id: "da-nang-district-labels",
            type: "symbol",
            source: "da-nang-labels",
            layout: {
                "text-field": ["get", "name"],
                "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
                "text-size": 14,
                "text-anchor": "center",
                "text-allow-overlap": false,
                "visibility": "visible",
            },
            paint: {
                "text-color": "#333333",
                "text-halo-color": "#ffffff",
                "text-halo-width": 1.2,
            },
        });

        // 4. Hover popup
        map.current.on("mousemove", "restaurant-points", async (e) => {
            const restaurant = e.features[0];
            const { id, name } = restaurant.properties;
            const [lng, lat] = restaurant.geometry.coordinates;

            try {
                const res = await fetch(`http://localhost:8080/api/restaurant/${id}/review`);
                const avgRating = await res.text();

                popupRef.current
                    .setLngLat([lng, lat])
                    .setOffset([0, -15])
                    .setHTML(`
                <div style="font-size: 14px; padding: 6px 10px;">
                    <strong>${name}</strong><br/>
                    ⭐ Rating trung bình: <strong>${avgRating}</strong>
                </div>
            `)
                    .addTo(map.current);
            } catch (err) {
                console.error("Lỗi khi lấy rating trung bình:", err);
            }
        });

        map.current.on("mouseleave", "restaurant-points", () => {
            popupRef.current.remove();
        });

        // 5. Tô xám các nước khác
        map.current.addSource("country-boundaries", {
            type: "vector",
            url: "mapbox://mapbox.country-boundaries-v1",
        });

        map.current.addLayer({
            id: "gray-other-countries",
            type: "fill",
            source: "country-boundaries",
            "source-layer": "country_boundaries",
            filter: ["!=", ["get", "iso_3166_1_alpha_3"], "VNM"],
            paint: {
                "fill-color": "#cccccc",
                "fill-opacity": 0.8,
            },
        });

        // 6. Zoom control
        map.current.on("zoom", () => {
            const z = map.current.getZoom();
            const center = map.current.getCenter();
            if (z <= 8) {
                localStorage.setItem("mapZoom", z);
                localStorage.setItem("mapCenter", JSON.stringify([center.lng, center.lat]));
                navigate("/");
                return;
            }

            if (map.current.getLayer("da-nang-district-labels")) {
                map.current.setLayoutProperty(
                    "da-nang-district-labels",
                    "visibility",
                    z < 11 ? "visible" : "none"
                );
            }

            if (z >= 11 && !restaurantLoaded.current) {
                loadRestaurants();
            }

            if (z < 11 && restaurantLoaded.current) {
                if (map.current.restaurantMarkers) {
                    map.current.restaurantMarkers.forEach(m => m.remove());
                    map.current.restaurantMarkers = [];
                }
                restaurantLoaded.current = false;
            }

            const hasBorder = map.current.getLayer("da-nang-border");
            if (z >= 11 && hasBorder) {
                map.current.removeLayer("da-nang-border");
            } else if (z < 11 && !hasBorder && map.current.getSource("da-nang")) {
                map.current.addLayer({
                    id: "da-nang-border",
                    type: "line",
                    source: "da-nang",
                    paint: {
                        "line-color": "#da5c32",
                        "line-width": 2,
                    },
                });
            }
            const layers = map.current.getStyle().layers;
            layers.forEach((layer) => {
                if (
                    layer.type === "symbol" &&
                    layer.id !== "da-nang-district-labels"
                ) {
                    map.current.setLayoutProperty(
                        layer.id,
                        "visibility",
                        z >= 11 ? "visible" : "none"
                    );
                }
            });
        });
    };

    useEffect(() => {
        if (map.current) return;
        const savedZoom = parseFloat(localStorage.getItem("mapZoom")) || 9;
        const savedCenter = JSON.parse(localStorage.getItem("mapCenter")) || [108.2022, 15.8544];

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: savedCenter,
            zoom: Math.max(savedZoom, 9),
            minZoom: 8,
            maxZoom: 15,
        });

        localStorage.removeItem("mapZoom");
        localStorage.removeItem("mapCenter");

        map.current.on("load", async () => {
            hideDefaultLabels();
            await loadLayers();
        });
    }, []);

    return <div ref={mapContainer} style={{ height: "100vh", width: "100vw" }} />;
}
