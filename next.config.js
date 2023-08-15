/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  appDir: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.datocms-assets.com",
        port: "",
        pathname: "/99564/*",
      },
    ],
  },
};

module.exports = nextConfig;
