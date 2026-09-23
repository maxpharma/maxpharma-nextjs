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
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  trailingSlash: true,
};
export default nextConfig;
