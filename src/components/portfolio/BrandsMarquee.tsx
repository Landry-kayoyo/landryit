import { useQuery } from "@tanstack/react-query";
import { brandsQuery } from "@/lib/content.queries";

/** Bandeau de marques / partenaires à défilement infini.
 *  Géré dynamiquement depuis l'espace admin.
 *  Affiche uniquement le logo SVG ou image des organisations. */
export function BrandsMarquee() {
  const { data: list = [] } = useQuery(brandsQuery);

  if (list.length === 0) return null;

  // On duplique la liste pour que le défilement soit sans fin
  const doubled = [...list, ...list];

  return (
    <section
      aria-label="Institutions et partenaires de confiance"
      className="border-y border-border bg-card py-10 md:py-14 overflow-hidden"
    >
      {/* En-tête épuré */}
      <div className="mx-auto mb-8 w-full max-w-6xl px-5 text-center md:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Ils m'ont fait confiance
        </p>
      </div>

      {/* Piste de défilement */}
      <div className="marquee-pause relative">
        {/* Dégradés masquant les bords pour un rendu cinématique */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 sm:w-32"
          style={{ background: "linear-gradient(to right, var(--color-card), transparent)" }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 sm:w-32"
          style={{ background: "linear-gradient(to left, var(--color-card), transparent)" }}
          aria-hidden
        />

        <ul className="marquee-track gap-0 items-center" role="list" aria-label="Partenaires">
          {doubled.map((b, i) => (
            <li
              key={`${b.id}-${i}`}
              className="flex shrink-0 items-center gap-8 px-8 sm:px-12"
              aria-hidden={i >= list.length}
            >
              {/* Séparateur discret */}
              <span className="h-6 w-[1.5px] rounded-full bg-border/60 shrink-0" aria-hidden />

              <div className="flex items-center justify-center min-w-[90px] h-12">
                {b.logo_url ? (
                  <img
                    src={b.logo_url}
                    alt={b.name}
                    title={b.name}
                    loading="lazy"
                    className="max-h-9 sm:max-h-11 w-auto max-w-[140px] sm:max-w-[180px] object-contain opacity-75 grayscale contrast-125 transition-all duration-300 hover:opacity-100 hover:grayscale-0 dark:brightness-125 dark:contrast-100"
                  />
                ) : (
                  <span
                    title={b.name}
                    className="font-serif text-lg sm:text-xl font-medium tracking-tight text-foreground/80 hover:text-foreground transition whitespace-nowrap"
                  >
                    {b.name}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
