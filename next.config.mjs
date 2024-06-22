/** @type {import('next').NextConfig} */
const nextConfig = {
  // api: {
  //   bodyParser: false, // Disallow body parsing, to consume as stream
  // },
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
};

export default nextConfig;
