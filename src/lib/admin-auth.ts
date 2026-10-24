import { supabase } from "@/integrations/supabase/client";

export type AdminStatus = { state: "anonymous" } | { state: "forbidden" } | { state: "admin"; email: string; mustChangePassword: boolean };

/** Vérifie la session auprès du serveur d'authentification puis le rôle en base. */
export async function getAdminStatus(): Promise<AdminStatus> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return { state: "anonymous" };
  const { data: isAdmin, error: roleError } = await supabase.rpc("has_role", { _user_id: data.user.id, _role: "admin" });
  if (roleError || !isAdmin) return { state: "forbidden" };
  return {
    state: "admin",
    email: data.user.email ?? "",
    mustChangePassword: data.user.app_metadata?.["must_change_password"] === true,
  };
}

/** Message lisible à partir d'une erreur quelconque, sans détail technique. */
export function friendlyError(fallback = "Une erreur est survenue. Réessayez."): string {
  return fallback;
}
