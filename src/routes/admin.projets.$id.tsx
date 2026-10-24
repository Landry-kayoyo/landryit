import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ProjectEditor } from "@/components/admin/ProjectEditor";
import { EmptyState, ListLoading, LoadError } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { adminProjectQuery } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/projets/$id")({ component: EditProject });

function EditProject() {
  const { id } = Route.useParams();
  const { data, isPending, isError, refetch } = useQuery(adminProjectQuery(id));
  if (isPending) return <ListLoading />;
  if (isError) return <LoadError onRetry={() => refetch()} />;
  if (!data) return <EmptyState title="Projet introuvable" text="Ce projet n'existe pas ou a été supprimé." action={<Button asChild variant="outline"><Link to="/admin/projets">Retour aux projets</Link></Button>} />;
  return <ProjectEditor key={data.id} row={data} nextOrder={data.sort_order} />;
}
