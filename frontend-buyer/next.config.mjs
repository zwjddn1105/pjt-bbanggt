/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // 빌드시 eslint 무시
  },
  reactStrictMode: false, // Strict Mode 비활성화
};

export default nextConfig;
