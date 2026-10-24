import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, ArrowUpRight, Award, Briefcase, Code2, Download, Github, GraduationCap, Languages,
  Linkedin, Mail, MapPin, Network, Phone, Quote, Server, ShieldCheck, Wrench,
} from "lucide-react";
import { Header } from "@/components/portfolio/Header";
import { Footer } from "@/components/portfolio/Footer";
import { Button } from "@/components/ui/button";
import { Reveal, SectionHeading } from "@/components/portfolio/Reveal";
import { ContactForm } from "@/components/portfolio/ContactForm";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { WhatsAppFloat } from "@/components/portfolio/WhatsAppFloat";
import { useQuery } from "@tanstack/react-query";
import { ContentError, ContentLoading } from "@/components/portfolio/ContentState";
import { certificationsQuery, cvUrlQuery, experiencesQuery, projectsQuery } from "@/lib/content.queries";
import { about, languages, profile, shareImage, skills, testimonials } from "@/content/portfolio";
import { AnimatedStats } from "@/components/portfolio/AnimatedStats";

const photo = { url: "/landry-a-propos.jpg" };

const TITLE = "Landry Kayoyo — Administrateur systèmes & réseaux | Développeur web";
const DESC = "Portfolio de Landry Kayoyo, administrateur systèmes et réseaux et développeur web à Lubumbashi : réseaux, haute disponibilité, sécurité et applications web.";

export const Route = createFileRoute("/")({
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
    links: [{ rel: "canonical", href: "/" }],
  }),
  loader: ({ context }) => Promise.all([
    context.queryClient.prefetchQuery(projectsQuery),
    context.queryClient.prefetchQuery(experiencesQuery),
    context.queryClient.prefetchQuery(certificationsQuery),
  ]),
  component: Index,
});

const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const btnPrimary = `inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:brightness-110 ${focus}`;
const btnGhostDark = `inline-flex items-center justify-center gap-2 rounded-full border border-ink-foreground/20 bg-ink-foreground/5 px-6 py-3 text-sm font-semibold text-ink-foreground backdrop-blur transition hover:bg-ink-foreground/10 ${focus}`;
const container = "mx-auto w-full max-w-6xl px-5 md:px-8";
const skillIcons = { server: Server, network: Network, shield: ShieldCheck, code: Code2, wrench: Wrench } as const;


