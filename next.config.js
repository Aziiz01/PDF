/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  async redirects() {
    return [
      {
        source: '/sign-up',
        destination: '/register',
        permanent: false,
      },
      {
        source: '/sign-out',
        destination: '/api/auth/logout',
        permanent: true,
      },
    ]
  },

  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, webpack }
  ) => {
    config.resolve.alias.canvas = false
    config.resolve.alias.encoding = false
    return config
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
}

module.exports = nextConfig
