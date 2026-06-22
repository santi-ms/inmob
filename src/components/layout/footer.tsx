import Link from "next/link";
import { Home } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Home className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">{APP_NAME}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Encontrá tu propiedad ideal en Posadas con inteligencia
              artificial.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Explorar</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/mapa" className="hover:text-foreground transition-colors">
                  Mapa
                </Link>
              </li>
              <li>
                <Link href="/propiedades" className="hover:text-foreground transition-colors">
                  Propiedades
                </Link>
              </li>
              <li>
                <Link href="/precios" className="hover:text-foreground transition-colors">
                  Índice de precios
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Publicar</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/register" className="hover:text-foreground transition-colors">
                  Registrarse
                </Link>
              </li>
              <li>
                <Link href="/planes" className="hover:text-foreground transition-colors">
                  Planes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">
                  Términos de uso
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">
                  Privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {APP_NAME}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
