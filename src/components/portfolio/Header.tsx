import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
const logo = { url: "/landry-net-logo.jpg" };
import { nav } from "@/content/portfolio";

const desktopLink = "rounded-md text-sm font-medium text-muted-foreground transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring";
const mobileLink = "border-b border-border py-3.5 font-medium text-foreground last:border-0";

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-card">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 md:h-20 md:px-8">
        <Link to="/" hash="top" className="flex shrink-0 items-center gap-2.5 rounded-md whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <img src={logo.url} alt="" width={880} height={880} className="h-9 w-9 shrink-0 rounded-md sm:h-10 sm:w-10" />
          <span className="font-sans text-lg font-bold uppercase tracking-wide sm:text-xl"><span className="text-primary">Landry</span> <span className="text-foreground">Net</span></span>
        </Link>
        <nav aria-label="Navigation principale" className="hidden items-center gap-8 md:flex">
          {nav.slice(0, 4).map((n) => "to" in n
            ? <Link key={n.label} to={n.to} className={desktopLink}>{n.label}</Link>
            : <Link key={n.label} to="/" hash={n.href.slice(1)} className={desktopLink}>{n.label}</Link>)}
        </nav>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex"><Button asChild className="rounded-full bg-gradient-primary px-5"><Link to="/" hash="contact">Me contacter</Link></Button></span>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button>
        </div>
      </div>
      {open && <nav aria-label="Navigation mobile" className="border-t border-border bg-background md:hidden"><div className="mx-auto flex max-w-6xl flex-col px-5 py-3">{nav.map((n) => "to" in n
        ? <Link key={n.label} to={n.to} onClick={() => setOpen(false)} className={mobileLink}>{n.label}</Link>
        : <Link key={n.label} to="/" hash={n.href.slice(1)} onClick={() => setOpen(false)} className={mobileLink}>{n.label}</Link>)}</div></nav>}
    </header>
  );
}
