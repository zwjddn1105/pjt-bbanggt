/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["palgona.s3.ap-northeast-2.amazonaws.com"], // 정확한 S3 도메인으로 수정
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  basePath: "/buyer",
};

export default nextConfig;
