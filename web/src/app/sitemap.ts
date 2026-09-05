import type { MetadataRoute } from "next";
import { nav, site } from "@/lib/site";

const legal = ["/legal/privacy", "/legal/terms", "/legal/guidelines"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    ...nav.map((item) => ({
      url: `${site.url}${item.href === "/" ? "" : item.href}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: item.href === "/" ? 1 : 0.8,
    })),
    ...legal.map((href) => ({
      url: `${site.url}${href}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
