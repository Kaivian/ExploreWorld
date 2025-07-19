import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

function getPolygonCenter(geometry) {
    let coords = [];

    if (geometry.type === "Polygon") {
        coords = geometry.coordinates[0];
    } else if (geometry.type === "MultiPolygon") {
        coords = geometry.coordinates[0][0];
    }

    let x = 0, y = 0;
    for (const [lng, lat] of coords) {
        x += lng;
        y += lat;
    }

    const len = coords.length;
    return [x / len, y / len];
}

export default function VietnamMap() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const popupRef = useRef(new mapboxgl.Popup({ closeButton: false, closeOnClick: false }));
    const hiddenLabels = useRef([]);
    const styleSwitched = useRef(false);
    const provinceBorderAdded = useRef(false);
    const provinceLabelAdded = useRef(false);
    const geojsonRef = useRef(null);
    const navigate = useNavigate();

    const ensureVietnamTitleOnTop = () => {
        if (!map.current.getLayer("vn-title-label")) return;

        const layers = map.current.getStyle().layers;
        if (!layers) return;

        const topSymbolLayer = [...layers]
            .reverse()
            .find(l => l.type === "symbol" && l.id !== "vn-title-label");

        if (topSymbolLayer) {
            map.current.moveLayer("vn-title-label", topSymbolLayer.id);
        }
    };

    const addGrayCountriesLayer = () => {
        if (!map.current.getSource("country-boundaries")) {
            map.current.addSource("country-boundaries", {
                type: "vector",
                url: "mapbox://mapbox.country-boundaries-v1",
            });
        }

        if (!map.current.getLayer("gray-other-countries")) {
            map.current.addLayer({
                id: "gray-other-countries",
                type: "fill",
                source: "country-boundaries",
                "source-layer": "country_boundaries",
                paint: {
                    "fill-color": "#cccccc",
                    "fill-opacity": 0.9,
                },
                filter: ["!=", ["get", "iso_3166_1_alpha_3"], "VNM"],
            });
        }

        ensureVietnamTitleOnTop();
    };

    const hideLabels = () => {
        const layers = map.current.getStyle().layers;
        hiddenLabels.current = [];

        layers.forEach((layer) => {
            if (layer.type === "symbol") {
                const id = layer.id;
                map.current.setLayoutProperty(id, "visibility", "none");
                hiddenLabels.current.push(id);
            }
        });
    };

    const addVietnamTitleLabel = () => {
        // Nếu đã có, xóa đi rồi thêm lại sau cùng
        if (map.current.getLayer("vn-title-label")) {
            map.current.removeLayer("vn-title-label");
        }
        if (map.current.getSource("vn-title")) {
            map.current.removeSource("vn-title");
        }

        map.current.addSource("vn-title", {
            type: "geojson",
            data: {
                type: "FeatureCollection",
                features: [
                    {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: [105.854444, 21.028511],
                        },
                        properties: {
                            title: "Việt Nam",
                        },
                    },
                ],
            },
        });

        map.current.addLayer({
            id: "vn-title-label",
            type: "symbol",
            source: "vn-title",
            layout: {
                "text-field": ["get", "title"],
                "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
                "text-size": 24,
                "text-anchor": "center",
                "text-allow-overlap": true,
                "text-ignore-placement": true,
            },
            paint: {
                "text-color": "#000000",
                "text-halo-color": "#ffffff",
                "text-halo-width": 2,
            },
        });
    };


    const removeVietnamTitleLabel = () => {
        if (map.current.getLayer("vn-title-label")) {
            map.current.removeLayer("vn-title-label");
        }
        if (map.current.getSource("vn-title")) {
            map.current.removeSource("vn-title");
        }
    };

    const addVietnamProvinceLabels = async () => {
        if (map.current.getSource("vn-label-centroids")) return;
        if (map.current.getLayer("vn-province-labels")) {
            map.current.removeLayer("vn-province-labels");
        }

        if (!geojsonRef.current) {
            const response = await fetch("/data/VN-MAP.json");
            geojsonRef.current = await response.json();
        }

        const centroidFeatures = geojsonRef.current.features.map((feature) => {
            const coordinates = getPolygonCenter(feature.geometry);
            return {
                type: "Feature",
                geometry: { type: "Point", coordinates },
                properties: { name: feature.properties.NAME_1 },
            };
        });

        try {
            map.current.addSource("vn-label-centroids", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: centroidFeatures,
                },
            });
        } catch (err) {
            return;
        }

        map.current.addLayer({
            id: "vn-province-labels",
            type: "symbol",
            source: "vn-label-centroids",
            layout: {
                "text-field": ["get", "name"],
                "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
                "text-size": 14,
                "text-anchor": "center",
                "text-allow-overlap": true,
            },
            paint: {
                "text-color": "#444444",
                "text-halo-color": "#ffffff",
                "text-halo-width": 1.2,
            },
        });

        provinceLabelAdded.current = true;
        ensureVietnamTitleOnTop();
    };

    const removeVietnamProvinceLabels = () => {
        if (!provinceLabelAdded.current) return;

        if (map.current.getLayer("vn-province-labels")) {
            map.current.removeLayer("vn-province-labels");
        }

        if (map.current.getSource("vn-label-centroids")) {
            map.current.removeSource("vn-label-centroids");
        }

        provinceLabelAdded.current = false;
    };

    const addVietnamProvinceBorders = async () => {
        if (!geojsonRef.current) {
            const response = await fetch("/data/VN-MAP.json");
            geojsonRef.current = await response.json();
        }

        const data = geojsonRef.current;

        if (!map.current.getSource("vn-provinces")) {
            map.current.addSource("vn-provinces", {
                type: "geojson",
                data,
            });
        } else {
            map.current.getSource("vn-provinces").setData(data);
        }

        if (!map.current.getLayer("vn-province-fill-base")) {
            map.current.addLayer({
                id: "vn-province-fill-base",
                type: "fill",
                source: "vn-provinces",
                paint: {
                    "fill-color": "#ffffff",
                    "fill-opacity": 0.0,
                },
            });
        }

        if (!map.current.getLayer("vn-province-hover")) {
            map.current.addLayer({
                id: "vn-province-hover",
                type: "fill",
                source: "vn-provinces",
                paint: {
                    "fill-color": "#999999",
                    "fill-opacity": 0.4,
                },
                filter: ["==", "GID_1", ""],
            });
        }

        if (!map.current.getLayer("vn-province-border")) {
            map.current.addLayer({
                id: "vn-province-border",
                type: "line",
                source: "vn-provinces",
                paint: {
                    "line-color": "#1e90ff",
                    "line-width": 2,
                },
            });
        }

        map.current.on("mousemove", "vn-province-fill-base", (e) => {
            const feature = e.features[0];
            const gid = feature.properties.GID_1;
            const name = feature.properties.NAME_1;
            map.current.setFilter("vn-province-hover", ["==", "GID_1", gid]);

            popupRef.current
                .setLngLat(e.lngLat)
                .setOffset([0, -20])
                .setHTML(`<div style="font-weight:bold; padding:4px 8px">${name}</div>`)
                .addTo(map.current);
        });

        map.current.on("mouseleave", "vn-province-fill-base", () => {
            map.current.setFilter("vn-province-hover", ["==", "GID_1", ""]);
            popupRef.current.remove();
        });

        provinceBorderAdded.current = true;
        ensureVietnamTitleOnTop();
    };

    const removeVietnamProvinceBorders = () => {
        const layersToRemove = [
            "vn-province-fill-base",
            "vn-province-hover",
            "vn-province-border"
        ];

        layersToRemove.forEach((layerId) => {
            if (map.current.getLayer(layerId)) {
                map.current.removeLayer(layerId);
            }
        });

        if (map.current.getSource("vn-provinces")) {
            map.current.removeSource("vn-provinces");
        }

        provinceBorderAdded.current = false;
    };

    const handleZoom = () => {
        const zoom = map.current.getZoom();

        if (zoom >= 6 && !provinceLabelAdded.current) {
            addVietnamProvinceLabels();
            removeVietnamTitleLabel();
        }

        if (zoom < 6 && provinceLabelAdded.current) {
            removeVietnamProvinceLabels();
            addVietnamTitleLabel();
        }

        if (zoom >= 7 && !styleSwitched.current) {
            styleSwitched.current = true;
            addVietnamProvinceBorders();
        }

        if (zoom < 7 && styleSwitched.current) {
            styleSwitched.current = false;
            provinceBorderAdded.current = false;
            removeVietnamProvinceBorders();
        }

        if (styleSwitched.current && zoom >= 7) {
            addVietnamProvinceBorders();
        }
    };

    function waitForMapLoad(map) {
        return new Promise(resolve => {
            if (map.loaded()) {
                resolve();
            } else {
                map.once("load", () => resolve());
            }
        });
    }

    function waitForStyleLoad(map) {
        return new Promise(resolve => {
            map.once("style.load", () => resolve());
        });
    }

    useEffect(() => {
        sessionStorage.setItem("city", "Việt Nam");
        if (map.current) return;

        const initMap = async () => {
            const isFirstVisit = localStorage.getItem("firstVisit") !== "false";
            const savedCenter = JSON.parse(localStorage.getItem("mapCenter")) || [108.2772, 16.0583];
            const savedZoom = parseFloat(localStorage.getItem("mapZoom")) || (isFirstVisit ? 0 : 5);

            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: "mapbox://styles/mapbox/outdoors-v12",
                center: savedCenter,
                zoom: savedZoom,
                maxZoom: 9,
            });

            // Dọn dẹp localStorage nếu có
            localStorage.removeItem("mapCenter");
            localStorage.removeItem("mapZoom");

            await waitForMapLoad(map.current);

            addGrayCountriesLayer();
            hideLabels();
            addVietnamTitleLabel();

            // 👉 Chỉ flyTo khi lần đầu
            if (isFirstVisit) {
                map.current.flyTo({
                    zoom: 5,
                    duration: 4000,
                    essential: true,
                    center: [108.2772, 16.0583],
                });
                localStorage.setItem("firstVisit", "false");
            }

            addGrayCountriesLayer();
            hideLabels();
            addVietnamTitleLabel();

            map.current.on("idle", () => {
                const layersNeeded = [
                    "gray-other-countries",
                    "vn-title-label",
                    provinceLabelAdded.current ? "vn-province-labels" : null,
                    provinceBorderAdded.current ? "vn-province-border" : null,
                ].filter(Boolean);

                const allLoaded = layersNeeded.every(layerId => map.current.getLayer(layerId));
                if (allLoaded) {
                    ensureVietnamTitleOnTop();
                }
            });

            map.current.on("zoom", handleZoom);

            map.current.on("style.load", async () => {
                await waitForStyleLoad(map.current);

                addGrayCountriesLayer();
                hideLabels();

                provinceBorderAdded.current = false;
                provinceLabelAdded.current = false;

                const zoom = map.current.getZoom();

                if (zoom >= 6 && zoom < 7) {
                    await addVietnamProvinceLabels();
                    removeVietnamTitleLabel();
                } else if (zoom < 6) {
                    addVietnamTitleLabel();
                }

                if (zoom >= 7) {
                    styleSwitched.current = true;
                    await addVietnamProvinceBorders();
                }

                // Đảm bảo nhãn Việt Nam luôn hiện sau cùng
                if (!map.current.getLayer("vn-title-label")) {
                    addVietnamTitleLabel();
                } else {
                    ensureVietnamTitleOnTop();
                }
            });

            map.current.on("click", "vn-province-fill-base", (e) => {
                if (!e.features.length) return;
                const feature = e.features[0];
                const name = feature.properties.NAME_1;

                if (name.includes("Thành phố Đà Nẵng")) {
                    const zoom = map.current.getZoom();
                    const center = map.current.getCenter();
                    localStorage.setItem("mapZoom", zoom);
                    localStorage.setItem("mapCenter", JSON.stringify([center.lng, center.lat]));

                    navigate("/da-nang");
                }
            });
        };

        initMap();
    }, []);

    return <div ref={mapContainer} style={{ height: "100vh", width: "100vw" }} />;
}