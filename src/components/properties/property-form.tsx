"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Building2,
  DollarSign,
  MapPin,
  Ruler,
  Upload,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROPERTY_TYPES, PROPERTY_OPERATIONS } from "@/lib/constants";

interface Zone {
  id: number;
  name: string;
}

interface PropertyFormProps {
  zones: Zone[];
  initialData?: Record<string, any>;
  propertyId?: string;
}

const AMENITIES_OPTIONS = [
  "Pileta",
  "Parrilla",
  "Cochera",
  "Seguridad 24hs",
  "Gimnasio",
  "Balcón",
  "Terraza",
  "Jardín",
  "Aire acondicionado",
  "Calefacción",
  "Lavadero",
  "SUM",
];

export function PropertyForm({ zones, initialData, propertyId }: PropertyFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>(
    initialData?.amenities || []
  );

  const isEditing = !!propertyId;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(
      (f) => f.type.startsWith("image/") && f.size < 5 * 1024 * 1024
    );
    setImages((prev) => [...prev, ...validFiles]);
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const body = {
      title: formData.get("title"),
      description: formData.get("description"),
      type: formData.get("type"),
      operation: formData.get("operation"),
      zoneId: formData.get("zoneId") ? parseInt(formData.get("zoneId") as string) : null,
      currency: formData.get("currency"),
      priceUsd: formData.get("priceUsd") ? parseFloat(formData.get("priceUsd") as string) : null,
      priceArs: formData.get("priceArs") ? parseFloat(formData.get("priceArs") as string) : null,
      expenses: formData.get("expenses") ? parseFloat(formData.get("expenses") as string) : null,
      address: formData.get("address"),
      latitude: formData.get("latitude") ? parseFloat(formData.get("latitude") as string) : null,
      longitude: formData.get("longitude") ? parseFloat(formData.get("longitude") as string) : null,
      totalAreaM2: formData.get("totalAreaM2") ? parseFloat(formData.get("totalAreaM2") as string) : null,
      coveredAreaM2: formData.get("coveredAreaM2") ? parseFloat(formData.get("coveredAreaM2") as string) : null,
      bedrooms: formData.get("bedrooms") ? parseInt(formData.get("bedrooms") as string) : null,
      bathrooms: formData.get("bathrooms") ? parseInt(formData.get("bathrooms") as string) : null,
      garages: formData.get("garages") ? parseInt(formData.get("garages") as string) : null,
      floors: formData.get("floors") ? parseInt(formData.get("floors") as string) : null,
      yearBuilt: formData.get("yearBuilt") ? parseInt(formData.get("yearBuilt") as string) : null,
      amenities,
    };

    try {
      const url = isEditing ? `/api/properties/${propertyId}` : "/api/properties";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al guardar");
      }

      const { data } = await res.json();
      const propId = isEditing ? propertyId : data.id;

      if (images.length > 0) {
        const imgForm = new FormData();
        imgForm.append("propertyId", propId);
        images.forEach((file) => imgForm.append("files", file));

        await fetch("/api/upload", {
          method: "POST",
          body: imgForm,
        });
      }

      router.push(`/propiedades/${propId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  const toggleAmenity = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Basic info */}
      <section className="space-y-4 rounded-2xl border bg-card p-6">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Building2 className="h-5 w-5 text-primary" />
          Información básica
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              name="title"
              defaultValue={initialData?.title}
              placeholder="Ej: Departamento 2 ambientes en Centro"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={initialData?.description}
              placeholder="Describí la propiedad..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <Label>Tipo *</Label>
              <Select name="type" defaultValue={initialData?.type || ""} required>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PROPERTY_TYPES).map(([val, label]) => (
                    <SelectItem key={val} value={val}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Operación *</Label>
              <Select name="operation" defaultValue={initialData?.operation || ""} required>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PROPERTY_OPERATIONS).map(([val, label]) => (
                    <SelectItem key={val} value={val}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Zona</Label>
              <Select name="zoneId" defaultValue={initialData?.zoneId?.toString() || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar zona" />
                </SelectTrigger>
                <SelectContent>
                  {zones.map((zone) => (
                    <SelectItem key={zone.id} value={zone.id.toString()}>
                      {zone.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="space-y-4 rounded-2xl border bg-card p-6">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <DollarSign className="h-5 w-5 text-primary" />
          Precio
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <Label>Moneda</Label>
            <Select name="currency" defaultValue={initialData?.currency || "USD"}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">Dólares (USD)</SelectItem>
                <SelectItem value="ARS">Pesos (ARS)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="priceUsd">Precio USD</Label>
            <Input
              id="priceUsd"
              name="priceUsd"
              type="number"
              defaultValue={initialData?.priceUsd}
              placeholder="150000"
            />
          </div>

          <div>
            <Label htmlFor="priceArs">Precio ARS</Label>
            <Input
              id="priceArs"
              name="priceArs"
              type="number"
              defaultValue={initialData?.priceArs}
              placeholder="50000000"
            />
          </div>

          <div>
            <Label htmlFor="expenses">Expensas (ARS)</Label>
            <Input
              id="expenses"
              name="expenses"
              type="number"
              defaultValue={initialData?.expenses}
              placeholder="25000"
            />
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="space-y-4 rounded-2xl border bg-card p-6">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <MapPin className="h-5 w-5 text-primary" />
          Ubicación
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              name="address"
              defaultValue={initialData?.address}
              placeholder="Av. Corrientes 1234"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude">Latitud</Label>
              <Input
                id="latitude"
                name="latitude"
                type="number"
                step="any"
                defaultValue={initialData?.latitude}
                placeholder="-27.3671"
              />
            </div>
            <div>
              <Label htmlFor="longitude">Longitud</Label>
              <Input
                id="longitude"
                name="longitude"
                type="number"
                step="any"
                defaultValue={initialData?.longitude}
                placeholder="-55.8961"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="space-y-4 rounded-2xl border bg-card p-6">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Ruler className="h-5 w-5 text-primary" />
          Características
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <Label htmlFor="totalAreaM2">Superficie total (m²)</Label>
            <Input
              id="totalAreaM2"
              name="totalAreaM2"
              type="number"
              defaultValue={initialData?.totalAreaM2}
            />
          </div>
          <div>
            <Label htmlFor="coveredAreaM2">Superficie cubierta (m²)</Label>
            <Input
              id="coveredAreaM2"
              name="coveredAreaM2"
              type="number"
              defaultValue={initialData?.coveredAreaM2}
            />
          </div>
          <div>
            <Label htmlFor="bedrooms">Dormitorios</Label>
            <Input
              id="bedrooms"
              name="bedrooms"
              type="number"
              defaultValue={initialData?.bedrooms}
            />
          </div>
          <div>
            <Label htmlFor="bathrooms">Baños</Label>
            <Input
              id="bathrooms"
              name="bathrooms"
              type="number"
              defaultValue={initialData?.bathrooms}
            />
          </div>
          <div>
            <Label htmlFor="garages">Cocheras</Label>
            <Input
              id="garages"
              name="garages"
              type="number"
              defaultValue={initialData?.garages}
            />
          </div>
          <div>
            <Label htmlFor="floors">Pisos</Label>
            <Input
              id="floors"
              name="floors"
              type="number"
              defaultValue={initialData?.floors}
            />
          </div>
          <div>
            <Label htmlFor="yearBuilt">Año de construcción</Label>
            <Input
              id="yearBuilt"
              name="yearBuilt"
              type="number"
              defaultValue={initialData?.yearBuilt}
            />
          </div>
        </div>

        {/* Amenities */}
        <div>
          <Label className="mb-2 block">Amenidades</Label>
          <div className="flex flex-wrap gap-2">
            {AMENITIES_OPTIONS.map((amenity) => (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  amenities.includes(amenity)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {amenity}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Images */}
      <section className="space-y-4 rounded-2xl border bg-card p-6">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Upload className="h-5 w-5 text-primary" />
          Imágenes
        </div>

        <div className="space-y-4">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors hover:border-primary/50 hover:bg-muted/50">
            <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">Click para subir imágenes</p>
            <p className="text-xs text-muted-foreground">
              JPG, PNG o WebP. Máximo 5MB por imagen.
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {previews.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {previews.map((preview, idx) => (
                <div key={idx} className="group relative aspect-square overflow-hidden rounded-xl">
                  <img
                    src={preview}
                    alt={`Preview ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute right-2 top-2 rounded-full bg-black/50 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-2 left-2 rounded-full bg-primary px-2 py-0.5 text-xs text-white">
                      Principal
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading} className="min-w-[140px]">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isEditing ? (
            "Guardar cambios"
          ) : (
            "Publicar propiedad"
          )}
        </Button>
      </div>
    </motion.form>
  );
}
