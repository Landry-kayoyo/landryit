import { useEffect, useState } from "react";
const logo = { url: "/landry-net-logo.jpg" };

/** Bandeau affiché quand la connexion est perdue ; disparaît au retour. */
export function OfflineBanner() {
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  if (!offline) return null;
  return (
    <div role="status" aria-live="polite" className="fixed inset-x-0 bottom-0 z-[60] bg-ink px-4 py-3 text-center text-sm font-semibold text-ink-foreground">
      Vous êtes hors ligne. Vérifiez votre connexion.
    </div>
  );
}

/** Remplace toute image qui ne charge pas par le logo sur fond neutre (pas d'icône cassée). */
export function ImageFallback() {
  useEffect(() => {
    const onError = (e: Event) => {
      const img = e.target;
      if (!(img instanceof HTMLImageElement) || img.dataset["fallback"]) return;
      img.dataset["fallback"] = "1";
      img.src = logo.url;
      img.classList.add("img-fallback");
    };
    document.addEventListener("error", onError, true);
    // Images déjà en échec avant l'hydratation.
    document.querySelectorAll("img").forEach((img) => {
      if (img.complete && img.naturalWidth === 0 && img.src) onError({ target: img } as unknown as Event);
    });
    return () => document.removeEventListener("error", onError, true);
  }, []);
  return null;
}

/** Indicateur discret pendant l'ouverture d'une page. */
export function PageLoading() {
  return (
    <div role="status" aria-label="Chargement de la page" className="fixed inset-x-0 top-0 z-[70] h-1 overflow-hidden bg-secondary">
      <div className="loading-bar h-full w-1/3 bg-primary" />
    </div>
  );
}
