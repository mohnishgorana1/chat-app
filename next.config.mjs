/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      // {
      //   protocol: "https",
      //   hostname: "sleek-capybara-771.convex.cloud",
      // },
    ],
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: "/api/socket",
  //       destination: "/api/socket",
  //     },
  //   ];
  // },
};

export default nextConfig;
