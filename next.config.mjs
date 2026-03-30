/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactCompiler: true,
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-avatar', '@radix-ui/react-dialog', 'sonner', 'date-fns', 'recharts']
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  reactStrictMode: true,
}

export default nextConfig
