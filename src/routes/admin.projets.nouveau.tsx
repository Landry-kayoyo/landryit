import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ProjectEditor } from "@/components/admin/ProjectEditor";
import { ListLoading } from "@/components/admin/ui";
import { adminProjectsQuery } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/projets/nouveau")({ component: NewProject });

function NewProject() {
  const { data, isPending } = useQuery(adminProjectsQuery);
  if (isPending) return <ListLoading />;
  const next = (data ?? []).reduce((m, p) => Math.max(m, p.sort_order + 1), 0);
  return <ProjectEditor row={null} nextOrder={next} />;
}
