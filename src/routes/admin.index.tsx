import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Award,
  Briefcase,
  ExternalLink,
  FileText,
  FolderKanban,
  HardDrive,
  Layers,
  MessageSquare,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadError, PageHeader } from "@/components/admin/ui";
import { adminCertificationsQuery, adminExperiencesQuery, adminMessagesQuery, adminProjectsQuery } from "@/lib/admin-data";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

function useCvSetting() {
  return useQuery({
    queryKey: ["admin", "settings", "cv_url"],
    queryFn: async () => {
      const { data } = await supabase.from("app_settings").select("value").eq("key", "cv_url").maybeSingle();
      if (!data?.value) return null;
      if (typeof data.value === "string") return data.value;
      if (typeof data.value === "object" && "url" in data.value) return (data.value as { url: string }).url;
      return String(data.value);
    },
  });
}

function StatCard({
  to,
  icon: Icon,
  label,
  value,
  sub,
  color = "primary",
}: {
  to: string;
  icon: typeof Award;
  label: string;
  value: number | string | undefined;
  sub?: string | undefined;
  color?: "primary" | "emerald" | "amber" | "sky";
}) {
  const colorMap = {
    primary: "bg-primary/10 text-primary border-primary/20",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    sky: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  };

  return (
    <Link
      to={to}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-3.5 sm:p-5 shadow-xs transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:translate-y-[-2px] min-w-0"
    >
      <div className="flex items-center justify-between gap-2">
        <div className={`grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-xl sm:rounded-2xl ${colorMap[color]} shadow-xs transition-transform group-hover:scale-105`}>
          <Icon size={20} />
        </div>
        <span className="text-[11px] font-semibold text-muted-foreground opacity-60 group-hover:opacity-100 transition-opacity shrink-0">
          Ouvrir ➔
        </span>
      </div>

      <div className="mt-3 sm:mt-4 min-w-0">
        <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{label}</p>
        {value === undefined ? (
          <Skeleton className="mt-1 h-7 sm:h-8 w-14" />
        ) : (
          <p className="mt-0.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground truncate">
            {value}
          </p>
        )}
        {sub && (
          <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground truncate">
            {sub}
          </p>
        )}
      </div>
    </Link>
  );
}

