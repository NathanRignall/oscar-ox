"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

type point = {
  title: string;
  latitude: number;
  longitude: number;
};

type center = [number, number];

export type MapProps = {
  points: point[];
  center?: center;
  zoom?: number;
};

export default function Map({ points, center, zoom }: MapProps) {
  const myIcon = new L.Icon({
    iconRetinaUrl: "/leaflet/images/marker-icon-2x.png",
    iconUrl: "/leaflet/images/marker-icon.png",
    popupAnchor: [-0, -0],
    iconSize: [32, 45],
  });

  return (
    <MapContainer
      center={center || [51.752, -1.2577]}
      zoom={zoom || 13}
      className="w-full h-full"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {points.map((point, index) => (
        <Marker
          key={index}
          position={[point.latitude, point.longitude]}
          icon={myIcon}
        >
          <Popup>{point.title}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
