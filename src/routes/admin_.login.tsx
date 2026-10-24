import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { adminSignIn } from "@/lib/admin.functions";

const logo = { url: "/landry-net-logo.jpg" };

export const Route = createFileRoute("/admin_/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Connexion — Espace admin Landry Net" },
      { name: "description", content: "Accès réservé à l'administration du portfolio." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const signIn = useServerFn(adminSignIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) { setError("Renseignez votre email et votre mot de passe."); return; }
    setBusy(true);
    try {
      const res = await signIn({ data: { email, password } });
      if (!res.ok) { setError(res.error); return; }
      const { error: sessionError } = await supabase.auth.setSession({ access_token: res.access_token, refresh_token: res.refresh_token });
      if (sessionError) { setError("Connexion impossible. Réessayez."); return; }
      setPassword("");
      navigate({ to: "/admin", replace: true });
    } catch {
      setError("Connexion impossible pour le moment. Réessayez.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-hero px-5 py-12 text-ink-foreground">
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
      <main className="relative w-full max-w-md rounded-3xl border border-border bg-card p-7 text-card-foreground shadow-card sm:p-9">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logo.url} alt="" width={880} height={880} className="h-10 w-10 rounded-md" />
          <span className="text-xl font-bold uppercase tracking-wide"><span className="text-primary">Landry</span> Net</span>
        </Link>
        <h1 className="mt-8 flex items-center gap-2 text-2xl font-semibold"><Lock size={20} className="text-primary" /> Espace administrateur</h1>
        <p className="mt-2 text-sm text-muted-foreground">Connectez-vous pour gérer le contenu du portfolio.</p>
        <form onSubmit={onSubmit} className="mt-7 space-y-5" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="username" className="h-12" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" type="password" autoComplete="current-password" className="h-12" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{error}</p>}
          <Button type="submit" size="lg" disabled={busy} className="h-12 w-full rounded-full bg-gradient-primary">
            {busy && <Loader2 className="animate-spin" />} Se connecter
          </Button>
        </form>
      </main>
    </div>
  );
}
