// import { MetadataRoute } from "next";

// export default function sitemap(): MetadataRoute.Sitemap {
//   const baseUrl = "https://maxpharma.com.np/";

//   // Get current date for lastModified
//   const currentDate = new Date();

//   // List of static routes based on the navigation structure
//   const routes = [
//     // Main routes
//     { url: "/", changeFrequency: "weekly", priority: 1.0 },
//     { url: "/about", changeFrequency: "monthly", priority: 0.8 },
//     { url: "/notice", changeFrequency: "monthly", priority: 0.8 },
//     { url: "/portfolio", changeFrequency: "monthly", priority: 0.8 },
//     { url: "/gallery", changeFrequency: "monthly", priority: 0.7 },
//     { url: "/contact", changeFrequency: "monthly", priority: 0.8 },
//     { url: "/request-share", changeFrequency: "monthly", priority: 0.9 },

//     // About section
//     {
//       url: "/about/strategic-objectives",
//       changeFrequency: "monthly",
//       priority: 0.7,
//     },
//     {
//       url: "/about/corporate-governance",
//       changeFrequency: "monthly",
//       priority: 0.7,
//     },
//     { url: "/about/directors", changeFrequency: "monthly", priority: 0.7 },
//     { url: "/about/team", changeFrequency: "monthly", priority: 0.7 },

//     // Notice section
//     {
//       url: "/notice/company-news",
//       changeFrequency: "weekly",
//       priority: 0.7,
//     },
//     {
//       url: "/notice/press-media-releases",
//       changeFrequency: "weekly",
//       priority: 0.7,
//     },
//     {
//       url: "/notice/procurement-notices",
//       changeFrequency: "weekly",
//       priority: 0.7,
//     },
//     {
//       url: "/notice/career-news",
//       changeFrequency: "weekly",
//       priority: 0.7,
//     },
//     { url: "/notice/downloads", changeFrequency: "weekly", priority: 0.7 },
//   ];

//   const sitemap: MetadataRoute.Sitemap = routes.map((route) => ({
//     url: `${baseUrl}${route.url}`,
//     lastModified: currentDate,
//     changeFrequency: route.changeFrequency as
//       | "daily"
//       | "weekly"
//       | "monthly"
//       | "yearly"
//       | "always"
//       | "hourly"
//       | "never",
//     priority: route.priority,
//   }));

//   return sitemap;
// }

import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://maxpharma.com.np/";

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
      url: "/manufacturing/producttion-department",
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
      url: "/manufacturing/research-&-development",
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: new Date(),
    },
    {
      url: "/manufacturing/store-&-logistics",
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