/** Bouton de téléchargement du CV — pointe vers l'URL dynamique (Cloudinary) ou le fallback statique. */
function CvDownloadButton({ className }: { className: string }) {
  const { data: cloudUrl } = useQuery(cvUrlQuery);
  const href = cloudUrl ?? profile.cvUrl;
  if (!href) return null;
  return (
    <a href={href} download="CV-Landry-Kayoyo.pdf" target="_blank" rel="noreferrer" className={className}>
      <Download size={16} /> Télécharger mon CV
    </a>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero text-ink-foreground">
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
      <div className={`${container} relative grid items-center gap-14 pb-20 pt-32 md:grid-cols-[1.2fr_0.8fr] md:pb-28 md:pt-40`}>
        <div>
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-ink-foreground/15 bg-ink-foreground/5 px-4 py-1.5 text-xs font-semibold text-ink-foreground/90">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-glow opacity-75" /><span className="relative h-2 w-2 rounded-full bg-primary-glow" /></span>
            Disponible pour un poste ou une mission
          </p>
          <h1 className="text-5xl font-semibold leading-[1.02] sm:text-6xl md:text-7xl">
            Landry <span className="text-gradient">Kayoyo</span>
          </h1>
          <p className="mt-5 text-lg font-medium text-ink-foreground/90 md:text-xl">{profile.title}</p>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-foreground/70">{profile.tagline}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#projets" className={btnPrimary}>Voir mes projets <ArrowRight size={16} /></a>
            <CvDownloadButton className={btnGhostDark} />
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-foreground/60">
            <span className="inline-flex items-center gap-2"><MapPin size={15} /> {profile.location}</span>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="transition hover:text-ink-foreground"><Linkedin size={18} /></a>
            <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="transition hover:text-ink-foreground"><Github size={18} /></a>
            <a href={`mailto:${profile.email}`} aria-label="Email" className="transition hover:text-ink-foreground"><Mail size={18} /></a>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[340px]">
          <div className="absolute -inset-1 rounded-[2.2rem] bg-gradient-primary opacity-70 blur-2xl" aria-hidden />
          <div className="relative rounded-[2rem] bg-gradient-primary p-[3px]">
            <img src={photo.url} alt="Landry Kayoyo en costume, assis à son poste de travail" width={1080} height={1080} fetchPriority="high" className="aspect-[4/5] w-full rounded-[1.85rem] object-cover object-[55%_25%]" />
          </div>
          <div className="absolute -left-6 bottom-10 rounded-2xl border border-border bg-card px-4 py-3 text-card-foreground shadow-card">
            <p className="flex items-center gap-2 text-sm font-semibold"><Award size={16} className="text-primary" /> Cisco Networking Academy</p>
            <p className="text-xs text-muted-foreground">Networking Academy</p>
          </div>
          <div className="absolute -right-4 top-8 rounded-2xl border border-border bg-card px-4 py-3 text-card-foreground shadow-card">
            <p className="flex items-center gap-2 text-sm font-semibold"><GraduationCap size={16} className="text-primary" /> Licence 2026</p>
            <p className="text-xs text-muted-foreground">Systèmes & réseaux</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Index() {
  const projectsQ = useQuery(projectsQuery);
  const timelineQ = useQuery(experiencesQuery);
  const certsQ = useQuery(certificationsQuery);
  const projects = projectsQ.data ?? [];
  const featured = projects.filter((p) => p.featured);
  return (
    <div id="top" className="bg-background text-foreground">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">Aller au contenu</a>
      <Header />
      <main id="main">
        <Hero />

        {/* À propos — résumé court, la suite est sur /a-propos */}
        <section id="apropos" className="py-20 md:py-32">
          <div className={container}>
            <Reveal className="mx-auto max-w-4xl">
              <SectionHeading eyebrow="À propos" title="L'infrastructure et le web, maîtrisés de bout en bout." />
              <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
                {about.map((p, i) => <p key={i} className={i === 0 ? "text-xl text-foreground" : ""}>{p}</p>)}
              </div>

              <div className="mt-10">
                <AnimatedStats />
              </div>

              <div className="mt-10">
                <Button asChild size="lg" className="rounded-full bg-gradient-primary">
                  <Link to="/a-propos">Lire mon histoire <ArrowRight size={16} /></Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </section>


        {/* Compétences */}
        <section id="competences" className="border-y border-border bg-muted py-20 md:py-32">
          <div className={container}>
            <Reveal><SectionHeading eyebrow="Compétences" title="Une boîte à outils complète, du réseau au navigateur." /></Reveal>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
              {skills.map((g, i) => {
                const Icon = skillIcons[g.icon as keyof typeof skillIcons];
                return (
                  <Reveal key={g.category} className={i < 2 ? "lg:col-span-3" : "lg:col-span-2"}>
                    <div className="card-hover h-full rounded-3xl border border-border bg-card p-7 shadow-card">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-primary"><Icon size={22} aria-hidden /></div>
                      <h3 className="mt-5 text-xl font-semibold">{g.category}</h3>
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {g.items.map((s) => <li key={s} className="rounded-full bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground">{s}</li>)}
                      </ul>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Projets */}
        <section id="projets" className="py-20 md:py-32">
          <div className={container}>
            <Reveal><SectionHeading eyebrow="Projets" title="Études de cas : des problèmes réels, des solutions concrètes." /></Reveal>
            {projectsQ.isPending ? <ContentLoading rows={2} className="h-72" /> : projectsQ.isError ? <ContentError label="les projets" onRetry={() => projectsQ.refetch()} /> : <>
            <div className="grid gap-6 md:grid-cols-2">
              {featured.map((p, i) => (
                <Reveal key={p.slug} className={i === 3 ? "hidden md:block" : i > 3 ? "hidden" : ""}>
                  <ProjectCard p={p} index={i} />
                </Reveal>
              ))}
            </div>
            <div className="mt-12 flex justify-center">
              <Button asChild size="lg" variant="outline" className="rounded-full"><Link to="/projets">Voir tous les projets (+<span className="md:hidden">{projects.length - Math.min(featured.length, 3)}</span><span className="hidden md:inline">{projects.length - Math.min(featured.length, 4)}</span>)<ArrowRight size={16} /></Link></Button>
            </div>
            </>}
          </div>
        </section>

        {/* Parcours + certifications */}
        <section id="parcours" className="border-y border-border bg-muted py-20 md:py-32">
          <div className={`${container} grid gap-14 lg:grid-cols-[1.2fr_0.8fr]`}>
            <div>
              <Reveal><SectionHeading eyebrow="Parcours" title="Formation et expériences." /></Reveal>
              {timelineQ.isPending ? <ContentLoading rows={4} /> : timelineQ.isError ? <ContentError label="le parcours" onRetry={() => timelineQ.refetch()} /> :
              <ol className="relative ml-5 border-l-2 border-border">
                {(timelineQ.data ?? []).map((t) => {
                  const Icon = t.kind === "formation" ? GraduationCap : Briefcase;
                  return (
                    <li key={t.id} className="relative mb-8 pl-10 last:mb-0">
                      <span className="absolute -left-[21px] grid h-10 w-10 place-items-center rounded-full border-4 border-muted bg-gradient-primary text-primary-foreground" aria-hidden><Icon size={16} /></span>
                      <Reveal className="rounded-2xl border border-border bg-card p-5 shadow-card">
                        <p className="text-xs font-semibold uppercase tracking-wider text-primary">{t.period}</p>
                        <h3 className="mt-1 font-sans text-lg font-bold tracking-normal">{t.title}</h3>
                        <p className="text-sm font-medium text-foreground/80">{t.organization}</p>
                        <p className="mt-2 text-sm text-muted-foreground">{t.description}</p>
                      </Reveal>
                    </li>
                  );
                })}
              </ol>}
            </div>
            <div className="space-y-6 lg:pt-28">
              <Reveal className="rounded-3xl border border-border bg-card p-7 shadow-card">
                <h3 className="flex items-center gap-2 text-xl font-semibold"><Award size={20} className="text-primary" /> Formations</h3>
                {certsQ.isPending ? <div className="mt-5"><ContentLoading rows={3} className="h-12" /></div> : certsQ.isError ? <div className="mt-5"><ContentError label="les formations" onRetry={() => certsQ.refetch()} /></div> :
                <ul className="mt-5 space-y-4">
                  {(certsQ.data ?? []).map((c) => (
                    <li key={c.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                      <p className="font-semibold">{c.title}</p>
                      <p className="text-sm text-muted-foreground">{c.issuer} · {c.date_label}</p>
                    </li>
                  ))}
                </ul>}
              </Reveal>
              <Reveal className="rounded-3xl border border-border bg-card p-7 shadow-card">
                <h3 className="flex items-center gap-2 text-xl font-semibold"><Languages size={20} className="text-primary" /> Langues</h3>
                <ul className="mt-5 space-y-4">
                  {languages.map((l) => (
                    <li key={l.name}>
                      <div className="flex justify-between text-sm"><span className="font-semibold">{l.name}</span><span className="text-muted-foreground">{l.level}</span></div>
                      <div className="mt-2 h-2 rounded-full bg-secondary" role="presentation"><div className="h-2 rounded-full bg-gradient-primary" style={{ width: `${l.value}%` }} /></div>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Témoignages */}
        <section id="temoignages" className="relative overflow-hidden bg-hero py-20 text-ink-foreground md:py-32">
          <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
          <div className={`${container} relative`}>
            <Reveal>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary-glow">Témoignages</p>
              <h2 className="mb-12 max-w-2xl text-3xl font-semibold md:text-5xl">Ce qu'on dit de mon travail.</h2>
            </Reveal>
            <div className="grid gap-5 md:grid-cols-3">
              {testimonials.map((t, i) => (
                <Reveal key={i}>
                  <figure className="flex h-full flex-col rounded-3xl border border-ink-foreground/10 bg-ink-foreground/5 p-7 backdrop-blur">
                    <Quote size={28} className="text-primary-glow" aria-hidden />
                    <blockquote className="mt-4 flex-1 leading-relaxed text-ink-foreground/90">« {t.quote} »</blockquote>
                    <figcaption className="mt-6 flex items-center gap-3 text-sm">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary font-semibold text-primary-foreground" aria-hidden>{t.role[0]}</span>
                      <span><span className="font-semibold">{t.name}</span><br /><span className="text-ink-foreground/60">{t.role}</span></span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-20 md:py-32">
          <div className={`${container} grid gap-12 lg:grid-cols-2 lg:gap-20`}>
            <Reveal>
              <SectionHeading eyebrow="Contact" title="Un projet, un poste ? Parlons-en." />
              <p className="max-w-md text-lg text-muted-foreground">Recruteur ou client, décrivez votre besoin : je vous réponds rapidement avec une proposition claire.</p>
              <ul className="mt-10 space-y-3">
                {[
                  { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
                  { icon: Phone, label: "Téléphone / WhatsApp", value: profile.phone, href: profile.phoneHref },
                  { icon: Linkedin, label: "LinkedIn", value: "Landry Kayoyo", href: profile.linkedin },
                  { icon: Github, label: "GitHub", value: "landrykayoyo", href: profile.github },
                ].map(({ icon: Icon, label, value, href }) => (
                  <li key={label}>
                    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className={`card-hover flex items-center gap-4 rounded-2xl border border-border bg-card p-4 ${focus}`}>
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent text-primary"><Icon size={20} aria-hidden /></span>
                      <span className="min-w-0"><span className="block text-xs text-muted-foreground">{label}</span><span className="block truncate font-semibold">{value}</span></span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal><ContactForm /></Reveal>
          </div>
        </section>
      </main>

      <Footer />

      <WhatsAppFloat />
    </div>
  );
}
