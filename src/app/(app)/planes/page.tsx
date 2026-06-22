"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PLANS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const planCards = [
  {
    key: "free",
    name: "Gratis",
    price: 0,
    description: "Para empezar a explorar",
    features: [
      "1 propiedad publicada",
      "3 consultas IA por mes",
      "Acceso al mapa interactivo",
      "Índice de precios básico",
    ],
    popular: false,
  },
  {
    key: "owner_basic",
    name: PLANS.owner_basic.name,
    price: PLANS.owner_basic.priceArs,
    description: "Para propietarios e inmobiliarias",
    features: PLANS.owner_basic.features,
    popular: true,
  },
  {
    key: "owner_pro",
    name: PLANS.owner_pro.name,
    price: PLANS.owner_pro.priceArs,
    description: "Para inmobiliarias grandes",
    features: PLANS.owner_pro.features,
    popular: false,
  },
];

export default function PlanesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-2xl text-center"
      >
        <Badge variant="secondary" className="mb-4 px-4 py-1.5">
          <Sparkles className="mr-1.5 h-3.5 w-3.5" />
          Planes
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Elegí el plan que mejor se adapte
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Empezá gratis y escalá cuando lo necesites
        </p>
      </motion.div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
        {planCards.map((plan, i) => (
          <motion.div
            key={plan.key}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card
              className={cn(
                "relative h-full",
                plan.popular && "border-primary shadow-lg"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="px-3">Más popular</Badge>
                </div>
              )}
              <CardHeader className="text-center">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
                <div className="mt-4">
                  {plan.price === 0 ? (
                    <span className="text-4xl font-bold">Gratis</span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold">
                        ${plan.price.toLocaleString("es-AR")}
                      </span>
                      <span className="text-muted-foreground">/mes</span>
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.price === 0 ? "Comenzar gratis" : "Suscribirse"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mx-auto mt-12 max-w-2xl"
      >
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h3 className="font-semibold">Buscador Pro</h3>
              <p className="text-sm text-muted-foreground">
                Consultas IA ilimitadas + historial completo
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">
                ${PLANS.seeker_pro.priceArs.toLocaleString("es-AR")}
                <span className="text-sm font-normal text-muted-foreground">
                  /mes
                </span>
              </p>
              <Button size="sm" variant="outline" className="mt-2">
                Suscribirse
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
