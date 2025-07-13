import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useNavigate } from "react-router-dom";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function DaNang() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const popupRef = useRef(new mapboxgl.Popup({ closeButton: false, closeOnClick: false }));
    const vnMapRef = useRef(null);
    const daNangMapRef = useRef(null);
    const navigate = useNavigate();

    const center = [108.2022, 15.5544];
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
        map.current.on("mousemove", "da-nang-fill", (e) => {
            const zoom = map.current.getZoom();

            if (zoom >= 11) {
                popupRef.current.remove();
                return;
            }

            const name = e.features[0].properties.NAME_2 || e.features[0].properties.NAME_1;
            popupRef.current
                .setLngLat(e.lngLat)
                .setOffset([0, -20])
                .setHTML(`<div style="font-weight:bold; padding:4px 8px">${name}</div>`)
                .addTo(map.current);
        });

        map.current.on("mouseleave", "da-nang-fill", () => {
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
            if (z < 9) {
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

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/navigation-day-v1",
            center,
            zoom,
            minZoom: 8,
            maxZoom: 15,
        });

        map.current.on("load", () => {
            hideDefaultLabels();
            loadLayers();
        });
    }, []);

    return (
        <div className="fixed top-0 left-0 w-screen h-screen overflow-hidden">
            <div ref={mapContainer} className="w-full h-full" />
        </div>
    );
}
