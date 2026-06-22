import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { zones } from "../src/lib/db/schema";
import { config } from "dotenv";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const posdasZones = [
  { name: "Centro", slug: "centro" },
  { name: "Villa Sarita", slug: "villa-sarita" },
  { name: "Miguel Lanús", slug: "miguel-lanus" },
  { name: "Itaembé Miní", slug: "itaembe-mini" },
  { name: "Itaembé Guazú", slug: "itaembe-guazu" },
  { name: "Villa Cabello", slug: "villa-cabello" },
  { name: "A-4", slug: "a-4" },
  { name: "Villa Blosset", slug: "villa-blosset" },
  { name: "Villa Urquiza", slug: "villa-urquiza" },
  { name: "Bajada Vieja", slug: "bajada-vieja" },
  { name: "El Palomar", slug: "el-palomar" },
  { name: "Nemesio Parma", slug: "nemesio-parma" },
  { name: "San Isidro", slug: "san-isidro" },
  { name: "Yohasá", slug: "yohasa" },
  { name: "Cocomarola", slug: "cocomarola" },
  { name: "Palma Sola", slug: "palma-sola" },
  { name: "San Jorge", slug: "san-jorge" },
  { name: "Los Aguacates", slug: "los-aguacates" },
  { name: "Villa Poujade", slug: "villa-poujade" },
  { name: "Lomas del Paraná", slug: "lomas-del-parana" },
];

async function seed() {
  console.log("Seeding zonas de Posadas...");

  for (const zone of posdasZones) {
    await db
      .insert(zones)
      .values(zone)
      .onConflictDoNothing({ target: zones.slug });
  }

  console.log(`${posdasZones.length} zonas insertadas.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Error seeding:", err);
  process.exit(1);
});
