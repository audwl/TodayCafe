import type { MetadataRoute } from "next";

const baseUrl = "https://todaycafe.audwl44.workers.dev";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/suggest/`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
