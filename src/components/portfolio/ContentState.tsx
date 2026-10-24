import { RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

/** Squelettes discrets pendant le chargement d'une liste. */
export function ContentLoading({ rows = 3, className = "h-28" }: { rows?: number; className?: string }) {
  return (
    <div role="status" aria-label="Chargement" className="space-y-4">
      {Array.from({ length: rows }, (_, i) => <Skeleton key={i} className={`w-full rounded-2xl ${className}`} />)}
    </div>
  );
}

/** Message propre en cas d'échec, sans détail technique. */
export function ContentError({ onRetry, label = "ce contenu" }: { onRetry?: () => void; label?: string }) {
  return (
    <div role="alert" className="rounded-2xl border border-border bg-card p-6 text-center shadow-card">
      <p className="font-semibold">Impossible d'afficher {label} pour le moment.</p>
      <p className="mt-1 text-sm text-muted-foreground">Vérifiez votre connexion puis réessayez.</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-5 text-sm font-semibold transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <RefreshCw size={16} /> Réessayer
        </button>
      )}
    </div>
  );
}
