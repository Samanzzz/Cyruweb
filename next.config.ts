import type {NextConfig} from 'next';

// Replace `my-repo-name` with the name of your GitHub repository.
const repoName = 'my-repo-name';

const isGithubActions = process.env.GITHUB_ACTIONS === 'true';

const nextConfig: NextConfig = {
  output: 'export',
  // Summer 2027 page gate (src/app/summer-2027/gate.ts). Always defined, so the build can drop the gated page.
  env: { SUMMER_2027: process.env.SUMMER_2027 === 'live' ? 'live' : 'gated' },
  // IMPORTANT: Replace `my-repo-name` with your repository name below.
  basePath: isGithubActions ? `/${repoName}` : '',
  assetPrefix: isGithubActions ? `/${repoName}/` : '',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // Required for static export.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
