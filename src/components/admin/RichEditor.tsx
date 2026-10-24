import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Bold, Italic, Link2, List, ListOrdered, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { safeUrl, type RichDoc } from "@/lib/blocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

/** Modal personnalisé pour saisir/modifier un lien */
function LinkDialog({
  open,
  initial,
  onClose,
  onConfirm,
  onRemove,
}: {
  open: boolean;
  initial: string;
  onClose: () => void;
  onConfirm: (url: string) => void;
  onRemove: () => void;
}) {
  const [url, setUrl] = useState(initial);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setUrl(initial || "https://");
      setError("");
      setTimeout(() => inputRef.current?.select(), 80);
    }
  }, [open, initial]);

  function confirm() {
    const trimmed = url.trim();
    if (!trimmed) { onRemove(); return; }
    const safe = safeUrl(trimmed);
    if (!safe) { setError("Adresse non valide. Utilisez https://, mailto: ou tel:"); return; }
    onConfirm(safe);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="w-[calc(100vw-1.5rem)] max-w-sm rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border border-border bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold">
            <Link2 size={18} className="text-primary" />
            {initial ? "Modifier le lien" : "Ajouter un lien"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-1">
          <div className="space-y-1.5">
            <Label htmlFor="link-url" className="text-sm font-medium">
              Adresse URL
            </Label>
            <Input
              id="link-url"
              ref={inputRef}
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(""); }}
              placeholder="https://exemple.com ou mailto:…"
              className="h-11 text-base sm:text-sm"
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); confirm(); } }}
            />
            {error && <p className="text-xs font-medium text-destructive">{error}</p>}
            <p className="text-xs text-muted-foreground">
              Formats acceptés : <code className="text-xs">https://</code>, <code className="text-xs">mailto:</code>, <code className="text-xs">tel:</code>
            </p>
          </div>
        </div>
        <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between pt-2">
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
            {initial && (
              <Button type="button" variant="ghost" size="sm" className="min-h-10 text-destructive hover:text-destructive hover:bg-destructive/10 w-full sm:w-auto" onClick={onRemove}>
                <X size={14} /> Supprimer le lien
              </Button>
            )}
            <Button type="button" variant="outline" size="sm" className="min-h-10 w-full sm:w-auto" onClick={onClose}>
              Annuler
            </Button>
          </div>
          <Button type="button" size="sm" className="min-h-10 w-full sm:w-auto bg-gradient-primary" onClick={confirm}>
            {initial ? "Mettre à jour" : "Insérer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Éditeur de texte riche limité : gras, italique, liens, listes. Sortie en JSON. */
export function RichEditor({ value, onChange, lists = true, placeholder }: { value: RichDoc; onChange: (doc: RichDoc) => void; lists?: boolean; placeholder?: string }) {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkInitial, setLinkInitial] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: false, codeBlock: false, blockquote: false, horizontalRule: false, code: false, strike: false, link: false, underline: false }),
      Link.configure({ openOnClick: false, autolink: true, protocols: ["http", "https", "mailto", "tel"], isAllowedUri: (url) => !!safeUrl(url) }),
    ],
    content: value as never,
    editorProps: { attributes: { class: "rich-editor min-h-[3.5rem] px-3 py-2.5 text-sm leading-relaxed focus:outline-none", "aria-label": placeholder ?? "Texte" } },
    onUpdate: ({ editor: e }) => onChange(e.getJSON() as RichDoc),
  });

  if (!editor) return <div className="min-h-[5.5rem] rounded-md border border-input bg-background" />;

  const btn = (active: boolean) =>
    `grid h-9 w-9 place-items-center rounded-md transition-colors ${active ? "bg-accent text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`;

  function openLinkDialog() {
    const prev = editor!.getAttributes("link")["href"] as string | undefined;
    setLinkInitial(prev ?? "");
    setLinkDialogOpen(true);
  }

  function handleLinkConfirm(url: string) {
    editor!.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    setLinkDialogOpen(false);
  }

  function handleLinkRemove() {
    editor!.chain().focus().unsetLink().run();
    setLinkDialogOpen(false);
  }

  return (
    <>
      <div className="rounded-md border border-input bg-background">
        <div className="flex flex-wrap gap-1 border-b border-border p-1">
          <button type="button" aria-label="Gras" className={btn(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={16} /></button>
          <button type="button" aria-label="Italique" className={btn(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={16} /></button>
          <button type="button" aria-label="Lien" className={btn(editor.isActive("link"))} onClick={openLinkDialog}><Link2 size={16} /></button>
          {lists && <>
            <button type="button" aria-label="Liste à puces" className={btn(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={16} /></button>
            <button type="button" aria-label="Liste numérotée" className={btn(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={16} /></button>
          </>}
        </div>
        <EditorContent editor={editor} />
      </div>
      <LinkDialog
        open={linkDialogOpen}
        initial={linkInitial}
        onClose={() => setLinkDialogOpen(false)}
        onConfirm={handleLinkConfirm}
        onRemove={handleLinkRemove}
      />
    </>
  );
}
