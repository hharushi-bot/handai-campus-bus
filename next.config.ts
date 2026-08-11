import type { NextConfig } from 'next'

const isGitHubPages = process.env.GITHUB_ACTIONS === 'true'
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'handai-campus-bus'
const basePath = isGitHubPages ? `/${repoName}` : ''

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath,
  assetPrefix: basePath,
  trailingSlash: true,
}

export default nextConfig
