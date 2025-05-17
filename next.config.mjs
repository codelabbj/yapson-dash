/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "api.yapson.net",
      "api.coobet.codelabbenin.com",
        "api.betpayapp.com",
    ],
    remotePatterns: [],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
