"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon, DivIcon } from "leaflet";
import { useEffect } from "react";
import { POSADAS_CENTER } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
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

function createPriceIcon(price: string, currency: string) {
  const label = currency === "USD" ? `US$ ${price}` : `$ ${price}`;
  return new DivIcon({
    className: "custom-price-marker",
    html: `<div style="
      background: white;
      border: 2px solid hsl(220, 70%, 50%);
      border-radius: 8px;
      padding: 4px 8px;
      font-size: 11px;
      font-weight: 700;
      color: hsl(220, 70%, 40%);
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      transform: translate(-50%, -100%);
    ">${label}</div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [0, -30],
  });
}

interface MapProperty {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  price: string;
  currency: string;
  type: string;
  operation: string;
  address?: string | null;
  totalAreaM2?: string | null;
  bedrooms?: number | null;
  images?: Array<{ url: string; isPrimary: boolean }>;
}

interface PropertyMapProps {
  properties?: MapProperty[];
}

function FitBounds({ properties }: { properties: MapProperty[] }) {
  const map = useMap();

  useEffect(() => {
    if (properties.length === 0) return;
    if (properties.length === 1) {
      map.setView([properties[0].latitude, properties[0].longitude], 15);
      return;
    }
    const bounds = properties.map(
      (p) => [p.latitude, p.longitude] as [number, number]
    );
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [map, properties]);

  return null;
}

export function PropertyMap({ properties = [] }: PropertyMapProps) {
  return (
    <MapContainer
      center={[POSADAS_CENTER.lat, POSADAS_CENTER.lng]}
      zoom={POSADAS_CENTER.zoom}
      className="h-full w-full"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {properties.length > 0 && <FitBounds properties={properties} />}

      {properties.map((property) => {
        const shortPrice = formatShortPrice(property.price);
        const icon = shortPrice
          ? createPriceIcon(shortPrice, property.currency)
          : defaultIcon;

        return (
          <Marker
            key={property.id}
            position={[property.latitude, property.longitude]}
            icon={icon}
          >
            <Popup>
              <div className="min-w-[220px] max-w-[260px]">
                {property.images?.[0] && (
                  <div className="mb-2 h-28 w-full overflow-hidden rounded-lg">
                    <img
                      src={property.images[0].url}
                      alt={property.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <h3 className="line-clamp-2 text-sm font-semibold leading-tight">
                  {property.title}
                </h3>
                <p className="mt-1 text-base font-bold text-blue-600">
                  {formatPrice(property.price, property.currency)}
                </p>
                <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                  {property.bedrooms != null && (
                    <span>{property.bedrooms} dorm.</span>
                  )}
                  {property.totalAreaM2 && (
                    <span>{property.totalAreaM2} m²</span>
                  )}
                </div>
                {property.address && (
                  <p className="mt-1 text-xs text-gray-400">{property.address}</p>
                )}
                <a
                  href={`/propiedades/${property.id}`}
                  className="mt-2 block rounded-md bg-blue-600 px-3 py-1.5 text-center text-xs font-medium text-white hover:bg-blue-700"
                >
                  Ver detalle
                </a>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

function formatShortPrice(price: string | null): string | null {
  if (!price) return null;
  const num = parseFloat(price);
  if (isNaN(num)) return null;
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${Math.round(num / 1000)}K`;
  return num.toString();
}
