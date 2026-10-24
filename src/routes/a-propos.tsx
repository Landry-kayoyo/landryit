import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft, ArrowRight, Award, Briefcase, FileText, GraduationCap, Lightbulb, Lock, ShieldCheck,
} from "lucide-react";
import { Header } from "@/components/portfolio/Header";
import { Footer } from "@/components/portfolio/Footer";
import { Reveal, SectionHeading } from "@/components/portfolio/Reveal";
import { Button } from "@/components/ui/button";
import { WhatsAppFloat } from "@/components/portfolio/WhatsAppFloat";
import { useQuery } from "@tanstack/react-query";
import { ContentError, ContentLoading } from "@/components/portfolio/ContentState";
import { experiencesQuery } from "@/lib/content.queries";
import { aboutPage, profile, shareImage } from "@/content/portfolio";
import { AnimatedStats } from "@/components/portfolio/AnimatedStats";

const photo = { url: "/landry-a-propos.jpg" };

const TITLE = "À propos — Landry Kayoyo";
const DESC = "Landry Kayoyo, administrateur systèmes et réseaux et développeur web à Lubumbashi : études à l'Université Don Bosco, stages à l'INPP et à la CNSS, PayLix et accompagnement des petites entreprises avec XSECURITY.";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: shareImage.url },
      { property: "og:image:width", content: String(shareImage.width) },
      { property: "og:image:height", content: String(shareImage.height) },
      { property: "og:image:alt", content: shareImage.alt },
      { name: "twitter:image", content: shareImage.url },
      { name: "twitter:image:alt", content: shareImage.alt },
    ],
    links: [{ rel: "canonical", href: "/a-propos" }],
  }),
  loader: ({ context }) => context.queryClient.prefetchQuery(experiencesQuery),
  component: APropos,
});

const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const btnPrimary = `inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:brightness-110 ${focus}`;
const container = "mx-auto w-full max-w-6xl px-5 md:px-8";
const valueIcons = [ShieldCheck, Lock, FileText, Lightbulb] as const;


