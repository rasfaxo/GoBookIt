/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow Appwrite storage previews from region subdomains (e.g. nyc.cloud.appwrite.io)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cloud.appwrite.io",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "nyc.cloud.appwrite.io",
        pathname: "**",
      },
      // Fallback wildcard (supported in recent Next versions) to cover any future region
      {
        protocol: "https",
        hostname: "*.cloud.appwrite.io",
        pathname: "**",
      },
    ],
    // Allow disabling optimization entirely via env for debugging upstream timeouts
    unoptimized: process.env.NEXT_PUBLIC_BYPASS_IMAGE_OPT === "1",
  },
  experimental: {
    serverActions: { bodySizeLimit: "5mb" },
  },
};

export default nextConfig;
