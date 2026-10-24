import { createFileRoute } from "@tanstack/react-router";
import { ResourceAdmin, type Field } from "@/components/admin/ResourceAdmin";
import { adminCertificationsQuery } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/certifications")({ component: Page });

const fields: Field[] = [
  { name: "title", label: "Titre", type: "text", required: true, max: 160 },
  { name: "issuer", label: "Organisme", type: "text", required: true, max: 160 },
  { name: "date_label", label: "Date", type: "text", required: true, max: 60, placeholder: "Ex. Janvier 2025" },
];

function Page() {
  return (
    <ResourceAdmin
      table="certifications" title="Certifications" singular="certification"
      intro="Liste « Formations » affichée dans la section Parcours de l'accueil."
      fields={fields}
      query={adminCertificationsQuery as never}
      rowTitle={(r) => String(r["title"])}
      rowMeta={(r) => `${String(r["issuer"])} · ${String(r["date_label"])}`}
    />
  );
}
