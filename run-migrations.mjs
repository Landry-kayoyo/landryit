import postgres from "postgres";
import fs from "fs";
import path from "path";

const connectionString = "postgresql://postgres.gjkgzlsztuuamdvbmapr:mbfkkOqSQJmbnCR7@aws-0-eu-west-1.pooler.supabase.com:5432/postgres";

const sql = postgres(connectionString, { ssl: "require", max: 1 });

async function run() {
  try {
    console.log("🚀 Connexion à la base de données Supabase...");
    const migrationFile = path.resolve("supabase_migration.sql");
    const migrationSQL = fs.readFileSync(migrationFile, "utf-8");

    console.log("⚡ Exécution de la migration SQL...");
    await sql.unsafe(migrationSQL);
    console.log("✅ Migration exécutée avec succès !");

    // Vérification des tables
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    console.log("\n📋 Tables créées dans le schéma public :");
    tables.forEach(t => console.log(`   - ${t.table_name}`));

    // Vérification du rôle admin pour l'utilisateur
    const roles = await sql`
      SELECT u.email, r.role 
      FROM auth.users u
      JOIN public.user_roles r ON r.user_id = u.id;
    `;
    console.log("\n👑 Utilisateurs avec rôle administrateur :");
    roles.forEach(r => console.log(`   - ${r.email} : ${r.role}`));

  } catch (err) {
    console.error("❌ Erreur pendant la migration :", err);
  } finally {
    await sql.end();
  }
}

run();
