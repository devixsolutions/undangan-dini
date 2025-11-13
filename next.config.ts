import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Ensure Prisma generated files and query engines are included in the build
  // This is critical for Vercel serverless functions
  outputFileTracingIncludes: {
    // Include for all API routes
    '/api/**': [
      './lib/generated/prisma/**/*',
      './lib/generated/prisma/**/*.node',
      './lib/generated/prisma/libquery_engine-rhel-openssl-3.0.x.so.node',
      './node_modules/.prisma/client/**/*',
      './node_modules/@prisma/engines/**/*',
    ],
    // Also include for all server-side code
    '**': [
      './lib/generated/prisma/libquery_engine-rhel-openssl-3.0.x.so.node',
    ],
  },
};

export default nextConfig;
