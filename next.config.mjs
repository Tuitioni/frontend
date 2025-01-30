/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: ["localhost"],
  },
  // Disable static optimization
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
  // Force dynamic rendering for authenticated routes
  reactStrictMode: true,
  staticPageGenerationTimeout: 0,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
