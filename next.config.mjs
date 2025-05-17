/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "api.yapson.com",
      "api.coobet.codelabbenin.com"
    ],
    remotePatterns: [],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
