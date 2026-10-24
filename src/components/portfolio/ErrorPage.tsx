import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Header } from "@/components/portfolio/Header";
import { Footer } from "@/components/portfolio/Footer";
import { profile } from "@/content/portfolio";

const container = "mx-auto w-full max-w-6xl px-5 md:px-8";

// Boutons réutilisables des pages d'erreur (mêmes styles que le reste du site).
export const errorBtn = {
  primary:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  outline:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  whatsapp:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-3 text-sm font-semibold text-whatsapp-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
};

/** Illustration sobre : deux nœuds réseau reliés par un câble débranché. */
export function DisconnectedIllustration() {
  return (
    <svg viewBox="0 0 320 120" className="h-auto w-full max-w-xs" role="img" aria-label="Câble réseau débranché">
      <g fill="none" strokeLinecap="round" strokeWidth="4">
        <path d="M40 60 H120" className="stroke-primary" />
        <path d="M200 60 H280" className="stroke-muted-foreground" />
        <path d="M150 44 l6 -10 M160 40 v-14 M170 44 l-6 -10" className="stroke-primary" strokeWidth="3" />
        <path d="M150 76 l6 10 M160 80 v14 M170 76 l-6 10" className="stroke-primary" strokeWidth="3" />
      </g>
      <rect x="118" y="48" width="24" height="24" rx="4" className="fill-primary" />
      <rect x="142" y="54" width="6" height="4" className="fill-primary" />
      <rect x="142" y="62" width="6" height="4" className="fill-primary" />
      <rect x="178" y="48" width="24" height="24" rx="4" className="fill-card stroke-muted-foreground" strokeWidth="3" />
      <circle cx="32" cy="60" r="16" className="fill-primary" />
      <circle cx="288" cy="60" r="16" className="fill-muted-foreground" />
    </svg>
  );
}

type Props = {
  code?: string;
  title: string;
  text: ReactNode;
  actions: ReactNode;
  /** Titre de l'onglet. Les pages d'erreur ne sont jamais indexées. */
  tabTitle: string;
};

export function ErrorPage({ code, title, text, actions, tabTitle }: Props) {
  return (
    <div id="top" className="flex min-h-screen flex-col bg-background text-foreground">
      {/* React place ces balises dans <head> : titre d'onglet + noindex. */}
      <title>{tabTitle}</title>
      <meta name="robots" content="noindex" />
      <Header />
      <main className={`${container} flex flex-1 flex-col items-center justify-center pb-16 pt-28 text-center md:pt-32`}>
        <DisconnectedIllustration />
        {code && (
          <p className="mt-6 bg-gradient-primary bg-clip-text text-7xl font-extrabold leading-none tracking-tight text-transparent md:text-8xl" aria-hidden="true">
            {code}
          </p>
        )}
        <h1 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">{title}</h1>
        <div className="mt-4 max-w-xl leading-relaxed text-muted-foreground">{text}</div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">{actions}</div>
      </main>
      <Footer />
    </div>
  );
}

export function NotFoundPage() {
  return (
    <ErrorPage
      code="404"
      tabTitle="Page introuvable — Landry Kayoyo"
      title="Cette page est introuvable"
      text={<p>Le lien est peut-être incorrect ou la page a été déplacée. Pas d'inquiétude : tout le reste du site fonctionne.</p>}
      actions={<>
        <Link to="/" className={errorBtn.primary}>Retour à l'accueil</Link>
        <Link to="/projets" className={errorBtn.outline}>Voir mes projets</Link>
        <Link to="/" hash="contact" className={errorBtn.outline}>Me contacter</Link>
      </>}
    />
  );
}

export function ServerErrorPage() {
  return (
    <ErrorPage
      tabTitle="Erreur — Landry Kayoyo"
      title="Oups, quelque chose s'est mal passé"
      text={<p>Un problème inattendu empêche l'affichage de cette page. Rechargez-la, ou contactez-moi directement si le souci persiste.</p>}
      actions={<>
        <button type="button" onClick={() => window.location.reload()} className={errorBtn.primary}>Recharger la page</button>
        <a href="/" className={errorBtn.outline}>Retour à l'accueil</a>
        <a href={profile.whatsapp} target="_blank" rel="noreferrer" className={errorBtn.whatsapp}>Me contacter sur WhatsApp</a>
      </>}
    />
  );
}
