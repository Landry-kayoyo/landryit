import { createFileRoute, Link, notFound, type ErrorComponentProps } from "@tanstack/react-router";
import { ErrorPage, ServerErrorPage, errorBtn } from "@/components/portfolio/ErrorPage";
import { ArrowLeft, ArrowRight, ArrowUpRight, Globe, Mail, Sparkles } from "lucide-react";
import { Header } from "@/components/portfolio/Header";
import { Footer } from "@/components/portfolio/Footer";
import { WhatsAppFloat } from "@/components/portfolio/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ProjectBody, firstImage } from "@/components/portfolio/ProjectBody";
import { parseBlocks } from "@/lib/blocks";
import { projectQuery, projectsQuery } from "@/lib/content.queries";
import { profile, projectPage as copy, shareImage } from "@/content/portfolio";

export const Route = createFileRoute("/projets/$slug")({
  loader: async ({ params, context }) => {
    const project = await context.queryClient.ensureQueryData(projectQuery(params.slug));
    if (!project) throw notFound();
    await context.queryClient.prefetchQuery(projectsQuery);
    return project;
  },
  head: ({ loaderData, params }) => {
    const title = loaderData ? `${loaderData.title} — Landry Kayoyo` : "Projet introuvable — Landry Kayoyo";
    const description = loaderData?.summary ?? copy.unavailableText;
    return {
      meta: [
        { title }, { name: "description", content: description },
        { property: "og:title", content: title }, { property: "og:description", content: description },
        { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: shareImage.url },
      { property: "og:image:width", content: String(shareImage.width) },
      { property: "og:image:height", content: String(shareImage.height) },
      { property: "og:image:alt", content: shareImage.alt },
      { name: "twitter:image", content: shareImage.url },
      { name: "twitter:image:alt", content: shareImage.alt },
        { property: "og:url", content: `/projets/${params.slug}` },
        ...(!loaderData ? [{ name: "robots", content: "noindex" }] : []),
      ],
      links: [{ rel: "canonical", href: `/projets/${params.slug}` }],
    };
  },
  component: ProjectDetail,
  notFoundComponent: ProjectNotFound,
  errorComponent: ProjectError,
});

const container = "mx-auto w-full max-w-6xl px-5 md:px-8";

function ProjectNotFound() {
  return (
    <ErrorPage
      tabTitle="Projet introuvable — Landry Kayoyo"
      title="Ce projet n'existe pas ou a été déplacé"
      text={<p>Retrouvez toutes mes réalisations sur la page des projets.</p>}
      actions={<>
        <Link to="/projets" className={errorBtn.primary}>Voir tous les projets</Link>
        <Link to="/" className={errorBtn.outline}>Retour à l'accueil</Link>
      </>}
    />
  );
}

function ProjectError({ error }: ErrorComponentProps) {
  console.error(error);
  return <ServerErrorPage />;
}

