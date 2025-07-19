import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import RestaurantDetails from "../components/RestaurantDetails";
import HeaderWithSidebar from "../components/HeaderWithSidebar";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function DaNang() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const vnMapRef = useRef(null);
    const daNangMapRef = useRef(null);
    const navigate = useNavigate();
    const restaurantLoaded = useRef(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    const center = [108.2022, 15.8544];
    const zoom = 9;

    const clearMarkers = () => {
        if (map.current?.restaurantMarkers) {
            map.current.restaurantMarkers.forEach(marker => marker.remove());
            map.current.restaurantMarkers = [];
        }
    };

    const loadRestaurants = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/city/1");
            const data = await res.json();
            renderMarkers(data);
            restaurantLoaded.current = true;
        } catch (err) {
            console.error("Lỗi tải nhà hàng:", err);
        }
    };

    const renderMarkers = (data) => {
        clearMarkers();

        const popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 25 });

        data.forEach((place) => {
            const marker = new mapboxgl.Marker({ color: '#ff6347' })
                .setLngLat([place.longitude, place.latitude])
                .addTo(map.current);

            const markerEl = marker.getElement();

            markerEl.addEventListener("mouseenter", () => {
                popup.setLngLat([place.longitude, place.latitude])
                    .setHTML(`<div style="font-size: 14px; padding: 6px 10px;"><strong>${place.name}</strong></div>`)
                    .addTo(map.current);
            });

            markerEl.addEventListener("mouseleave", () => popup.remove());

            markerEl.addEventListener("click", async () => {
                try {
                    const res = await fetch(`http://localhost:8080/api/restaurants/${place.id}`);
                    const data = await res.json();
                    setSelectedRestaurant(data);

                    if (map.current.getLayer("da-nang-border")) {
                        map.current.removeLayer("da-nang-border");
                    }
                } catch (err) {
                    console.error("Lỗi khi lấy chi tiết nhà hàng:", err);
                }
            });

            map.current.restaurantMarkers.push(marker);
        });
    };

    const getPolygonArea = (coords) => {
        let area = 0;
        for (let i = 0; i < coords.length - 1; i++) {
            const [x1, y1] = coords[i];
            const [x2, y2] = coords[i + 1];
            area += x1 * y2 - x2 * y1;
        }
        return Math.abs(area / 2);
    };

    const centroid = (coords) => {
        let x = 0, y = 0;
        coords.forEach(([lng, lat]) => {
            x += lng;
            y += lat;
        });
        return [x / coords.length, y / coords.length];
    };

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
                properties: { name },
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
    };

    useEffect(() => {
        sessionStorage.setItem("cityID", "1");
        if (map.current) return;

        const savedZoom = parseFloat(localStorage.getItem("mapZoom")) || zoom;
        const savedCenter = JSON.parse(localStorage.getItem("mapCenter")) || center;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: savedCenter,
            zoom: Math.max(savedZoom, 9),
            minZoom: 8,
            maxZoom: 15,
        });

        map.current.restaurantMarkers = [];

        map.current.on("load", async () => {
            hideDefaultLabels();
            await loadLayers();
        });

        map.current.on("zoom", () => {
            const z = map.current.getZoom();
            const centerNow = map.current.getCenter();

            if (z <= 8) {
                localStorage.setItem("mapZoom", z);
                localStorage.setItem("mapCenter", JSON.stringify([centerNow.lng, centerNow.lat]));
                navigate("/");
                return;
            }

            if (z >= 11 && !restaurantLoaded.current && !isSearching) {
                loadRestaurants();
                if (map.current.getLayer("da-nang-border")) {
                    map.current.removeLayer("da-nang-border");
                }
            }

            if (z < 11 && restaurantLoaded.current) {
                clearMarkers();
                restaurantLoaded.current = false;
                setSelectedRestaurant(null);

                if (!map.current.getLayer("da-nang-border") && map.current.getSource("da-nang")) {
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
            }
        });
    }, []);

    return (
        <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
            <div ref={mapContainer} style={{ height: "100%", width: "100%", position: "absolute", zIndex: 1 }} />

            <HeaderWithSidebar
                onSearchResults={(results) => {
                    setIsSearching(true);
                    renderMarkers(results);
                }}
                onClearSearch={() => {
                    setIsSearching(false);
                    loadRestaurants();
                }}
                sidebarWidth={600}
                authWidth={200}
            />

            {selectedRestaurant && (
                <div style={{ position: "absolute", top: 0, right: 0, zIndex: 10 }}>
                    <RestaurantDetails
                        restaurant={selectedRestaurant}
                        onClose={() => setSelectedRestaurant(null)}
                        onRatingUpdate={(updatedAvgRating) => {
                            setSelectedRestaurant((prev) =>
                                prev ? { ...prev, rating: updatedAvgRating } : null
                            );
                        }}
                    />
                </div>
            )}
        </div>
    );
}
