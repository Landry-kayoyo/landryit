import { Link } from "@tanstack/react-router";
import { ArrowUp, Github, Linkedin, Mail, MessageCircle } from "lucide-react";
import { profile } from "@/content/portfolio";

const logo = { url: "/landry-net-logo.jpg" };

export function Footer() {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className="border-t border-border bg-ink text-ink-foreground">
      <div className="mx-auto w-full max-w-6xl px-5 py-12 md:py-16 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr] md:gap-12">
          {/* Identité / Marque */}
          <div className="space-y-4">
            <Link
              to="/"
              hash="top"
              className="inline-flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <img
                src={logo.url}
                alt=""
                width={880}
                height={880}
                className="h-9 w-9 shrink-0 rounded-md sm:h-10 sm:w-10"
              />
              <span className="font-sans text-xl font-bold uppercase tracking-wide">
                <span className="text-primary">Landry</span>{" "}
                <span className="text-white">Net</span>
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-ink-foreground/75">
              Administrateur systèmes & réseaux et développeur web à {profile.location}.
              Conception d'infrastructures résilientes, sécurisées et d'applications sur-mesure.
            </p>
          </div>

          {/* Navigation et Connexions côte à côte sur mobile pour économiser l'espace */}
          <div className="grid grid-cols-2 gap-4 sm:contents">
            {/* Navigation rapide */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 sm:mb-4">
                Navigation
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/"
                    className="text-ink-foreground/70 transition-colors hover:text-white"
                  >
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link
                    to="/projets"
                    className="text-ink-foreground/70 transition-colors hover:text-white"
                  >
                    Projets
                  </Link>
                </li>
                <li>
                  <Link
                    to="/a-propos"
                    className="text-ink-foreground/70 transition-colors hover:text-white"
                  >
                    À propos
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    hash="contact"
                    className="text-ink-foreground/70 transition-colors hover:text-white"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Réseaux & contact direct */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 sm:mb-4">
                Connexions
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-ink-foreground/70 transition-colors hover:text-white"
                  >
                    <Linkedin size={15} /> LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-ink-foreground/70 transition-colors hover:text-white"
                  >
                    <Github size={15} /> GitHub
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex items-center gap-1.5 text-ink-foreground/70 transition-colors hover:text-white"
                  >
                    <Mail size={15} /> Email
                  </a>
                </li>
                <li>
                  <a
                    href={profile.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-ink-foreground/70 transition-colors hover:text-white"
                  >
                    <MessageCircle size={15} /> WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Ligne inférieure de copyright et retour en haut (sans phrase tous droits réservés) */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-foreground/60">
          <p>
            © {new Date().getFullYear()} Landry Kayoyo · {profile.location}
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-ink-foreground/70 hover:text-white transition-colors cursor-pointer"
          >
            <span>Retour en haut</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
