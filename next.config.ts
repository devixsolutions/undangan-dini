import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Ensure Prisma generated files and query engines are included in the build
  // This is critical for Vercel serverless functions
  outputFileTracingIncludes: {
    '/api/**': [
      './lib/generated/prisma/**/*',
      './lib/generated/prisma/**/*.node',
      './node_modules/.prisma/client/**/*',
      './node_modules/@prisma/engines/**/*',
    ],
  },
};

export default nextConfig;
