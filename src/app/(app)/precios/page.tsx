import type { Metadata } from "next";
import { TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Índice de precios",
  description: "Índice de precios inmobiliarios por zona en Posadas",
};

export default function PreciosPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Índice de precios</h1>
          <p className="text-sm text-muted-foreground">
            Precio promedio por m² en cada zona de Posadas
          </p>
        </div>
      </div>
      <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-20 text-center">
        <TrendingUp className="mb-4 h-12 w-12 text-muted-foreground/30" />
        <p className="text-lg font-medium text-muted-foreground">
          Próximamente
        </p>
        <p className="text-sm text-muted-foreground">
          El índice de precios se implementará en la Fase 4
        </p>
      </div>
    </div>
  );
}
