import { useState, type FormEvent } from "react";
import { z } from "zod";
import { CheckCircle2, Send } from "lucide-react";
import { profile } from "@/content/portfolio";
import { errorBtn } from "@/components/portfolio/ErrorPage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Veuillez indiquer votre nom")
    .max(100, "100 caractères maximum"),
  email: z
    .string()
    .trim()
    .min(1, "Veuillez indiquer votre email")
    .email("Adresse email invalide")
    .max(255, "255 caractères maximum"),
  subject: z
    .string()
    .trim()
    .min(1, "Veuillez préciser l'objet")
    .max(200, "200 caractères maximum"),
  message: z
    .string()
    .trim()
    .min(1, "Veuillez écrire votre message")
    .min(10, "Message trop court (10 caractères minimum)")
    .max(3000, "3000 caractères maximum"),
});

type Errors = Partial<Record<"name" | "email" | "subject" | "message", string>>;

const fieldBase =
  "w-full rounded-xl border border-input bg-card px-4 py-3 text-sm sm:text-base text-foreground placeholder:text-muted-foreground/70 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary";

async function sendMessage(d: z.infer<typeof schema>) {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(d),
  });

  if (!res.ok) {
    const errorData = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(errorData.error || "Impossible d'envoyer l'email pour le moment.");
  }
}

export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sentInfo, setSentInfo] = useState<{ name: string; email: string; subject: string } | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const r = schema.safeParse(Object.fromEntries(new FormData(form)));

    if (!r.success) {
      const errs: Errors = {};
      r.error.issues.forEach((i) => {
        const k = i.path[0] as keyof Errors;
        if (!errs[k]) errs[k] = i.message;
      });
      setErrors(errs);
      setStatus("idle");
      form.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }

    setErrors({});
    setServerError(null);
    setStatus("sending");

    try {
      await sendMessage(r.data);
      setSentInfo({
        name: r.data.name,
        email: r.data.email,
        subject: r.data.subject,
      });
      setStatus("sent");
      setConfirmOpen(true);
      form.reset();
    } catch (err) {
      console.error(err);
      setServerError(err instanceof Error ? err.message : "Erreur lors de l'envoi");
      setStatus("failed");
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {/* Ligne 1 : Nom complet & Email */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-xs sm:text-sm font-semibold text-foreground">
              Nom complet
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Votre nom"
              className={fieldBase}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-err" : undefined}
            />
            {errors.name && (
              <p id="name-err" className="mt-1.5 text-xs font-medium text-destructive">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs sm:text-sm font-semibold text-foreground">
              Adresse email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="votre.email@exemple.com"
              className={fieldBase}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-err" : undefined}
            />
            {errors.email && (
              <p id="email-err" className="mt-1.5 text-xs font-medium text-destructive">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        {/* Ligne 2 : Objet */}
        <div>
          <label htmlFor="subject" className="mb-1.5 block text-xs sm:text-sm font-semibold text-foreground">
            Objet
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            placeholder="Ex : Projet réseau, Création de site web, Audit..."
            className={fieldBase}
            aria-invalid={!!errors.subject}
            aria-describedby={errors.subject ? "subject-err" : undefined}
          />
          {errors.subject && (
            <p id="subject-err" className="mt-1.5 text-xs font-medium text-destructive">
              {errors.subject}
            </p>
          )}
        </div>

        {/* Ligne 3 : Message */}
        <div>
          <label htmlFor="message" className="mb-1.5 block text-xs sm:text-sm font-semibold text-foreground">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            placeholder="Décrivez votre besoin..."
            className={fieldBase}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-err" : undefined}
          />
          {errors.message && (
            <p id="message-err" className="mt-1.5 text-xs font-medium text-destructive">
              {errors.message}
            </p>
          )}
        </div>

        {/* Bouton Soumettre */}
        <button
          type="submit"
          disabled={status === "sending"}
          aria-busy={status === "sending"}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm sm:text-base font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-95 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          {status === "sending" ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              <span>Envoi en cours…</span>
            </>
          ) : (
            <>
              <Send size={16} />
              <span>Envoyer le message</span>
            </>
          )}
        </button>

        {/* Alerte d'erreur de transmission */}
        <div aria-live="polite">
          {status === "failed" && (
            <div role="alert" className="space-y-3 rounded-2xl border border-destructive/40 bg-card p-4">
              <p className="text-sm font-semibold text-destructive">
                {serverError || "Votre message n'a pas pu être envoyé. Vous pouvez réessayer ou m'écrire sur WhatsApp."}
              </p>
              <a href={profile.whatsapp} target="_blank" rel="noreferrer" className={errorBtn.whatsapp}>
                Écrire sur WhatsApp
              </a>
            </div>
          )}
        </div>
      </form>

      {/* Modal de confirmation après envoi */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-md rounded-3xl border-border bg-card p-6 sm:p-8 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 ring-8 ring-emerald-500/5">
            <CheckCircle2 size={36} className="stroke-[2.2]" />
          </div>

          <DialogHeader className="mt-4 space-y-2 text-center sm:text-center">
            <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground text-center">
              Message envoyé
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground leading-relaxed text-center">
              {sentInfo?.name ? (
                <>
                  Merci <strong className="text-foreground">{sentInfo.name}</strong> ! Votre message concernant{" "}
                  <strong className="text-foreground">« {sentInfo.subject} »</strong> a bien été reçu. Je vous répondrai sous 24h.
                </>
              ) : (
                "Merci ! Votre message a bien été transmis. Je vous répondrai sous 24 heures."
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 flex justify-center">
            <Button
              type="button"
              onClick={() => setConfirmOpen(false)}
              className="w-full rounded-full bg-primary py-2.5 font-semibold text-primary-foreground shadow-sm hover:opacity-90 cursor-pointer"
            >
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
