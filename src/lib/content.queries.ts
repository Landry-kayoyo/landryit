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

export const BRANDS_KEY = "partner_brands";

export interface PublicBrand {
  id: string;
  name: string;
  logo_url?: string | null;
  published: boolean;
  sort_order: number;
}

/** Logos et organisations partenaires gérés depuis l'admin. */
export const brandsQuery = queryOptions({
  queryKey: ["public", "brands"],
  queryFn: async (): Promise<PublicBrand[]> => {
    const { data } = await supabase.from("app_settings").select("value").eq("key", BRANDS_KEY).maybeSingle();
    if (data?.value && Array.isArray(data.value) && data.value.length > 0) {
      return (data.value as PublicBrand[])
        .filter((b) => b.published !== false)
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    }
    // Fallback dynamique
    const { brands: defaultBrands } = await import("@/content/portfolio");
    return defaultBrands.map((b, i) => ({
      id: `default-${i}`,
      name: b.name,
      logo_url: null,
      published: true,
      sort_order: i,
    }));
  },
  staleTime: 60_000,
});

export const IMMERSION_KEY = "gallery_immersion";

export interface PublicImmersionItem {
  id: string;
  title: string;
  tag: string;
  image_url: string;
  image_alt?: string | null;
  published: boolean;
  sort_order: number;
}

/** Photos et réalisations de la section Immersion terrain gérées depuis l'admin. */
export const immersionQuery = queryOptions({
  queryKey: ["public", "immersion"],
  queryFn: async (): Promise<PublicImmersionItem[]> => {
    const { data } = await supabase.from("app_settings").select("value").eq("key", IMMERSION_KEY).maybeSingle();
    if (data?.value && Array.isArray(data.value) && data.value.length > 0) {
      return (data.value as PublicImmersionItem[])
        .filter((item) => item.published !== false)
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    }
    return [];
  },
  staleTime: 60_000,
});
