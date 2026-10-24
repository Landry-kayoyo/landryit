/**
 * scripts/setup-admin.mjs
 * ─────────────────────────────────────────────────────────────
 * Cree le compte administrateur dans Supabase Auth
 * et lui attribue le role "admin" dans public.user_roles.
 *
 * Usage :
 *   node scripts/setup-admin.mjs
 *
 * Variables requises dans .env :
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, ADMIN_PASSWORD
 */

import { createClient } from "@supabase/supabase-js";

// Charger manuellement le .env si pas de chargeur automatique
import { readFileSync } from "fs";
try {
  const raw = readFileSync(".env", "utf-8");
  for (const line of raw.split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = val;
    }
  }
} catch { /* .env absent en prod, les vars sont injectees par Vercel */ }

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("❌ Variables manquantes : SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, ADMIN_PASSWORD");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function run() {
  console.log("👑 Setup compte administrateur...");
  console.log(`   Email : ${ADMIN_EMAIL}`);

  const { data: existing } = await supabase.auth.admin.listUsers();
  const found = existing?.users?.find(
    (u) => u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
  );

  let userId;

  if (found) {
    console.log("   ℹ️  Utilisateur existe deja, mise a jour du mot de passe...");
    const { error } = await supabase.auth.admin.updateUserById(found.id, {
      password: ADMIN_PASSWORD,
      email_confirm: true,
    });
    if (error) throw new Error(`Mise a jour echouee : ${error.message}`);
    userId = found.id;
    console.log("   ✅ Mot de passe mis a jour");
  } else {
    console.log("   ➕ Creation du compte admin...");
    const { data, error } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
    });
    if (error) throw new Error(`Creation echouee : ${error.message}`);
    userId = data.user.id;
    console.log(`   ✅ Compte cree (ID: ${userId})`);
  }

  // 2. Attribuer le role admin
  const { error: roleError } = await supabase
    .from("user_roles")
    .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });

  if (roleError) throw new Error(`Attribution role echouee : ${roleError.message}`);
  console.log("   ✅ Role admin attribue");

  console.log("\n🎉 Setup termine ! Vous pouvez vous connecter sur /admin/login");
}

run().catch((err) => {
  console.error("❌ Erreur :", err.message);
  process.exit(1);
});
