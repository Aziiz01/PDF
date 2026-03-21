/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/sign-up',
        destination: '/api/auth/register',
        permanent: true,
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