function Dashboard() {
  const projects = useQuery(adminProjectsQuery);
  const exps = useQuery(adminExperiencesQuery);
  const certs = useQuery(adminCertificationsQuery);
  const messages = useQuery(adminMessagesQuery);
  const cv = useCvSetting();

  if (projects.isError || exps.isError || certs.isError) {
    return (
      <LoadError
        onRetry={() => {
          void projects.refetch();
          void exps.refetch();
          void certs.refetch();
          void messages.refetch();
        }}
      />
    );
  }

  const projectList = projects.data ?? [];
  const publishedCount = projectList.filter((p) => p.status === "published").length;
  const draftCount = projectList.length - publishedCount;
  const featuredCount = projectList.filter((p) => p.featured).length;

  const cvUploaded = !!cv.data;
  const unreadMessagesCount = (messages.data ?? []).filter((m) => m.status === "unread").length;

  return (
    <div className="space-y-6">
      {/* En-tête avec message de bienvenue et actions rapides */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-border/50">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Tableau de bord
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
              <Sparkles size={12} /> Espace d'administration
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Gérez votre portfolio Landry Net : messages reçus, projets, parcours, certifications et médias.
          </p>
        </div>

        {/* Boutons d'action rapides */}
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild size="sm" className="min-h-10 rounded-full bg-gradient-primary gap-1.5 shadow-sm">
            <Link to="/admin/projets/nouveau">
              <Plus size={16} /> Nouveau projet
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="min-h-10 rounded-full gap-1.5">
            <a href="/" target="_blank" rel="noreferrer">
              <ExternalLink size={14} /> Voir le site public
            </a>
          </Button>
        </div>
      </div>

      {/* Grille de statistiques */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard
          to="/admin/messages"
          icon={MessageSquare}
          label="Messages"
          value={messages.data?.length}
          sub={messages.data ? `${unreadMessagesCount} non lu${unreadMessagesCount > 1 ? "s" : ""}` : undefined}
          color={unreadMessagesCount > 0 ? "emerald" : "primary"}
        />
        <StatCard
          to="/admin/projets"
          icon={FolderKanban}
          label="Projets"
          value={projects.data?.length}
          sub={projects.data ? `${publishedCount} publiés · ${draftCount} brouillons` : undefined}
          color="primary"
        />
        <StatCard
          to="/admin/parcours"
          icon={Briefcase}
          label="Expériences"
          value={exps.data?.length}
          sub={exps.data ? `${exps.data.filter((e) => e.published).length} en ligne` : undefined}
          color="sky"
        />
        <StatCard
          to="/admin/certifications"
          icon={Award}
          label="Certifications"
          value={certs.data?.length}
          sub={certs.data ? `${certs.data.filter((c) => c.published).length} publiées` : undefined}
          color="amber"
        />
        <StatCard
          to="/admin/medias"
          icon={FileText}
          label="Mon CV"
          value={cv.isPending ? "…" : cvUploaded ? "En ligne" : "À ajouter"}
          sub={cvUploaded ? "Synchronisé Cloudinary" : "Aucun fichier PDF"}
          color={cvUploaded ? "emerald" : "amber"}
        />
      </div>

      {/* Deuxième rangée : Derniers projets & État des services */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3 min-w-0">
        {/* Colonne gauche (2/3) : Derniers projets avec statut */}
        <div className="lg:col-span-2 rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-3.5 sm:p-6 shadow-xs min-w-0 overflow-hidden">
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-border/60 min-w-0 gap-2">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary shrink-0">
                <FolderKanban size={16} />
              </div>
              <h2 className="font-bold text-base sm:text-lg text-foreground truncate">Projets récents</h2>
            </div>
            <Link
              to="/admin/projets"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 shrink-0"
            >
              <span className="hidden sm:inline">Tous les projets</span>
              <span className="sm:hidden">Tous</span> ({projectList.length}) ➔
            </Link>
          </div>

          <div className="mt-4 space-y-2.5 min-w-0">
            {projects.isPending ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full rounded-2xl" />
                <Skeleton className="h-16 w-full rounded-2xl" />
                <Skeleton className="h-16 w-full rounded-2xl" />
              </div>
            ) : projectList.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground text-sm">
                Aucun projet créé pour l'instant.
              </div>
            ) : (
              projectList.slice(0, 4).map((p) => (
                <Link
                  key={p.id}
                  to="/admin/projets"
                  className="group flex items-center justify-between gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl border border-border/60 bg-muted/20 p-2.5 sm:p-3 transition-colors hover:bg-accent/10 hover:border-primary/30 min-w-0 w-full overflow-hidden"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3 overflow-hidden">
                    <div className="relative h-11 w-14 sm:h-12 sm:w-16 shrink-0 overflow-hidden rounded-lg bg-muted ring-1 ring-border">
                      {p.image_url ? (
                        <img src={p.image_url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="grid h-full w-full place-items-center text-xs font-bold text-primary bg-accent uppercase">
                          {p.slug.slice(0, 3)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <p className="flex items-center gap-1 font-semibold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors min-w-0 w-full overflow-hidden">
                        {p.featured && <Star size={11} className="fill-amber-400 text-amber-400 shrink-0" />}
                        <span className="truncate min-w-0 flex-1">{p.title}</span>
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground truncate min-w-0">
                        <span>{p.tag}</span> · <code className="font-mono">/{p.slug}</code>
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center ml-1">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold whitespace-nowrap ${
                        p.status === "published"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${p.status === "published" ? "bg-emerald-500" : "bg-muted-foreground"}`} />
                      <span className="hidden sm:inline">{p.status === "published" ? "Publié" : "Brouillon"}</span>
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Colonne droite (1/3) : État de la plateforme & Stockage */}
        <div className="space-y-4 min-w-0">
          {/* Carte Cloudinary & Stockage */}
          <div className="rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-3.5 sm:p-5 shadow-xs min-w-0 overflow-hidden">
            <div className="flex items-center gap-2.5 pb-3 border-b border-border/60">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary shrink-0">
                <HardDrive size={16} />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-foreground truncate">Stockage Cloudinary</h3>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-center justify-between text-muted-foreground gap-2">
                <span className="shrink-0">Compte Cloud :</span>
                <code className="font-mono text-foreground font-semibold truncate">xrml8uik</code>
              </div>
              <div className="flex items-center justify-between text-muted-foreground gap-2">
                <span className="shrink-0">Dossier médias :</span>
                <code className="font-mono text-primary font-semibold truncate">Landry_Media</code>
              </div>
              <div className="flex items-center justify-between text-muted-foreground gap-2">
                <span className="shrink-0">Curriculum Vitae :</span>
                <span className={`shrink-0 font-semibold ${cvUploaded ? "text-emerald-600" : "text-amber-500"}`}>
                  {cvUploaded ? "Actif sur le site" : "Non configuré"}
                </span>
              </div>
            </div>

            <Button asChild variant="outline" size="sm" className="mt-4 w-full h-9 rounded-xl text-xs gap-1.5">
              <Link to="/admin/medias">
                <FileText size={13} /> Gérer mon CV & Médias
              </Link>
            </Button>
          </div>

          {/* Carte Base de données Supabase */}
          <div className="rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-3.5 sm:p-5 shadow-xs min-w-0 overflow-hidden">
            <div className="flex items-center gap-2.5 pb-3 border-b border-border/60">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                <ShieldCheck size={16} />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-foreground truncate">Sécurité & Base</h3>
            </div>

            <div className="mt-3 space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center justify-between gap-2">
                <span className="shrink-0">Base PostgreSQL :</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Connectée
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="shrink-0">Sécurité RLS :</span>
                <span className="font-semibold text-foreground shrink-0">Active & Vérifiée</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="shrink-0">En vedette (accueil) :</span>
                <span className="font-semibold text-amber-500 shrink-0">{featuredCount} projet(s)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
