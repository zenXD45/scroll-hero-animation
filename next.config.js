/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === 'true'
const basePath = isGithubPages ? '/scroll-hero-animation' : ''

const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  ...(isGithubPages
    ? {
        output: 'export',
        basePath,
        trailingSlash: true,
        images: {
          unoptimized: true,
        },
      }
    : {}),
}

module.exports = nextConfig
