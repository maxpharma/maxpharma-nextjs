const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

const corsHeaders = [
  { key: "Access-Control-Allow-Origin", value: "*" },
  {
    key: "Access-Control-Allow-Methods",
    value: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  },
  {
    key: "Access-Control-Allow-Headers",
    value: "Content-Type, Authorization, Api-Key",
  },
  { key: "Access-Control-Max-Age", value: "86400" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  poweredByHeader: false,
  compress: true,
  images: {
    minimumCacheTTL: 86400,
    formats: ["image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "iservers.blr1.cdn.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname: "blr1.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname: "maxpharma.com.np",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  reactStrictMode: true,
  // sequelize requires all its dialect modules (incl. postgres/pg-hstore,
  // unused here — this app is mysql2-only) at import time; bundling it
  // fails the build. Keep it external so Node resolves it at runtime.
  serverExternalPackages: ["sequelize"],
  // trailingSlash below is fine for pages, but Next was also 308-redirecting
  // /api/* to add a trailing slash — a redirect carries no CORS headers, so
  // it broke OPTIONS preflights and any cross-origin/non-browser (mobile)
  // client that doesn't follow redirects on POST/PATCH. This opts API routes
  // out of that redirect while leaving page routing untouched.
  skipTrailingSlashRedirect: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  trailingSlash: true,
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [...corsHeaders, ...securityHeaders],
      },
    ];
  },
};
export default nextConfig;
