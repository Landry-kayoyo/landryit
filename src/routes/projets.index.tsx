import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/portfolio/Header";
import { Footer } from "@/components/portfolio/Footer";
import { WhatsAppFloat } from "@/components/portfolio/WhatsAppFloat";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ContentError, ContentLoading } from "@/components/portfolio/ContentState";
import { projectsQuery } from "@/lib/content.queries";
import { profile, shareImage } from "@/content/portfolio";

const TITLE = "Tous les projets — Landry Kayoyo";
const DESC = "Toutes les études de cas de Landry Kayoyo : haute disponibilité, réseaux, sécurité et applications web.";

export const Route = createFileRoute("/projets/")({
  head: () => ({
    meta: [
      { title: TITLE }, { name: "description", content: DESC },
      { property: "og:title", content: TITLE }, { property: "og:description", content: DESC },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: shareImage.url },
      { property: "og:image:width", content: String(shareImage.width) },
      { property: "og:image:height", content: String(shareImage.height) },
      { property: "og:image:alt", content: shareImage.alt },
      { name: "twitter:image", content: shareImage.url },
      { name: "twitter:image:alt", content: shareImage.alt },
    ],
    links: [{ rel: "canonical", href: "/projets" }],
  }),
  loader: ({ context }) => context.queryClient.prefetchQuery(projectsQuery),
  component: ProjectsPage,
});

const container = "mx-auto w-full max-w-6xl px-5 md:px-8";

function ProjectsPage() {
  const { data: projects, isPending, isError, refetch } = useQuery(projectsQuery);
  return (
    <div className="bg-background text-foreground">
      <Header />
      <main className="page-enter pt-24 md:pt-28">
        <section className={`${container} pb-10`}>
          <Button asChild variant="link" className="mb-6 px-0"><Link to="/"><ArrowLeft />Accueil</Link></Button>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Portfolio · {projects ? `${projects.length} projets` : "projets"}</p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">Tous les projets</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">Des problèmes réels, des solutions concrètes : réseaux, infrastructures, sécurité et développement web.</p>
        </section>
        {isPending ? <div className={`${container} pb-20 md:pb-28`}><ContentLoading rows={2} className="h-72" /></div>
          : isError || !projects ? <div className={`${container} pb-20 md:pb-28`}><ContentError label="les projets" onRetry={() => refetch()} /></div>
          : <section className={`${container} grid gap-6 pb-20 md:grid-cols-2 md:pb-28`}>
          {projects.map((p, i) => <ProjectCard key={p.slug} p={p} index={i} />)}
        </section>}
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
