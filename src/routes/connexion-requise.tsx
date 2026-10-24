import { createFileRoute, Link } from "@tanstack/react-router";
import { ErrorPage, errorBtn } from "@/components/portfolio/ErrorPage";

// Page 401 réutilisable (future espace admin) : le bouton de connexion sera relié plus tard.
export const Route = createFileRoute("/connexion-requise")({
  head: () => ({
    meta: [
      { title: "Connexion requise — Landry Kayoyo" },
      { name: "description", content: "Cette page est réservée aux personnes connectées." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <ErrorPage
      code="401"
      tabTitle="Connexion requise — Landry Kayoyo"
      title="Connexion requise"
      text={<p>Cette page est réservée aux personnes connectées. Connectez-vous pour continuer.</p>}
      actions={<>
        <Link to="/" className={errorBtn.primary}>Retour à l'accueil</Link>
        <Link to="/" hash="contact" className={errorBtn.outline}>Me contacter</Link>
      </>}
    />
  ),
});
