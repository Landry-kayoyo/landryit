import type { ReactNode } from "react";
import { AlertTriangle, Inbox, Loader2, RefreshCw, Search, SlidersHorizontal } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export function PageHeader({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {text && <p className="mt-1 text-sm text-muted-foreground max-w-lg">{text}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function ListLoading() {
  return (
    <div role="status" aria-label="Chargement" className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <Skeleton className="h-14 w-20 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3 rounded-lg" />
            <Skeleton className="h-3 w-1/2 rounded-lg" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20 rounded-lg" />
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-9 w-9 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-accent/60 text-primary">
        <Inbox size={28} />
      </div>
      <p className="mt-4 text-base font-semibold">{title}</p>
      <p className="mt-1.5 text-sm text-muted-foreground max-w-xs mx-auto">{text}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function LoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert" className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-destructive/10 text-destructive mb-4">
        <AlertTriangle size={22} />
      </div>
      <p className="font-semibold text-foreground">Le contenu n'a pas pu être chargé.</p>
      <p className="mt-1 text-sm text-muted-foreground">Vérifiez votre connexion et réessayez.</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 min-h-11 rounded-full border border-border bg-card px-5 text-sm font-semibold hover:bg-secondary transition-colors"
      >
        <RefreshCw size={14} /> Réessayer
      </button>
    </div>
  );
}

export type SortKey = "order" | "title" | "recent";

export function Toolbar({
  search,
  onSearch,
  sort,
  onSort,
  count,
}: {
  search: string;
  onSearch: (v: string) => void;
  sort: SortKey;
  onSort: (v: SortKey) => void;
  count?: number;
}) {
  return (
    <div className="mb-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Rechercher</span>
          <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Rechercher…"
            className="h-11 bg-card pl-10 rounded-xl border-border"
          />
        </label>
        <label className="flex items-center gap-2 text-sm shrink-0">
          <SlidersHorizontal size={14} className="text-muted-foreground" />
          <span className="sr-only sm:not-sr-only text-muted-foreground">Trier par</span>
          <select
            value={sort}
            onChange={(e) => onSort(e.target.value as SortKey)}
            className="h-11 rounded-xl border border-input bg-card px-3 text-sm font-medium"
          >
            <option value="order">Ordre d'affichage</option>
            <option value="title">Titre (A→Z)</option>
            <option value="recent">Plus récents</option>
          </select>
        </label>
      </div>
      {count !== undefined && (
        <p className="mt-2 text-xs text-muted-foreground">
          {count === 0 ? "Aucun résultat" : `${count} élément${count > 1 ? "s" : ""}`}
          {search && ` pour « ${search} »`}
        </p>
      )}
    </div>
  );
}

export function StatusBadge({ published }: { published: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        published
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "bg-secondary text-muted-foreground"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${published ? "bg-emerald-500" : "bg-muted-foreground"}`} />
      {published ? "Publié" : "Brouillon"}
    </span>
  );
}

export function ConfirmDelete({
  open,
  onOpenChange,
  label,
  title = "Supprimer définitivement ?",
  description,
  onConfirm,
  busy,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  label: string;
  title?: string;
  description?: React.ReactNode;
  onConfirm: () => void;
  busy?: boolean;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[calc(100vw-1.5rem)] max-w-md rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border border-destructive/20 bg-card">
        <AlertDialogHeader className="space-y-3 text-left">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-destructive/15 text-destructive">
              <AlertTriangle size={24} />
            </div>
            <AlertDialogTitle className="text-lg sm:text-xl font-bold text-foreground">
              {title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-sm leading-relaxed text-muted-foreground pt-1">
            {description ?? (
              <>
                Êtes-vous sûr de vouloir supprimer <strong className="text-foreground">« {label} »</strong> ?
                <span className="mt-2 flex items-center gap-1.5 rounded-xl bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive">
                  <AlertTriangle size={13} />
                  Cette action est irréversible et ne peut pas être annulée.
                </span>
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-3">
          <AlertDialogCancel className="min-h-11 w-full sm:w-auto">Annuler</AlertDialogCancel>
          <AlertDialogAction
            className="min-h-11 w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
          >
            {busy && <Loader2 className="animate-spin" />} Supprimer définitivement
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function FieldError({ message }: { message?: string | undefined }) {
  return message ? <p className="text-xs font-medium text-destructive">{message}</p> : null;
}

/** Filtre + tri communs aux listes d'administration. */
export function applyListView<T extends { sort_order: number; created_at: string }>(items: T[], search: string, sort: SortKey, text: (i: T) => string, title: (i: T) => string): T[] {
  const q = search.trim().toLowerCase();
  const out = q ? items.filter((i) => text(i).toLowerCase().includes(q)) : [...items];
  if (sort === "title") out.sort((a, b) => title(a).localeCompare(title(b), "fr"));
  else if (sort === "recent") out.sort((a, b) => b.created_at.localeCompare(a.created_at));
  else out.sort((a, b) => a.sort_order - b.sort_order);
  return out;
}
