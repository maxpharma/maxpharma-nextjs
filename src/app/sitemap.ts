import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://maxpharma.com.np/";

  // Get current date for lastModified
  const currentDate = new Date();

  // List of static routes based on the navigation structure
  const routes = [
    // Main routes
    { url: "/", changeFrequency: "daily", priority: 1.0 },
    { url: "/about", changeFrequency: "monthly", priority: 0.8 },
    { url: "/notice", changeFrequency: "weekly", priority: 0.8 },
    { url: "/portfolio", changeFrequency: "monthly", priority: 0.8 },
    { url: "/gallery", changeFrequency: "weekly", priority: 0.7 },
    { url: "/contact", changeFrequency: "monthly", priority: 0.8 },
    { url: "/request-share", changeFrequency: "monthly", priority: 0.9 },

    // About section
    {
      url: "/about/strategic-objectives",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "/about/corporate-governance",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    { url: "/about/directors", changeFrequency: "monthly", priority: 0.7 },
    { url: "/about/team", changeFrequency: "monthly", priority: 0.7 },

    // Notice section
    {
      url: "/notice/company-news",
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "/notice/press-media-releases",
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "/notice/procurement-notices",
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "/notice/career-news",
      changeFrequency: "weekly",
      priority: 0.7,
    },
    { url: "/notice/downloads", changeFrequency: "weekly", priority: 0.7 },
  ];

  const sitemap: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified: currentDate,
    changeFrequency: route.changeFrequency as
      | "daily"
      | "weekly"
      | "monthly"
      | "yearly"
      | "always"
      | "hourly"
      | "never",
    priority: route.priority,
  }));

  return sitemap;
}
