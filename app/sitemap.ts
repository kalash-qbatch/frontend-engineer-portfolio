import type { MetadataRoute } from "next";
import { PROJECTS } from "@/constants/projects";
import { SITE } from "@/constants/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: SITE.url,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...PROJECTS.map((project) => ({
      url: `${SITE.url}/projects/${project.id}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: project.featured ? 0.9 : 0.75,
    })),
  ];
}
