import { useMemo, useState, type FormEvent } from "react";
import { useQuery, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { saveOrder } from "@/lib/admin-data";
import { SortableList } from "@/components/admin/SortableList";
import {
  ConfirmDelete, EmptyState, FieldError, ListLoading, LoadError, PageHeader, Toolbar, applyListView, type SortKey,
} from "@/components/admin/ui";

export type Field = {
  name: string;
  label: string;
  type: "text" | "textarea" | "select";
  required?: boolean;
  max: number;
  options?: { value: string; label: string }[];
  placeholder?: string;
};

type Row = { id: string; sort_order: number; created_at: string; published: boolean } & Record<string, unknown>;

export function ResourceAdmin({
  table, title, intro, singular, fields, query, rowTitle, rowMeta,
}: {
  table: "experiences" | "certifications";
  title: string;
  intro: string;
  singular: string;
  fields: Field[];
  query: { queryKey: QueryKey; queryFn: () => Promise<Row[]> };
  rowTitle: (r: Row) => string;
  rowMeta: (r: Row) => string;
}) {
  const qc = useQueryClient();
  const { data, isPending, isError, refetch } = useQuery({ queryKey: query.queryKey, queryFn: query.queryFn });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("order");
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [deleting, setDeleting] = useState<Row | null>(null);
  const [busy, setBusy] = useState(false);

  const view = useMemo(
    () => applyListView(data ?? [], search, sort, (r) => fields.map((f) => String(r[f.name] ?? "")).join(" "), rowTitle),
    [data, search, sort, fields, rowTitle],
  );
  const canReorder = sort === "order" && !search.trim();
  const refresh = () => Promise.all([qc.invalidateQueries({ queryKey: query.queryKey }), qc.invalidateQueries({ queryKey: ["public"] })]);

  async function reorder(items: Row[]) {
    qc.setQueryData(query.queryKey, items.map((r, i) => ({ ...r, sort_order: i })));
    try { await saveOrder(table, items); toast.success("Ordre enregistré"); }
    catch { toast.error("L'ordre n'a pas pu être enregistré."); }
    await refresh();
  }

  async function togglePublish(r: Row) {
    const { error } = await supabase.from(table).update({ published: !r.published }).eq("id", r.id);
    if (error) toast.error("Modification impossible. Réessayez.");
    else toast.success(r.published ? "Élément masqué" : "Élément publié");
    await refresh();
  }

  async function remove() {
    if (!deleting) return;
    setBusy(true);
    const { error } = await supabase.from(table).delete().eq("id", deleting.id);
    setBusy(false);
    if (error) { toast.error("Suppression impossible. Réessayez."); return; }
    toast.success("Élément supprimé");
    setDeleting(null);
    await refresh();
  }

  const addButton = <Button onClick={() => setEditing("new")} className="min-h-11 rounded-full bg-gradient-primary"><Plus /> Ajouter</Button>;

  return (
    <>
      <PageHeader title={title} text={intro} action={addButton} />
      <Toolbar search={search} onSearch={setSearch} sort={sort} onSort={setSort} count={view.length} />
      {!canReorder && data && data.length > 1 && <p className="mb-4 text-xs text-muted-foreground">💡 Glisser-déposer disponible avec le tri « Ordre d'affichage » sans recherche active.</p>}
      {isPending ? <ListLoading /> : isError ? <LoadError onRetry={() => refetch()} /> : view.length === 0 ? (
        <EmptyState title={search ? "Aucun résultat" : "Rien pour l'instant"} text={search ? "Essayez un autre mot-clé." : `Ajoutez votre premier élément : ${singular}.`} action={search ? undefined : addButton} />
      ) : (
        <div className="space-y-2.5">
        <SortableList items={view} onReorder={reorder} disabled={!canReorder} render={(r, handle) => (
          <div
            role="button"
            tabIndex={0}
            onClick={() => setEditing(r)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setEditing(r);
              }
            }}
            className="group relative flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-3 sm:p-4 shadow-xs transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:bg-accent/5 cursor-pointer sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              {canReorder && (
                <div onClick={(e) => e.stopPropagation()} className="cursor-grab active:cursor-grabbing text-muted-foreground/60 hover:text-foreground">
                  {handle}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
                  {rowTitle(r)}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{rowMeta(r)}</p>
              </div>
            </div>

            <div
              className="flex items-center justify-between sm:justify-end gap-2 pt-2 border-t border-border/40 sm:border-0 sm:pt-0 sm:shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Badge statut interactif */}
              <button
                type="button"
                onClick={() => togglePublish(r)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                  r.published
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80 border border-border"
                }`}
                title={r.published ? "Cliquer pour masquer" : "Cliquer pour publier"}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${r.published ? "bg-emerald-500" : "bg-muted-foreground"}`}
                />
                {r.published ? "Publié" : "Brouillon"}
              </button>

              {/* Bouton Supprimer */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                aria-label="Supprimer"
                title="Supprimer définitivement"
                onClick={() => setDeleting(r)}
              >
                <Trash2 size={15} />
              </Button>
            </div>
          </div>
        )} />
        </div>
      )}
      {editing && (
        <EditDialog
          table={table} fields={fields} singular={singular} row={editing === "new" ? null : editing}
          nextOrder={(data ?? []).reduce((m, r) => Math.max(m, r.sort_order + 1), 0)}
          onClose={() => setEditing(null)} onSaved={refresh}
        />
      )}
      <ConfirmDelete open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)} label={deleting ? rowTitle(deleting) : ""} onConfirm={remove} busy={busy} />
    </>
  );
}

