// src/pages/MapDebug.jsx
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function MapDebug() {
  const mapRef = useRef();

  useEffect(() => {
    new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [105.854444, 21.028511],
      zoom: 5,
    });
  }, []);

  return <div ref={mapRef} style={{ height: "100vh", width: "100vw" }} />;
}
