"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Map,
  TrendingUp,
  MessageSquare,
  Search,
  ArrowRight,
  Building2,
  MapPin,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const features = [
  {
    icon: Map,
    title: "Mapa interactivo",
    description:
      "Explorá propiedades directamente en el mapa de Posadas. Filtrá por zona, precio y tipo.",
  },
  {
    icon: TrendingUp,
    title: "Índice de precios",
    description:
      "Sabé si un precio conviene o está alto comparado con el mercado de la zona.",
  },
  {
    icon: MessageSquare,
    title: "Asistente IA",
    description:
      "Consultá con nuestro asistente inteligente sobre propiedades, barrios y tendencias.",
  },
  {
    icon: Sparkles,
    title: "Recomendaciones",
    description:
      "Recibí sugerencias de propiedades similares con mejor relación precio-calidad.",
  },
  {
    icon: Shield,
    title: "Datos verificados",
    description:
      "Información actualizada de múltiples fuentes, cruzada y verificada automáticamente.",
  },
  {
    icon: Zap,
    title: "Búsqueda inteligente",
    description:
      "Filtrá por precio, ubicación, metros cuadrados, ambientes y más en segundos.",
  },
];

const stats = [
  { value: "500+", label: "Propiedades" },
  { value: "15", label: "Barrios" },
  { value: "24/7", label: "IA disponible" },
  { value: "Gratis", label: "Para empezar" },
];

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
            <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />
          </div>

          <div className="mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pt-28 lg:px-8 lg:pt-32">
            <div className="mx-auto max-w-3xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge
                  variant="secondary"
                  className="mb-6 px-4 py-1.5 text-sm"
                >
                  <MapPin className="mr-1.5 h-3.5 w-3.5" />
                  Posadas, Misiones
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
              >
                Encontrá tu propiedad ideal{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  con inteligencia artificial
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6 text-lg text-muted-foreground sm:text-xl"
              >
                Explorá propiedades en el mapa, compará precios con nuestro
                índice inteligente y recibí recomendaciones personalizadas.
                Todo en un solo lugar.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
              >
                <Button size="lg" className="w-full gap-2 text-base sm:w-auto" render={<Link href="/mapa" />}>
                  <Map className="h-5 w-5" />
                  Explorar el mapa
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full gap-2 text-base sm:w-auto"
                  render={<Link href="/propiedades" />}
                >
                  <Search className="h-5 w-5" />
                  Buscar propiedades
                </Button>
              </motion.div>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mx-auto mt-20 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4"
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border bg-card p-4 text-center"
                >
                  <div className="text-2xl font-bold text-primary sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t bg-muted/30 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="mx-auto max-w-2xl text-center"
            >
              <motion.h2
                variants={fadeUp}
                custom={0}
                className="text-3xl font-bold tracking-tight sm:text-4xl"
              >
                Todo lo que necesitás para encontrar tu lugar
              </motion.h2>
              <motion.p
                variants={fadeUp}
                custom={1}
                className="mt-4 text-lg text-muted-foreground"
              >
                Herramientas inteligentes que te ayudan a tomar la mejor
                decisión inmobiliaria.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {features.map((feature, i) => (
                <motion.div key={feature.title} variants={fadeUp} custom={i + 2}>
                  <Card className="group relative h-full overflow-hidden transition-shadow hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <feature.icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-semibold">{feature.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center text-primary-foreground sm:px-16 sm:py-20"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15),transparent_60%)]" />
              <div className="relative">
                <Building2 className="mx-auto mb-6 h-12 w-12 opacity-80" />
                <h2 className="text-3xl font-bold sm:text-4xl">
                  ¿Tenés una propiedad para publicar?
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-lg opacity-90">
                  Publicá tu primera propiedad gratis y llegá a miles de
                  posibles compradores e inquilinos en Posadas.
                </p>
                <Button
                  size="lg"
                  variant="secondary"
                  className="mt-8 gap-2 text-base"
                  render={<Link href="/register" />}
                >
                  Publicar gratis
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
