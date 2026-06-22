import type { Metadata } from "next";
import { MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Asistente IA",
  description: "Consultá con nuestro asistente inmobiliario inteligente",
};

export default function ChatPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <MessageSquare className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Asistente IA</h1>
          <p className="text-sm text-muted-foreground">
            Preguntá sobre propiedades, barrios y precios
          </p>
        </div>
      </div>
      <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-20 text-center">
        <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground/30" />
        <p className="text-lg font-medium text-muted-foreground">
          Próximamente
        </p>
        <p className="text-sm text-muted-foreground">
          El chatbot IA se implementará en la Fase 4
        </p>
      </div>
    </div>
  );
}