function APropos() {
  const timelineQ = useQuery(experiencesQuery);
  return (
    <div id="top" className="bg-background text-foreground">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">Aller au contenu</a>
      <Header />
      <main id="main" className="page-enter">
        {/* Titre + photo */}
        <section className="relative overflow-hidden bg-hero text-ink-foreground">
          <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
          <div className={`${container} relative grid items-center gap-12 pb-16 pt-28 md:grid-cols-[1.15fr_0.85fr] md:pb-24 md:pt-36`}>
            <div>
              <Link to="/" className={`mb-8 inline-flex items-center gap-2 text-sm font-medium text-ink-foreground/70 transition hover:text-ink-foreground ${focus}`}>
                <ArrowLeft size={16} /> {aboutPage.back}
              </Link>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary-glow">{aboutPage.eyebrow}</p>
              <h1 className="max-w-xl text-4xl font-semibold leading-[1.05] sm:text-5xl md:text-6xl">{aboutPage.title}</h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-foreground/70">{aboutPage.intro}</p>
            </div>
            <Reveal className="relative mx-auto w-full max-w-[320px]">
              <div className="absolute -inset-1 rounded-[2.2rem] bg-gradient-primary opacity-70 blur-2xl" aria-hidden />
              <div className="relative rounded-[2rem] bg-gradient-primary p-[3px]">
                <img src={photo.url} alt="Landry Kayoyo en costume, assis à son poste de travail" width={1080} height={1080} fetchPriority="high" className="aspect-[4/5] w-full rounded-[1.85rem] object-cover object-[55%_25%]" />
              </div>
            </Reveal>
          </div>
        </section>

        {/* Mon histoire */}
        <section className="py-16 md:py-24">
          <div className={`${container} max-w-4xl`}>
            <Reveal>
              <SectionHeading eyebrow="Vision & Expérience" title={aboutPage.storyTitle} />
            </Reveal>

            <div className="space-y-6 mt-8">
              {/* Chapeau d'accroche */}
              {aboutPage.story[0] && (
                <Reveal>
                  <div className="rounded-2xl sm:rounded-3xl border border-primary/25 bg-primary/5 p-6 sm:p-7 shadow-xs">
                    <p className="text-lg sm:text-xl font-medium text-foreground leading-relaxed">
                      {aboutPage.story[0]}
                    </p>
                  </div>
                </Reveal>
              )}

              {/* Corps de l'histoire en deux piliers bien aérés */}
              <div className="grid gap-5 sm:grid-cols-2">
                {aboutPage.story[1] && (
                  <Reveal className="h-full">
                    <div className="h-full rounded-2xl border border-border/80 bg-card p-6 shadow-sm flex flex-col justify-between">
                      <div>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-3">
                          <GraduationCap size={15} /> Formation & Terrain
                        </span>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                          {aboutPage.story[1]}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                )}

                {aboutPage.story[2] && (
                  <Reveal className="h-full">
                    <div className="h-full rounded-2xl border border-border/80 bg-card p-6 shadow-sm flex flex-col justify-between">
                      <div>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-3">
                          <Briefcase size={15} /> Réseaux & Développement
                        </span>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                          {aboutPage.story[2]}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                )}
              </div>

              {/* Engagement / Conclusion */}
              {aboutPage.story[3] && (
                <Reveal>
                  <div className="rounded-2xl border border-border/80 bg-muted/40 p-5 sm:p-6 text-sm sm:text-base text-foreground/90 leading-relaxed">
                    <strong className="text-primary font-semibold">Ma ligne de conduite : </strong>
                    {aboutPage.story[3]}
                  </div>
                </Reveal>
              )}
            </div>

            {/* Statistiques réelles */}
            <div className="mt-10">
              <AnimatedStats />
            </div>
          </div>
        </section>

        {/* Valeurs */}
        <section className="border-y border-border bg-muted py-20 md:py-28">
          <div className={container}>
            <Reveal>
              <SectionHeading eyebrow="Ma façon de travailler" title={aboutPage.valuesTitle} />
              <p className="max-w-2xl text-lg text-muted-foreground">{aboutPage.valuesIntro}</p>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {aboutPage.values.map((v, i) => {
                const Icon = valueIcons[i % valueIcons.length] ?? ShieldCheck;
                return (
                  <Reveal key={v.title}>
                    <div className="card-hover h-full rounded-3xl border border-border bg-card p-7 shadow-card">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-primary"><Icon size={22} aria-hidden /></div>
                      <h3 className="mt-5 text-xl font-semibold">{v.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Frise chronologique */}
        <section className="py-20 md:py-28">
          <div className={`${container} max-w-3xl`}>
            <Reveal><SectionHeading eyebrow="Parcours" title={aboutPage.milestonesTitle} /></Reveal>
            {timelineQ.isPending ? <ContentLoading rows={4} /> : timelineQ.isError ? <ContentError label="le parcours" onRetry={() => timelineQ.refetch()} /> :
            <ol className="relative ml-5 border-l-2 border-border">
              {(timelineQ.data ?? []).map((t) => {
                const Icon = t.kind === "formation" ? GraduationCap : Briefcase;
                return (
                  <li key={t.id} className="relative mb-8 pl-10 last:mb-0">
                    <span className="absolute -left-[21px] grid h-10 w-10 place-items-center rounded-full border-4 border-background bg-gradient-primary text-primary-foreground" aria-hidden><Icon size={16} /></span>
                    <Reveal className="rounded-2xl border border-border bg-card p-5 shadow-card">
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">{t.period}</p>
                      <h3 className="mt-1 text-lg font-bold">{t.title}</h3>
                      <p className="text-sm font-medium text-foreground/80">{t.organization}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{t.description}</p>
                    </Reveal>
                  </li>
                );
              })}
            </ol>}
          </div>
        </section>

        {/* Appel à l'action */}
        <section className="relative overflow-hidden bg-hero py-20 text-ink-foreground md:py-28">
          <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
          <div className={`${container} relative text-center`}>
            <Reveal>
              <h2 className="mx-auto max-w-2xl text-3xl font-semibold md:text-5xl">{aboutPage.ctaTitle}</h2>
              <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-foreground/70">{aboutPage.ctaText}</p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Link to="/" hash="contact" className={btnPrimary}>{aboutPage.cta} <ArrowRight size={16} /></Link>
                <Button asChild size="lg" variant="outline" className="rounded-full border-ink-foreground/20 bg-ink-foreground/5 text-ink-foreground hover:bg-ink-foreground/10">
                  <Link to="/"><ArrowLeft size={16} /> {aboutPage.back}</Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />

      <WhatsAppFloat />
    </div>
  );
}
