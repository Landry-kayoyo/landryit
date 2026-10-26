import postgres from "postgres";
import fs from "fs";

let connectionString = process.env.LOVABLE_DB_MIGRATION_URL;
try {
  const raw = fs.readFileSync(".env", "utf-8");
  for (const line of raw.split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim().replace(/^["']|["']$/g, "");
      if (key === "LOVABLE_DB_MIGRATION_URL") connectionString = val;
    }
  }
} catch (e) {}

if (!connectionString) {
  console.log("No DB connection string");
  process.exit(1);
}

const sql = postgres(connectionString, { ssl: "require", max: 1 });

async function main() {
  const projects = await sql`SELECT id, slug, title, image_url, external_url FROM projects`;
  console.log("Found " + projects.length + " projects:");
  for (const p of projects) {
    console.log("- [" + p.slug + "] image: " + p.image_url + " | ext: " + p.external_url);
  }

  // Check all text columns in projects
  const blocksHits = await sql`
    SELECT id, slug 
    FROM projects 
    WHERE content::text ILIKE '%lovable%' 
       OR content::text ILIKE '%trailblazer%'
       OR image_url ILIKE '%lovable%'
       OR image_url ILIKE '%trailblazer%'
       OR external_url ILIKE '%lovable%'
       OR external_url ILIKE '%trailblazer%'
  `;
  console.log("Hits in projects:", blocksHits.map(b => ({ id: b.id, slug: b.slug })));

  // Check stats, profile, media_library etc
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `;
  console.log("Public tables:", tables.map(t => t.table_name));

  for (const t of tables) {
    const name = t.table_name;
    try {
      const rows = await sql.unsafe(`SELECT * FROM "${name}"`);
      const rawStr = JSON.stringify(rows);
      if (rawStr.includes("trailblazer") || rawStr.includes("lovable.app")) {
        console.log(`⚠️ MATCH FOUND IN TABLE ${name}!`);
      }
    } catch (e) {
      // ignore
    }
  }

  // Check stats counters
  try {
    const stats = await sql`SELECT * FROM stats ORDER BY sort_order ASC`;
    console.log("Stats in DB:", stats);
  } catch (e) {
    console.log("Error querying stats:", e.message);
  }

  // Check certifications or parcours
  try {
    const settings = await sql`SELECT * FROM app_settings`;
    console.log("App settings in DB:", settings);
    const exp = await sql`SELECT id, role, company FROM experiences`;
    console.log("Experiences in DB:", exp);
  } catch (e) {
    console.log("Error querying settings/exp:", e.message);
  }

  await sql.end();
}

main().catch(console.error);
