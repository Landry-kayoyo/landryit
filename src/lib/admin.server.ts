// Outils serveur réservés à l'espace admin. Jamais importé côté navigateur.
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const BOOTSTRAP_KEY = "admin_bootstrapped";

/**
 * Crée le compte administrateur une seule fois, à partir des secrets serveur
 * ADMIN_EMAIL / ADMIN_PASSWORD, puis se désactive définitivement.
 * Les valeurs ne sont jamais journalisées ni renvoyées.
 */
export async function ensureAdminBootstrap(): Promise<void> {
  const { data: done } = await supabaseAdmin.from("app_settings").select("key").eq("key", BOOTSTRAP_KEY).maybeSingle();
  if (done) return;
  const email = process.env["ADMIN_EMAIL"];
  const password = process.env["ADMIN_PASSWORD"];
  if (!email || !password) return;

  const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { must_change_password: true },
  });
  if (error) {
    // Compte déjà existant : on ne touche à rien, mais on désactive le script.
    if (!/already|exists|registered/i.test(error.message)) {
      console.error("Admin bootstrap failed");
      return;
    }
  } else if (created.user) {
    const { error: roleError } = await supabaseAdmin.from("user_roles").insert({ user_id: created.user.id, role: "admin" });
    if (roleError) {
      console.error("Admin role assignment failed");
      return;
    }
  }
  await supabaseAdmin.from("app_settings").insert({ key: BOOTSTRAP_KEY, value: true });
}

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

async function sha256(input: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function attemptKeys(ip: string, email: string) {
  return [await sha256(`ip:${ip}`), await sha256(`email:${email.trim().toLowerCase()}`)];
}

export async function isRateLimited(keys: string[]) {
  const since = new Date(Date.now() - WINDOW_MS).toISOString();
  for (const key of keys) {
    const { count } = await supabaseAdmin.from("login_attempts").select("id", { count: "exact", head: true }).eq("key_hash", key).gte("created_at", since);
    if ((count ?? 0) >= MAX_ATTEMPTS) return true;
  }
  return false;
}

export async function recordFailure(keys: string[]) {
  await supabaseAdmin.from("login_attempts").insert(keys.map((key_hash) => ({ key_hash })));
}

export async function clearFailures(keys: string[]) {
  await supabaseAdmin.from("login_attempts").delete().in("key_hash", keys);
}
