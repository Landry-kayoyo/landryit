import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft, CheckCircle2, Clock, Github, Linkedin, Mail, MapPin, Phone, ShieldCheck, Sparkles,
} from "lucide-react";
import { Header } from "@/components/portfolio/Header";
import { Footer } from "@/components/portfolio/Footer";
import { ContactForm } from "@/components/portfolio/ContactForm";
import { profile, shareImage } from "@/content/portfolio";

const TITLE = "Contact — Landry Kayoyo | Administrateur réseaux & Développeur web";
const DESC = "Contactez Landry Kayoyo à Lubumbashi pour vos projets d'infrastructures réseaux, haute disponibilité, cybersécurité et applications web modernes.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: shareImage.url },
      { property: "og:image:width", content: String(shareImage.width) },
      { property: "og:image:height", content: String(shareImage.height) },
      { property: "og:image:alt", content: shareImage.alt },
      { name: "twitter:image", content: shareImage.url },
      { name: "twitter:image:alt", content: shareImage.alt },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const container = "mx-auto w-full max-w-6xl px-5 md:px-8";
const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function ContactPage() {
  return (
    <div className="bg-background text-foreground">
      <Header />
      <main className="page-enter pt-24 md:pt-32">
        {/* En-tête héro contact */}
        <section className={`${container} pb-10`}>
          <Link
            to="/"
            className={`mb-6 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-4 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground hover:border-primary/40 ${focus}`}
          >
            <ArrowLeft size={14} /> Retour à l'accueil
          </Link>

          <div className="mb-4 inline-flex items-center gap-3 text-xs md:text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            <span className="h-[1.5px] w-7 rounded-full bg-primary/80 inline-block" />
            <span>Échange & Collaboration</span>
          </div>

          <h1 className="max-w-3xl font-serif text-4xl sm:text-5xl md:text-6xl font-normal leading-tight tracking-tight text-foreground">
            Démarrer une collaboration, <span className="italic font-serif text-primary">concrète et durable</span>.
          </h1>

          <p className="mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground">
            Que vous représentiez une entreprise, une institution ou que vous ayez un projet web ou réseau spécifique : décrivez votre besoin. Je vous réponds personnellement sous 24h.
          </p>
        </section>

        {/* Corps principal : Formulaire + Coordonnées directes */}
        <section className={`${container} pb-24 md:pb-32`}>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            {/* Colonne gauche : canaux directs et engagements */}
            <div className="space-y-6">
              <div className="rounded-[28px] border border-border/80 bg-card p-7 sm:p-8 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-5">
                  <Sparkles size={14} /> Canaux de contact direct
                </div>

                <ul className="space-y-3.5">
                  {[
                    {
                      icon: Mail,
                      label: "Email direct",
                      value: profile.email,
                      href: `mailto:${profile.email}`,
                      hint: "Réponse sous 24h",
                    },
                    {
                      icon: Phone,
                      label: "Téléphone direct",
                      value: profile.phone,
                      href: profile.phoneHref,
                      hint: "Appel & SMS",
                    },
                    {
                      icon: Linkedin,
                      label: "Profil LinkedIn",
                      value: "Landry Kayoyo",
                      href: profile.linkedin,
                      hint: "Réseau professionnel",
                    },
                    {
                      icon: Github,
                      label: "Dépôts GitHub",
                      value: "landrykayoyo",
                      href: profile.github,
                      hint: "Code source & projets",
                    },
                  ].map(({ icon: Icon, label, value, href, hint }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer"
                        className={`pillar-card flex items-center gap-4 rounded-2xl border border-border/70 bg-secondary/30 p-4 transition-all duration-300 hover:border-primary/40 hover:bg-card ${focus}`}
                      >
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                          <Icon size={20} aria-hidden />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">{label}</span>
                            <span className="text-[11px] text-primary/80 font-medium">{hint}</span>
                          </div>
                          <span className="block truncate font-semibold text-foreground text-sm sm:text-base mt-0.5">
                            {value}
                          </span>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex items-center gap-3 border-t border-border/60 pt-5 text-xs text-muted-foreground">
                  <MapPin size={16} className="text-primary shrink-0" />
                  <span>Basé à {profile.location} · Disponible pour missions sur site et à distance.</span>
                </div>
              </div>

              {/* Carte Réassurance */}
              <div className="rounded-[24px] border border-border/70 bg-muted/40 p-6 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                  <ShieldCheck size={16} /> Engagements de service
                </div>
                <div className="space-y-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  <p className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-primary shrink-0" /> Analyse claire de votre besoin sans engagement
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock size={14} className="text-primary shrink-0" /> Délais respectés et méthodologie rigoureuse
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-primary shrink-0" /> Confidentialité stricte de vos données et architectures
                  </p>
                </div>
              </div>
            </div>

            {/* Colonne droite : Formulaire */}
            <div>
              <div className="rounded-[32px] border border-border/80 bg-card p-7 sm:p-10 shadow-sm">
                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">
                    Formulaire de contact
                  </p>
                  <h2 className="font-serif text-2xl sm:text-3xl font-medium text-foreground">
                    Envoyer un message
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Décrivez votre projet, vos contraintes ou vos questions. Je vous recontacte rapidement.
                  </p>
                </div>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
