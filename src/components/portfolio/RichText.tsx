import type { ReactNode } from "react";
import { safeUrl, type RichDoc, type RichNode } from "@/lib/blocks";

// Rendu sûr du texte riche : chaque nœud devient un élément React connu ;
// aucun HTML n'est injecté, les liens dangereux (javascript:, data:…) sont ignorés.

function renderText(node: RichNode, key: number): ReactNode {
  let out: ReactNode = node.text ?? "";
  for (const mark of node.marks ?? []) {
    if (mark.type === "bold") out = <strong className="font-semibold text-foreground">{out}</strong>;
    else if (mark.type === "italic") out = <em>{out}</em>;
    else if (mark.type === "link") {
      const href = safeUrl(mark.attrs?.href);
      if (href) {
        const external = /^https?:/.test(href);
        out = <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer noopener" : undefined} className="font-medium text-primary underline underline-offset-4">{out}</a>;
      }
    }
  }
  return <span key={key}>{out}</span>;
}

function renderInline(nodes: RichNode[] | undefined): ReactNode[] {
  return (nodes ?? []).map((n, i) => (n.type === "text" ? renderText(n, i) : n.type === "hardBreak" ? <br key={i} /> : null));
}

export function RichNodes({ nodes, pClass }: { nodes: RichNode[] | undefined; pClass?: string | undefined }) {
  return (
    <>
      {(nodes ?? []).map((n, i) => {
        switch (n.type) {
          case "paragraph": return <p key={i} className={pClass}>{renderInline(n.content)}</p>;
          case "bulletList": return <ul key={i} className={`${pClass ?? ""} list-disc space-y-2 pl-6`}>{(n.content ?? []).map((li, j) => <li key={j}><RichNodes nodes={li.content} /></li>)}</ul>;
          case "orderedList": return <ol key={i} className={`${pClass ?? ""} list-decimal space-y-2 pl-6`}>{(n.content ?? []).map((li, j) => <li key={j}><RichNodes nodes={li.content} /></li>)}</ol>;
          case "text": return renderText(n, i);
          default: return null;
        }
      })}
    </>
  );
}

/** Contenu d'un élément de liste, sans balise <p> englobante. */
export function InlineItem({ item }: { item: RichNode }) {
  const parts = (item.content ?? []).flatMap((c) => (c.type === "paragraph" ? c.content ?? [] : []));
  return <>{renderInline(parts)}</>;
}

export function RichText({ doc, pClass }: { doc: RichDoc | undefined; pClass?: string | undefined }) {
  return <RichNodes nodes={doc?.content} pClass={pClass} />;
}
