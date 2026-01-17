/** @type {import('next').NextConfig} */

// Get repo name from environment for GitHub Pages base path
const isGithubPages = process.env.GITHUB_PAGES === 'true'
const repoName = process.env.REPO_NAME || 'game-store'
const basePath = isGithubPages ? `/${repoName}` : ''

const nextConfig = {
  // Environment variables available on client
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  // Enable static export for GitHub Pages
  output: isGithubPages ? 'export' : undefined,

  // Base path for GitHub Pages (e.g., /repo-name)
  basePath: isGithubPages ? `/${repoName}` : '',

  // Asset prefix for GitHub Pages
  assetPrefix: isGithubPages ? `/${repoName}/` : '',

  images: {
    // Use unoptimized images for static export
    unoptimized: isGithubPages,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Optimize production builds
  swcMinify: true,

  // Compress responses
  compress: true,

  // Enable React strict mode for better error detection
  reactStrictMode: false, // Disable in production to reduce bundle size

  // Cloudflare compatibility
  unoptimized: true,

  // Reduce bundle size for Cloudflare Pages
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/{{member}}',
    },
    '@radix-ui/react-icons': {
      transform: '@radix-ui/react-icons/{{member}}',
    },
  },



  // Trailing slash for GitHub Pages compatibility
  trailingSlash: isGithubPages,

  // Performance optimizations
  poweredByHeader: false,





  // Disable ESLint during build to avoid circular reference issues
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;