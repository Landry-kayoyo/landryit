import { queryOptions } from "@tanstack/react-query";
import {
  getPublishedProject, listPublishedCertifications, listPublishedExperiences, listPublishedProjects,
} from "@/lib/content.functions";
import { supabase } from "@/integrations/supabase/client";

export type PublicProject = Awaited<ReturnType<typeof listPublishedProjects>>[number];
export type PublicExperience = Awaited<ReturnType<typeof listPublishedExperiences>>[number];

export const projectsQuery = queryOptions({ queryKey: ["public", "projects"], queryFn: () => listPublishedProjects(), staleTime: 60_000 });
export const experiencesQuery = queryOptions({ queryKey: ["public", "experiences"], queryFn: () => listPublishedExperiences(), staleTime: 60_000 });
export const certificationsQuery = queryOptions({ queryKey: ["public", "certifications"], queryFn: () => listPublishedCertifications(), staleTime: 60_000 });
export const projectQuery = (slug: string) =>
  queryOptions({ queryKey: ["public", "project", slug], queryFn: () => getPublishedProject({ data: { slug } }), staleTime: 60_000 });

/** URL du CV stockée dans app_settings (mise à jour depuis l'admin Médias). */
export const cvUrlQuery = queryOptions({
  queryKey: ["public", "cv_url"],
  queryFn: async () => {
    const { data } = await supabase.from("app_settings").select("value").eq("key", "cv_url").maybeSingle();
    if (!data?.value) return null;
    if (typeof data.value === "string") return data.value;
    if (typeof data.value === "object" && "url" in data.value) return (data.value as { url: string }).url;
    return String(data.value);
  },
  staleTime: 5 * 60_000,
});
