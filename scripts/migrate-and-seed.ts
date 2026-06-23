import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { config } from "dotenv";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

async function migrate() {
  console.log("Ejecutando migración via HTTP...");

  const migrationSql = readFileSync("drizzle/0000_vengeful_the_enforcers.sql", "utf-8");

  const statements = migrationSql
    .split("--> statement-breakpoint")
    .map((s) => s.trim())
    .filter(Boolean);

  console.log(`${statements.length} statements a ejecutar`);

  for (let i = 0; i < statements.length; i++) {
    try {
      await sql.query(statements[i]);
      console.log(`✓ Statement ${i + 1}/${statements.length}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("already exists")) {
        console.log(`⊘ Statement ${i + 1}/${statements.length} (ya existe, skip)`);
      } else {
        console.error(`✗ Statement ${i + 1}: ${msg}`);
        console.error(`  SQL: ${statements[i].slice(0, 100)}...`);
        throw err;
      }
    }
  }

  console.log("\n✓ Migración completada!");

  // Seed zones
  console.log("\nSeeding zonas de Posadas...");

  const zones = [
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

  for (const zone of zones) {
    try {
      await sql`INSERT INTO zones (name, slug) VALUES (${zone.name}, ${zone.slug}) ON CONFLICT (slug) DO NOTHING`;
      console.log(`  ✓ ${zone.name}`);
    } catch (err) {
      console.error(`  ✗ ${zone.name}: ${err instanceof Error ? err.message : err}`);
    }
  }

  console.log(`\n✓ ${zones.length} zonas procesadas!`);
}

migrate().catch((err) => {
  console.error("Error fatal:", err);
  process.exit(1);
});
