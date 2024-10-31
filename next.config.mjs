/** @type {import('next').NextConfig} */
const nextConfig = {images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
        port: '',
      },
    ],
  },};

export default nextConfig;
