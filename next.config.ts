/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "maxpharma.com.np",
      },
    ],
  },
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;
