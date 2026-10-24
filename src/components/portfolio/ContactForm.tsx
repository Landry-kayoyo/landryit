import { useState, type FormEvent } from "react";
import { z } from "zod";
import { CheckCircle2, Send, Sparkles } from "lucide-react";
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
    .min(1, "Ce champ est obligatoire : indiquez votre nom")
    .max(100, "100 caractères maximum"),
  email: z
    .string()
    .trim()
    .min(1, "Ce champ est obligatoire : indiquez votre email")
    .email("Adresse email invalide (exemple : nom@domaine.com)")
    .max(255, "255 caractères maximum"),
  message: z
    .string()
    .trim()
    .min(1, "Ce champ est obligatoire : écrivez votre message")
    .min(10, "Message trop court (10 caractères minimum)")
    .max(1000, "1000 caractères maximum"),
});

type Errors = Partial<Record<"name" | "email" | "message", string>>;

const field =
  "w-full rounded-xl border border-input bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary";

// Envoi du message via notre API serveur sécurisée configurée en SMTP
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
  const [sentInfo, setSentInfo] = useState<{ name: string; email: string } | null>(null);

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
      setSentInfo({ name: r.data.name, email: r.data.email });
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
      <form
        onSubmit={onSubmit}
        noValidate
        className="space-y-5 rounded-3xl border border-border bg-card p-6 shadow-card md:p-8"
      >
        {(["name", "email"] as const).map((k) => (
          <div key={k}>
            <label htmlFor={k} className="mb-2 block text-sm font-semibold text-foreground">
              {k === "name" ? "Nom" : "Email"}
            </label>
            <input
              id={k}
              name={k}
              type={k === "email" ? "email" : "text"}
              autoComplete={k}
              placeholder={k === "name" ? "Votre nom complet" : "votre.email@exemple.com"}
              className={field}
              aria-invalid={!!errors[k]}
              aria-describedby={errors[k] ? `${k}-err` : undefined}
            />
            {errors[k] && (
              <p id={`${k}-err`} className="mt-1.5 text-xs font-medium text-destructive">
                {errors[k]}
              </p>
            )}
          </div>
        ))}

        <div>
          <label htmlFor="message" className="mb-2 block text-sm font-semibold text-foreground">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            placeholder="Décrivez votre projet, vos besoins ou vos questions..."
            className={field}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-err" : undefined}
          />
          {errors.message && (
            <p id="message-err" className="mt-1.5 text-xs font-medium text-destructive">
              {errors.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={status === "sending"}
          aria-busy={status === "sending"}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-semibold text-primary-foreground transition-all hover:opacity-90 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
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

        <div aria-live="polite">
          {status === "failed" && (
            <div role="alert" className="space-y-3 rounded-2xl border border-destructive/40 bg-card p-4">
              <p className="text-sm font-semibold text-destructive">
                {serverError || "Votre message n'a pas pu être envoyé. Réessayez ou écrivez-moi directement sur WhatsApp."}
              </p>
              <a href={profile.whatsapp} target="_blank" rel="noreferrer" className={errorBtn.whatsapp}>
                Écrire sur WhatsApp
              </a>
            </div>
          )}
        </div>
      </form>

      {/* Modal de confirmation propre & simple */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-sm rounded-3xl border-border bg-card p-6 text-center shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 ring-8 ring-emerald-500/5">
            <CheckCircle2 size={32} className="stroke-[2.2]" />
          </div>

          <DialogHeader className="mt-4 space-y-2 text-center sm:text-center">
            <DialogTitle className="text-xl font-bold tracking-tight text-foreground text-center">
              Message bien envoyé
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground leading-relaxed text-center">
              {sentInfo?.name ? (
                <>
                  Merci <strong className="text-foreground">{sentInfo.name}</strong> ! Votre message a bien été transmis. Je vous répondrai dans les plus brefs délais.
                </>
              ) : (
                "Merci ! Votre message a bien été transmis. Je vous répondrai dans les plus brefs délais."
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 flex justify-center">
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