function ProjectDetail() {
  const p = Route.useLoaderData();
  const blocks = parseBlocks(p.content);
  const hero = firstImage(blocks);
  const all = useQuery(projectsQuery).data ?? [];
  const related = all
    .map((project, index) => ({
      project,
      index,
      score:
        project.technologies.filter((t) => p.technologies.includes(t)).length +
        (project.tag === p.tag ? 2 : 0),
    }))
    .filter(({ project, score }) => project.slug !== p.slug && score >= 1)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 3);
  return (
    <div id="top" className="bg-background text-foreground">
      <Header />
      <main key={p.slug} className="page-enter pt-24 md:pt-32">
        {/* Navigation retour & Catégories */}
        <div className={container}>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <Link
              to="/projets"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
              <span>{copy.back}</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles size={12} /> {copy.eyebrow}
              </span>
              <span className="rounded-full bg-secondary/80 border border-border px-3 py-1 text-xs font-semibold text-secondary-foreground">
                {p.tag}
              </span>
            </div>
          </div>
        </div>

        {/* En-tête héro du projet */}
        <section className={container}>
          <h1 className="max-w-4xl text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.12] break-words">
            {p.title}
          </h1>

          {p.intro && (
            <p className="mt-6 max-w-3xl text-lg sm:text-xl leading-relaxed text-muted-foreground">
              {p.intro}
            </p>
          )}

          {/* Badges des technologies */}
          {p.technologies.length > 0 && (
            <div className="mt-7 flex flex-wrap gap-2" aria-label={copy.technologies}>
              {p.technologies.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border/80 bg-secondary/60 px-3.5 py-1 text-xs font-medium text-secondary-foreground shadow-2xs hover:border-primary/40 transition-colors"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Actions & Lien Live */}
          {p.external_url && (
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="rounded-full bg-gradient-primary gap-2 shadow-sm">
                <a href={p.external_url} target="_blank" rel="noreferrer">
                  <Globe size={18} /> {copy.live} <ArrowUpRight size={16} />
                </a>
              </Button>
              <a
                href={p.external_url}
                target="_blank"
                rel="noreferrer"
                className="break-all text-xs sm:text-sm text-muted-foreground underline-offset-4 hover:underline hover:text-foreground transition-colors"
              >
                {p.external_url}
              </a>
            </div>
          )}

          {/* Image de couverture principale */}
          {(p.image_url || hero?.url) && (
            <div className="mt-10 md:mt-12 overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-card shadow-md">
              <img
                src={p.image_url || hero?.url || ""}
                alt={p.image_alt || hero?.alt || p.title}
                width={1200}
                height={800}
                fetchPriority="high"
                className="aspect-[16/10] sm:aspect-[16/9] w-full object-cover"
              />
            </div>
          )}
          {hero?.note && <p className="mt-3 text-xs text-muted-foreground">{hero.note}</p>}
        </section>

        {/* Corps structuré de l'étude de cas */}
        <ProjectBody blocks={blocks} />

        {/* Section Contact / CTA */}
        <section className="bg-ink py-14 text-ink-foreground md:py-20 my-12 md:my-16">
          <div className={container}>
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 mb-5">
                <Sparkles size={11} /> Travaillons ensemble
              </span>
              <h2 className="text-2xl font-extrabold sm:text-3xl md:text-4xl tracking-tight text-white leading-tight">
                Ce projet vous inspire ?<br />
                <span className="text-primary">Construisons le vôtre.</span>
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/60">
                Chaque projet commence par une conversation. Décrivez-moi votre besoin et je vous reviens rapidement avec une approche concrète.
              </p>
              <div className="mt-7">
                <Button asChild size="lg" className="rounded-full bg-gradient-primary gap-2 shadow-md hover:opacity-90 transition-opacity">
                  <Link to="/" hash="contact">
                    <Mail size={16} /> Démarrer un projet <ArrowRight size={15} />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Section Projets similaires — masquée si aucun résultat */}
        {related.length > 0 && (
          <section className={`${container} border-t border-border py-12 md:py-16`}>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">{copy.next}</p>
                <h2 className="mt-1 text-xl font-bold tracking-tight">Projets similaires</h2>
              </div>
              <Button asChild variant="outline" size="sm" className="rounded-full gap-1.5 text-xs">
                <Link to="/projets">{copy.back}<ArrowRight size={13} /></Link>
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {related.map(({ project }) => (
                <Link
                  key={project.slug}
                  to="/projets/$slug"
                  params={{ slug: project.slug }}
                  className="group flex items-center gap-3 overflow-hidden rounded-xl border border-border/80 bg-card p-3 transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:bg-accent/30"
                >
                  {/* Miniature carrée compacte */}
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.image_alt || project.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center bg-accent text-primary font-bold text-xs uppercase">
                        {project.slug.slice(0, 3)}
                      </div>
                    )}
                  </div>

                  {/* Infos texte */}
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-primary">{project.tag}</span>
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {project.title}
                    </h3>
                  </div>

                  <ArrowRight size={14} className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}