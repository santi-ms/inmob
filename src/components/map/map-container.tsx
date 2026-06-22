"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { POSADAS_CENTER } from "@/lib/constants";
import "leaflet/dist/leaflet.css";

const defaultIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapProperty {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  price: string;
  currency: string;
  type: string;
  operation: string;
}

interface PropertyMapProps {
  properties?: MapProperty[];
}

export function PropertyMap({ properties = [] }: PropertyMapProps) {
  return (
    <MapContainer
      center={[POSADAS_CENTER.lat, POSADAS_CENTER.lng]}
      zoom={POSADAS_CENTER.zoom}
      className="h-full w-full rounded-xl"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {properties.map((property) => (
        <Marker
          key={property.id}
          position={[property.latitude, property.longitude]}
          icon={defaultIcon}
        >
          <Popup>
            <div className="min-w-[200px]">
              <h3 className="font-semibold text-sm">{property.title}</h3>
              <p className="text-primary font-bold mt-1">
                {property.currency === "USD" ? "US$ " : "$ "}
                {property.price}
              </p>
              <p className="text-xs text-muted-foreground mt-1 capitalize">
                {property.type} en {property.operation}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
