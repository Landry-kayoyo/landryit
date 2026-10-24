import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  CheckCheck,
  Clock,
  MessageSquare,
  Reply,
  Search,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { adminMessagesQuery, type ContactMessageRow } from "@/lib/admin-data";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/messages")({
  component: AdminMessagesPage,
});

export function AdminMessagesPage() {
  const queryClient = useQueryClient();
  const { data: messages, isLoading, isError, refetch } = useQuery(adminMessagesQuery);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageRow | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "replied">("all");
  const [search, setSearch] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [replySubject, setReplySubject] = useState("");
  const [isSending, setIsSending] = useState(false);

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "read" | "replied" | "unread" }) => {
      const updateData: Record<string, unknown> = { status };
      if (status === "replied") updateData.replied_at = new Date().toISOString();
      const { error } = await supabase.from("contact_messages").update(updateData).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "messages"] }),
    onError: () => toast.error("Echec de la mise a jour"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "messages"] });
      setSelectedMessage(null);
      toast.success("Message supprime");
    },
    onError: () => toast.error("Echec de la suppression"),
  });

  const allMessages = messages ?? [];
  const unreadCount = allMessages.filter((m) => m.status === "unread").length;

  const filtered = allMessages.filter((m) => {
    if (filter === "unread" && m.status !== "unread") return false;
    if (filter === "replied" && m.status !== "replied") return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.message.toLowerCase().includes(q);
    }
    return true;
  });

  function handleOpenMessage(m: ContactMessageRow) {
    setSelectedMessage(m);
    setShowReplyForm(false);
    setReplyBody("");
    setReplySubject("Re: Contact Portfolio - Landry Kayoyo");
    if (m.status === "unread") updateStatusMutation.mutate({ id: m.id, status: "read" });
  }

  function handleCloseModal() {
    setSelectedMessage(null);
    setShowReplyForm(false);
    setReplyBody("");
  }

  function openReplyForm() {
    setShowReplyForm(true);
    if (selectedMessage && !replyBody) {
      setReplyBody(`Bonjour ${selectedMessage.name},\n\n`);
    }
  }

  async function handleSendReply() {
    if (!selectedMessage || !replyBody.trim()) return;
    setIsSending(true);
    try {
      const res = await fetch("/api/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId: selectedMessage.id,
          to: selectedMessage.email,
          toName: selectedMessage.name,
          subject: replySubject,
          body: replyBody.trim(),
          originalMessage: selectedMessage.message,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(err.error || "Erreur envoi");
      }
      queryClient.invalidateQueries({ queryKey: ["admin", "messages"] });
      // Mettre à jour localement pour afficher la réponse immédiatement
      const sentReply = replyBody.trim();
      setSelectedMessage((prev) =>
        prev
          ? {
              ...prev,
              status: "replied",
              replied_at: new Date().toISOString(),
              reply_notes: sentReply,
            }
          : null,
      );
      setShowReplyForm(false);
      setReplyBody("");
      toast.success(`Réponse envoyée à ${selectedMessage.name} ✓`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsSending(false);
    }
  }

  function formatDate(iso: string) {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    }).format(new Date(iso));
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Messages de contact</h1>
          <p className="mt-1 text-sm text-muted-foreground">Tous les messages envoyes depuis le formulaire de votre portfolio.</p>
        </div>
        {unreadCount > 0 && (
          <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-xs font-semibold text-primary">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            {unreadCount} nouveau{unreadCount > 1 ? "x" : ""} non lu{unreadCount > 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border bg-card p-3 shadow-xs">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher par nom, email ou mot-cle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-secondary/50 pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div className="flex items-center gap-1.5 self-end sm:self-center">
          <Button size="sm" variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")} className="rounded-full text-xs">Tous ({allMessages.length})</Button>
          <Button size="sm" variant={filter === "unread" ? "default" : "outline"} onClick={() => setFilter("unread")} className="rounded-full text-xs">Non lus ({unreadCount})</Button>
          <Button size="sm" variant={filter === "replied" ? "default" : "outline"} onClick={() => setFilter("replied")} className="rounded-full text-xs">Repondus</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}</div>
      ) : isError ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="text-sm font-semibold text-destructive">Impossible de charger les messages.</p>
          <Button size="sm" variant="outline" onClick={() => refetch()} className="mt-3">Reessayer</Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-muted text-muted-foreground"><MessageSquare size={22} /></div>
          <p className="mt-4 font-semibold text-foreground">Aucun message trouve</p>
          <p className="mt-1 text-xs text-muted-foreground">{search ? "Essayez avec d'autres termes." : "Les messages recus via le formulaire apparaitront ici."}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((m) => {
            const isUnread = m.status === "unread";
            const isReplied = m.status === "replied";
            return (
              <div key={m.id} onClick={() => handleOpenMessage(m)}
                className={`group cursor-pointer rounded-2xl border p-4 sm:p-5 transition-all hover:shadow-md ${isUnread ? "border-primary/40 bg-primary/5 hover:border-primary" : "border-border bg-card hover:border-border/80"}`}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold ${isUnread ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                      {m.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-foreground truncate">{m.name}</span>
                        {isUnread && <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">Nouveau</span>}
                        {isReplied && <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 text-[10px] font-semibold flex items-center gap-1"><CheckCheck size={11} /> Repondu</span>}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{m.email}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Clock size={12} /> {formatDate(m.created_at)}</span>
                </div>
                <p className="mt-3 text-sm text-foreground/80 line-clamp-2 leading-relaxed">{m.message}</p>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && handleCloseModal()}>
        {selectedMessage && (
          <DialogContent className="max-w-lg rounded-3xl border-border bg-card p-0 shadow-2xl overflow-hidden">
            <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                    {selectedMessage.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <DialogTitle className="text-lg font-bold tracking-tight text-foreground leading-tight">{selectedMessage.name}</DialogTitle>
                    <p className="text-xs text-primary font-medium mt-0.5">{selectedMessage.email}</p>
                  </div>
                </div>
                {selectedMessage.status === "replied" && (
                  <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 text-[11px] font-semibold flex items-center gap-1 shrink-0">
                    <CheckCheck size={12} /> Repondu
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Recu le {formatDate(selectedMessage.created_at)}</p>
            </DialogHeader>

            {/* Fil de conversation */}
            <div className="px-6 py-4 space-y-3 max-h-72 overflow-y-auto">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Conversation</p>

              {/* Message du visiteur */}
              <div className="flex gap-2.5">
                <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground text-[11px] font-bold">
                  {selectedMessage.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-foreground">{selectedMessage.name}</span>
                    <span className="text-[10px] text-muted-foreground">{formatDate(selectedMessage.created_at)}</span>
                  </div>
                  <div className="rounded-2xl rounded-tl-sm border border-border/80 bg-muted/40 px-4 py-3 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                </div>
              </div>

              {/* Réponse envoyée (si existe) */}
              {selectedMessage.reply_notes && selectedMessage.replied_at && (
                <div className="flex flex-row-reverse gap-2.5">
                  <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground text-[11px] font-bold">
                    LK
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-end gap-2 mb-1">
                      <span className="text-[10px] text-muted-foreground">{formatDate(selectedMessage.replied_at)}</span>
                      <span className="text-xs font-semibold text-foreground">Vous</span>
                    </div>
                    <div className="rounded-2xl rounded-tr-sm border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                      {selectedMessage.reply_notes}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {showReplyForm ? (
              <div className="px-6 pb-6 space-y-3 border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Votre reponse</p>
                  <button type="button" onClick={() => { setShowReplyForm(false); setReplyBody(""); }} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X size={15} />
                  </button>
                </div>
                <input
                  type="text"
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="Objet"
                />
                <textarea
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  rows={6}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
                  autoFocus
                />
                <div className="flex items-center justify-between gap-2">
                  <Button type="button" variant="destructive" size="sm"
                    onClick={() => { if (confirm("Supprimer ce message ?")) deleteMutation.mutate(selectedMessage.id); }}
                    className="rounded-full gap-1.5 text-xs">
                    <Trash2 size={13} /> Supprimer
                  </Button>
                  <Button type="button" size="sm" disabled={!replyBody.trim() || isSending} onClick={handleSendReply}
                    className="rounded-full gap-1.5 text-xs bg-gradient-primary text-primary-foreground shadow-sm">
                    {isSending ? (
                      <><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />Envoi...</>
                    ) : (
                      <><Send size={13} /> Envoyer</>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="px-6 pb-6 flex items-center justify-between gap-2 border-t border-border pt-4">
                <Button type="button" variant="destructive" size="sm"
                  onClick={() => { if (confirm("Supprimer ce message ?")) deleteMutation.mutate(selectedMessage.id); }}
                  className="rounded-full gap-1.5 text-xs">
                  <Trash2 size={13} /> Supprimer
                </Button>
                <div className="flex items-center gap-2">
                  {selectedMessage.status !== "replied" && (
                    <Button type="button" variant="outline" size="sm"
                      onClick={() => updateStatusMutation.mutate({ id: selectedMessage.id, status: "replied" })}
                      className="rounded-full text-xs gap-1.5">
                      <CheckCheck size={13} /> Marquer repondu
                    </Button>
                  )}
                  <Button type="button" size="sm" onClick={openReplyForm}
                    className="rounded-full bg-gradient-primary gap-1.5 text-xs text-primary-foreground shadow-sm">
                    <Reply size={13} /> Repondre
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
