/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Client-side configuration
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        stream: false,
        crypto: false,
      };
    }
    return config;
  },
  // Transpile pdfjs-dist
  transpilePackages: ['pdfjs-dist'],
  // Add path aliases for PDF.js
  experimental: {
    esmExternals: 'loose'
  }
}

module.exports = nextConfig