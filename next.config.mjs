//@ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "digitalmarketplace-production-5a5c.up.railway.app",
        pathname: "**",
        port: "",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
