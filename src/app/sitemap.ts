import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://maxpharma.com.np";

  const pages = [
    {
      url: "/",
      priority: 1,
      changeFrequency: "weekly",
      lastModified: new Date(),
    },
    {
      url: "/about",
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: new Date(),
    },
    {
      url: "/about/message-from-chairperson",
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: new Date(),
    },
    {
      url: "/about/organization-hierarchy",
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: new Date(),
    },
    {
      url: "/products",
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: new Date(),
    },
    {
      url: "/products/manufactured-products",
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: new Date(),
    },
    {
      url: "/manufacturing/production-department",
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: new Date(),
    },
    {
      url: "/manufacturing/quality-control",
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: new Date(),
    },
    {
      url: "/manufacturing/quality-assurance",
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: new Date(),
    },
    {
      url: "/manufacturing/research-&amp;-development",
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: new Date(),
    },
    {
      url: "/manufacturing/store-&amp;-logistics",
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: new Date(),
    },
    {
      url: "/notice/important-notice",
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: new Date(),
    },
    {
      url: "/notice/career-notice",
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: new Date(),
    },
    {
      url: "/gallery",
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: new Date(),
    },
    {
      url: "/gallery/videos",
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: new Date(),
    },
    {
      url: "/contact",
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: new Date(),
    },
  ];

  return pages.map((page) => ({
    url: `${baseUrl}${page.url}`,
    lastModified: page.lastModified,
    changeFrequency: page.changeFrequency as
      | "monthly"
      | "yearly"
      | "weekly"
      | "always"
      | "hourly"
      | "daily"
      | "never",
    priority: page.priority,
  }));
}
