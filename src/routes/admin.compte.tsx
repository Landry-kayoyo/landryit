import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState, type FormEvent } from "react";
import { Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError, PageHeader } from "@/components/admin/ui";
import { supabase } from "@/integrations/supabase/client";
import { clearPasswordChangeFlag } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/compte")({ component: Account });

const MIN = 12;

function strength(pw: string): { score: 0 | 1 | 2 | 3 | 4; label: string } {
  if (!pw) return { score: 0, label: "" };
  let s = 0;
  if (pw.length >= MIN) s++;
  if (pw.length >= 16) s++;
  const kinds = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(pw)).length;
  if (kinds >= 2) s++;
  if (pw.length >= 20 || (kinds >= 3 && pw.length >= 14)) s++;
  if (pw.length < MIN) s = Math.min(s, 1);
  const labels = ["Trop court", "Faible", "Correct", "Bon", "Excellent"];
  return { score: s as 0 | 1 | 2 | 3 | 4, label: labels[s] ?? "Correct" };
}

type AuthErr = { code?: string; status?: number; message?: string; reasons?: string[] } | null | undefined;

/** Traduit la réponse réelle du service d'authentification en message précis. */
function describe(err: AuthErr): { field: "current" | "next" | "form"; message: string } {
  const code = err?.code ?? "";
  const msg = (err?.message ?? "").toLowerCase();
  const reasons = err?.reasons ?? [];
  if (code === "current_password_mismatch" || code === "invalid_credentials" || msg.includes("current password"))
    return { field: "current", message: "Mot de passe actuel incorrect." };
  if (code === "weak_password" || msg.includes("weak") || msg.includes("pwned")) {
    if (reasons.includes("pwned") || msg.includes("pwned") || msg.includes("leaked"))
      return { field: "next", message: "Ce mot de passe figure dans une fuite de données connue. Choisissez-en un autre." };
    if (reasons.includes("length")) return { field: "next", message: `${MIN} caractères minimum.` };
    return { field: "next", message: "Mot de passe trop faible. Allongez-le (une phrase de passe est idéale)." };
  }
  if (code === "same_password") return { field: "next", message: "Le nouveau mot de passe doit être différent de l'actuel." };
  if (code === "session_not_found" || code === "session_expired" || code === "bad_jwt" || err?.status === 401 || code === "reauthentication_needed")
    return { field: "form", message: "Votre session a expiré. Reconnectez-vous puis réessayez." };
  if (code === "over_request_rate_limit") return { field: "form", message: "Trop de tentatives. Patientez quelques minutes." };
  return { field: "form", message: "Modification impossible pour le moment. Réessayez." };
}

function Account() {
  const { admin } = Route.useRouteContext();
  const navigate = useNavigate();
  const clearFlag = useServerFn(clearPasswordChangeFlag);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const st = useMemo(() => strength(next), [next]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!current) errs["current"] = "Saisissez votre mot de passe actuel.";
    if (next.length < MIN) errs["next"] = `${MIN} caractères minimum.`;
    else if (next === current) errs["next"] = "Le nouveau mot de passe doit être différent de l'actuel.";
    if (confirm !== next) errs["confirm"] = "La confirmation ne correspond pas au nouveau mot de passe.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      const { data: s } = await supabase.auth.getSession();
      if (!s.session) { setErrors({ form: describe({ code: "session_not_found" }).message }); return; }

      // Le service exige le mot de passe actuel pour un changement en session :
      // on l'envoie avec la mise à jour (c'était la cause du refus).
      const { error } = await supabase.auth.updateUser({ password: next, current_password: current } as never);
      if (error) {
        console.warn("updateUser failed", { code: (error as AuthErr)?.code, status: error.status, message: error.message });
        const d = describe(error as AuthErr);
        setErrors({ [d.field]: d.message });
        return;
      }
      if (admin.mustChangePassword) await clearFlag();
      toast.success("Mot de passe modifié. Reconnectez-vous avec votre nouveau mot de passe.");
      setCurrent(""); setNext(""); setConfirm("");
      await supabase.auth.signOut();
      navigate({ to: "/admin/login" });
    } catch {
      setErrors({ form: "Modification impossible pour le moment. Réessayez." });
    } finally {
      setBusy(false);
    }
  }

  const bar = ["bg-destructive", "bg-destructive", "bg-primary/50", "bg-primary/80", "bg-primary"][st.score];

  return (
    <>
      <PageHeader title="Mon compte" text={admin.email} />
      {admin.mustChangePassword && (
        <div role="alert" className="mb-6 flex gap-3 rounded-2xl border border-primary/30 bg-accent p-4 text-sm">
          <ShieldAlert className="shrink-0 text-primary" />
          <p><strong>Première connexion :</strong> choisissez un nouveau mot de passe personnel pour accéder à l'espace admin.</p>
        </div>
      )}
      <form onSubmit={submit} noValidate className="max-w-lg space-y-4 rounded-3xl border border-border bg-card p-6 shadow-card">
        <h2 className="text-lg font-semibold">Changer mon mot de passe</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>{MIN} caractères minimum.</li>
          <li>Conseil : une phrase de passe longue (ex. 4 ou 5 mots sans lien) est plus sûre et plus facile à retenir.</li>
          <li>Les mots de passe apparus dans des fuites de données connues sont refusés.</li>
        </ul>
        <div className="space-y-1.5"><Label htmlFor="cur">Mot de passe actuel</Label><Input id="cur" type="password" autoComplete="current-password" className="h-11" value={current} onChange={(e) => setCurrent(e.target.value)} /><FieldError message={errors["current"]} /></div>
        <div className="space-y-1.5">
          <Label htmlFor="new">Nouveau mot de passe</Label>
          <Input id="new" type="password" autoComplete="new-password" className="h-11" value={next} onChange={(e) => setNext(e.target.value)} aria-describedby="pw-strength" />
          {next && (
            <div id="pw-strength" aria-live="polite" className="space-y-1">
              <div className="flex gap-1">{[1, 2, 3, 4].map((i) => <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= st.score ? bar : "bg-muted"}`} />)}</div>
              <p className="text-xs text-muted-foreground">Force : {st.label} · {next.length} caractères</p>
            </div>
          )}
          <FieldError message={errors["next"]} />
        </div>
        <div className="space-y-1.5"><Label htmlFor="conf">Confirmer le nouveau mot de passe</Label><Input id="conf" type="password" autoComplete="new-password" className="h-11" value={confirm} onChange={(e) => setConfirm(e.target.value)} /><FieldError message={errors["confirm"]} /></div>
        {errors["form"] && <p role="alert" className="text-sm text-destructive">{errors["form"]}</p>}
        <Button type="submit" disabled={busy} className="min-h-11 rounded-full bg-gradient-primary">{busy && <Loader2 className="animate-spin" />} Enregistrer</Button>
      </form>
    </>
  );
}
