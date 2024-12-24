/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "images.pexels.com",
      },
      {
        hostname: "drive.google.com", // Thêm dòng này
      },
    ],
  },
};

export default nextConfig;
