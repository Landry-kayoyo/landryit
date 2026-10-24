import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Globe } from "lucide-react";
import { projectPage as copy } from "@/content/portfolio";
import type { PublicProject as Project } from "@/lib/content.queries";

export function ProjectCard({ p, index, featured = false }: { p: Project; index: number; featured?: boolean }) {
  return (
    <div
      className={`group card-hover relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card focus-within:outline-none focus-within:ring-2 focus-within:ring-ring ${featured ? "md:col-span-2 md:flex-row" : ""}`}
    >
      {/* Lien étendu : tout le carré reste cliquable vers la page du projet. */}
      <Link
        to="/projets/$slug"
        params={{ slug: p.slug }}
        aria-label={`${copy.readMore} : ${p.title}`}
        className="absolute inset-0 z-10 rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <div className={`relative overflow-hidden ${featured ? "md:w-3/5" : ""}`}>
        <img
          src={p.image_url ?? ""}
          alt={p.image_alt}
          width={1200}
          height={800}
          loading="lazy"
          className={`aspect-[3/2] w-full object-cover transition duration-700 group-hover:scale-105 ${featured ? "md:h-full" : ""}`}
        />
        <span className="absolute left-4 top-4 rounded-full bg-card px-3 py-1 text-xs font-semibold text-foreground shadow-card">{p.tag}</span>
        {p.external_url && (
          <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-card">
            <Globe size={12} />
            {copy.liveBadge}
          </span>
        )}
      </div>
      <div className={`flex flex-1 flex-col p-6 md:p-8 ${featured ? "md:w-2/5 md:justify-center" : ""}`}>
        <span className="font-display text-sm font-semibold text-primary">0{index + 1}</span>
        <h3 className={`mt-2 font-semibold leading-snug ${featured ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"}`}>{p.title}</h3>
        <p className="mt-3 line-clamp-3 leading-relaxed text-muted-foreground">{p.summary}</p>
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies utilisées">
          {p.technologies.slice(0, 4).map((t) => <li key={t} className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">{t}</li>)}
        </ul>
        <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-primary">
          {copy.readMore}
          <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
        {p.external_url && (
          <a
            href={p.external_url ?? undefined}
            target="_blank"
            rel="noreferrer"
            className="relative z-20 mt-3 inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 px-4 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Globe size={14} />
            {copy.liveShort}
            <ArrowUpRight size={14} />
          </a>
        )}
      </div>
    </div>
  );
}
