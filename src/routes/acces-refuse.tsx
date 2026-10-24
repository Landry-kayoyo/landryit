import { createFileRoute, Link } from "@tanstack/react-router";
import { ErrorPage, errorBtn } from "@/components/portfolio/ErrorPage";

// Page 403 réutilisable (future espace admin).
export const Route = createFileRoute("/acces-refuse")({
  head: () => ({
    meta: [
      { title: "Accès refusé — Landry Kayoyo" },
      { name: "description", content: "Vous n'avez pas l'autorisation d'accéder à cette page." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <ErrorPage
      code="403"
      tabTitle="Accès refusé — Landry Kayoyo"
      title="Accès refusé"
      text={<p>Vous n'avez pas l'autorisation d'accéder à cette page. Si vous pensez qu'il s'agit d'une erreur, contactez-moi.</p>}
      actions={<>
        <Link to="/" className={errorBtn.primary}>Retour à l'accueil</Link>
        <Link to="/" hash="contact" className={errorBtn.outline}>Me contacter</Link>
      </>}
    />
  ),
});
