// Contenu structuré des études de cas : une liste de blocs JSON, jamais du HTML.

export type RichMark = { type: "bold" | "italic" | "link"; attrs?: { href?: string } };
export type RichNode = {
  type: string;
  text?: string | undefined;
  marks?: RichMark[] | undefined;
  content?: RichNode[] | undefined;
  attrs?: Record<string, unknown> | undefined;
};
export type RichDoc = { type: "doc"; content?: RichNode[] | undefined };

export type HeadingBlock = {
  id: string;
  type: "heading";
  text: string;
  /** "half" : deux sections consécutives s'affichent côte à côte. */
  layout?: "full" | "half" | undefined;
  /** "muted" : bande de fond grisée. */
  tone?: "plain" | "muted" | undefined;
  /** "steps" : sous-titres numérotés en colonnes ; "result" : conclusion avec coche. */
  variant?: "default" | "steps" | "result" | undefined;
};
export type SubheadingBlock = { id: string; type: "subheading"; text: string };
export type ParagraphBlock = { id: string; type: "paragraph"; doc: RichDoc };
export type ListBlock = { id: string; type: "list"; style?: "bullet" | "check" | "tags"; doc: RichDoc };
export type ImageBlock = { id: string; type: "image"; url: string; alt: string; title?: string; caption?: string; note?: string };
export type MediaItem = { id: string; url: string; alt: string; title?: string; caption?: string };
export type MediaBlock = {
  id: string;
  type: "media";
  title?: string;
  caption?: string;
  layout?: "grid" | "stacked";
  items: MediaItem[];
};
export type QuoteBlock = { id: string; type: "quote"; doc: RichDoc; cite?: string };
export type CodeBlock = { id: string; type: "code"; code: string; language?: string };
export type ButtonBlock = { id: string; type: "button"; label: string; url: string };
export type DividerBlock = { id: string; type: "divider" };

export type Block =
  | HeadingBlock | SubheadingBlock | ParagraphBlock | ListBlock | ImageBlock | MediaBlock
  | QuoteBlock | CodeBlock | ButtonBlock | DividerBlock;
export type BlockType = Block["type"];

export const blockLabels: Record<BlockType, string> = {
  heading: "Titre de section",
  subheading: "Sous-titre",
  paragraph: "Paragraphe",
  list: "Liste",
  media: "Médias & Explications (1 ou plusieurs)",
  image: "Image avec légende",
  quote: "Citation",
  code: "Bloc de code",
  button: "Bouton",
  divider: "Séparateur",
};

export function newId() {
  return "b" + Math.random().toString(36).slice(2, 12);
}

export const emptyDoc = (): RichDoc => ({ type: "doc", content: [{ type: "paragraph" }] });
export const textDoc = (text: string): RichDoc => ({
  type: "doc",
  content: [{ type: "paragraph", content: text ? [{ type: "text", text }] : undefined }],
});
const listDoc = (): RichDoc => ({
  type: "doc",
  content: [{ type: "bulletList", content: [{ type: "listItem", content: [{ type: "paragraph" }] }] }],
});

export function createBlock(type: BlockType): Block {
  const id = newId();
  switch (type) {
    case "heading": return { id, type, text: "", layout: "full", tone: "plain", variant: "default" };
    case "subheading": return { id, type, text: "" };
    case "paragraph": return { id, type, doc: emptyDoc() };
    case "list": return { id, type, style: "bullet", doc: listDoc() };
    case "media": return {
      id,
      type,
      title: "",
      caption: "",
      layout: "grid",
      items: [{ id: newId(), url: "", alt: "", title: "", caption: "" }],
    };
    case "image": return { id, type, url: "", alt: "", title: "", caption: "", note: "" };
    case "quote": return { id, type, doc: emptyDoc(), cite: "" };
    case "code": return { id, type, code: "", language: "" };
    case "button": return { id, type, label: "", url: "" };
    case "divider": return { id, type };
  }
}

/** Modèle de départ guidé, entièrement modifiable et supprimable. */
export function starterTemplate(): Block[] {
  const section = (text: string, hint: string, extra: Partial<HeadingBlock> = {}): Block[] => [
    { id: newId(), type: "heading", text, layout: "full", tone: "plain", variant: "default", ...extra },
    { id: newId(), type: "paragraph", doc: textDoc(hint) },
  ];
  return [
    ...section("Contexte", "Présentez l'organisation et la situation de départ.", { layout: "half" }),
    ...section("Problème", "Quel besoin ou quelle difficulté fallait-il résoudre ?", { layout: "half" }),
    ...section("Solution", "Décrivez la solution mise en place.", { tone: "muted" }),
    ...section("Mon rôle", "Qu'avez-vous réalisé personnellement ?"),
    { id: newId(), type: "heading", text: "Technologies", layout: "full", tone: "plain", variant: "default" },
    { id: newId(), type: "list", style: "tags", doc: listDoc() },
    ...section("Résultats", "Quels résultats concrets le projet a-t-il apportés ?", { variant: "result" }),
  ];
}

/** N'autorise que les liens web, e-mail, téléphone ou internes. */
export function safeUrl(url: unknown): string | null {
  if (typeof url !== "string") return null;
  const u = url.trim();
  if (!u) return null;
  if (u.startsWith("/") && !u.startsWith("//")) return u;
  if (u.startsWith("#")) return u;
  try {
    const parsed = new URL(u);
    return ["http:", "https:", "mailto:", "tel:"].includes(parsed.protocol) ? parsed.href : null;
  } catch {
    return null;
  }
}

/** Texte brut d'un nœud riche (pour les étiquettes, la recherche, etc.). */
export function nodeText(node: RichNode | RichDoc | undefined): string {
  if (!node) return "";
  if ("text" in node && typeof node.text === "string") return node.text;
  return (node.content ?? []).map(nodeText).join(node.type === "doc" ? "\n" : "");
}

/** Éléments d'une liste (un par puce). */
export function listItems(doc: RichDoc): RichNode[] {
  const out: RichNode[] = [];
  for (const n of doc.content ?? []) {
    if (n.type === "bulletList" || n.type === "orderedList") out.push(...(n.content ?? []));
  }
  return out;
}

/** Validation défensive d'un contenu venu de la base. */
export function parseBlocks(value: unknown): Block[] {
  if (!Array.isArray(value)) return [];
  return value.filter((b): b is Block => !!b && typeof b === "object" && typeof (b as Block).type === "string" && typeof (b as Block).id === "string" && (b as Block).type in blockLabels);
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
