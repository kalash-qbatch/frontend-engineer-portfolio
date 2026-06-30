import type { MetadataRoute } from "next";
import { SITE } from "@/constants/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.seoTitle,
    short_name: SITE.firstName,
    description: SITE.seoDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#080808",
    theme_color: "#8b5cf6",
    lang: "en-US",
    categories: ["portfolio", "business", "productivity"],
    icons: [
      {
        src: "/favicon.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
