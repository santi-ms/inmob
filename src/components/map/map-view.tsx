"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { motion } from "framer-motion";
import { Filter, List, Map as MapIcon, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { PROPERTY_TYPES, PROPERTY_OPERATIONS } from "@/lib/constants";

const PropertyMap = dynamic(
  () => import("./map-container").then((mod) => mod.PropertyMap),
  {
    ssr: false,
    loading: () => (
      <Skeleton className="h-full w-full rounded-xl" />
    ),
  }
);

export function MapView() {
  const [view, setView] = useState<"map" | "list">("map");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-[calc(100vh-4rem)] flex-col"
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b bg-background px-4 py-3">
        <div className="flex items-center gap-2">
          <Select>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PROPERTY_TYPES).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Operación" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PROPERTY_OPERATIONS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" className="hidden sm:flex">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>

          <Badge variant="secondary" className="hidden sm:flex">
            0 resultados
          </Badge>
        </div>

        <div className="flex items-center gap-1 rounded-lg border bg-muted p-1">
          <Button
            variant={view === "map" ? "default" : "ghost"}
            size="sm"
            className="h-8 gap-1.5"
            onClick={() => setView("map")}
          >
            <MapIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Mapa</span>
          </Button>
          <Button
            variant={view === "list" ? "default" : "ghost"}
            size="sm"
            className="h-8 gap-1.5"
            onClick={() => setView("list")}
          >
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">Lista</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {view === "map" ? (
          <PropertyMap />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Filter className="mx-auto mb-3 h-12 w-12 opacity-30" />
              <p className="text-lg font-medium">Sin propiedades aún</p>
              <p className="text-sm">
                Las propiedades aparecerán aquí cuando se carguen
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