function EditDialog({ table, fields, singular, row, nextOrder, onClose, onSaved }: {
  table: "experiences" | "certifications"; fields: Field[]; singular: string; row: Row | null; nextOrder: number;
  onClose: () => void; onSaved: () => Promise<unknown>;
}) {
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(fields.map((f) => [f.name, String(row?.[f.name] ?? f.options?.[0]?.value ?? "")])));
  const [published, setPublished] = useState(row?.published ?? true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    for (const f of fields) {
      const v = (values[f.name] ?? "").trim();
      if (f.required && !v) errs[f.name] = "Ce champ est obligatoire.";
      else if (v.length > f.max) errs[f.name] = `${f.max} caractères maximum.`;
      else if (f.options && !f.options.some((o) => o.value === v)) errs[f.name] = "Choix invalide.";
    }
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    const payload = { ...Object.fromEntries(fields.map((f) => [f.name, (values[f.name] ?? "").trim()])), published };
    const { error } = row
      ? await supabase.from(table).update(payload as never).eq("id", row.id)
      : await supabase.from(table).insert({ ...payload, sort_order: nextOrder } as never);
    setBusy(false);
    if (error) { toast.error("Enregistrement impossible. Vérifiez les champs et réessayez."); return; }
    toast.success(row ? "Modifications enregistrées" : "Élément ajouté");
    await onSaved();
    onClose();
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92dvh] w-[calc(100vw-1rem)] sm:w-[calc(100vw-2rem)] max-w-lg overflow-y-auto rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-border bg-card">
        <DialogHeader className="text-left pb-2">
          <DialogTitle className="text-lg sm:text-xl font-bold">{row ? "Modifier" : "Ajouter"} : {singular}</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">Les champs marqués d'un astérisque sont obligatoires.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4" noValidate>
          {fields.map((f) => (
            <div key={f.name} className="space-y-1.5">
              <Label htmlFor={f.name} className="text-sm font-medium">{f.label}{f.required && " *"}</Label>
              {f.type === "textarea" ? (
                <Textarea id={f.name} rows={3} className="text-base sm:text-sm" value={values[f.name]} placeholder={f.placeholder} onChange={(e) => setValues({ ...values, [f.name]: e.target.value })} />
              ) : f.type === "select" ? (
                <select id={f.name} value={values[f.name]} onChange={(e) => setValues({ ...values, [f.name]: e.target.value })} className="h-11 w-full rounded-md border border-input bg-background px-3 text-base sm:text-sm">
                  {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ) : (
                <Input id={f.name} className="h-11 text-base sm:text-sm" value={values[f.name]} placeholder={f.placeholder} onChange={(e) => setValues({ ...values, [f.name]: e.target.value })} />
              )}
              <FieldError message={errors[f.name]} />
            </div>
          ))}
          <label className="flex min-h-12 items-center justify-between gap-3 rounded-xl border border-border px-4 py-2">
            <span className="text-sm font-medium">Publié sur le site</span>
            <Switch checked={published} onCheckedChange={setPublished} />
          </label>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
            <Button type="button" variant="outline" className="min-h-11 w-full sm:w-auto" onClick={onClose}>Annuler</Button>
            <Button type="submit" disabled={busy} className="min-h-11 w-full sm:w-auto bg-gradient-primary">{busy && <Loader2 className="animate-spin" />} Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
