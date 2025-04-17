/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "maxpharma.inflancer.com",
            },
        ],
    },
    reactStrictMode: true,
    compiler: {
        styledComponents: true,
    },
};

module.exports = nextConfig;
