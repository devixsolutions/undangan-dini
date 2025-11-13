import { PrismaClient } from '@/lib/generated/prisma/client';
import path from 'path';
import fs from 'fs';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
}

// For Vercel/serverless: Help Prisma locate the query engine
// Prisma searches in multiple locations, but with custom output paths we need to help it
if (process.env.NODE_ENV === 'production') {
  // Try to find and set the query engine library path
  const searchPaths = [
    // Relative to current working directory (Vercel serverless function root)
    path.join(process.cwd(), 'lib', 'generated', 'prisma', 'libquery_engine-rhel-openssl-3.0.x.so.node'),
    // Absolute paths that Vercel might use
    '/var/task/lib/generated/prisma/libquery_engine-rhel-openssl-3.0.x.so.node',
    '/vercel/path0/lib/generated/prisma/libquery_engine-rhel-openssl-3.0.x.so.node',
    // Also check node_modules (fallback)
    path.join(process.cwd(), 'node_modules', '.prisma', 'client', 'libquery_engine-rhel-openssl-3.0.x.so.node'),
  ];

  // Try to find the engine file
  for (const enginePath of searchPaths) {
    try {
      if (fs.existsSync(enginePath)) {
        // Set environment variable that Prisma uses to locate the engine
        process.env.PRISMA_QUERY_ENGINE_LIBRARY = enginePath;
        console.log(`[Prisma] Found query engine at: ${enginePath}`);
        break;
      }
    } catch (error) {
      // File system operations might fail in some environments, continue searching
    }
  }

  // If not found, log a warning but let Prisma try its default search
  if (!process.env.PRISMA_QUERY_ENGINE_LIBRARY) {
    console.warn('[Prisma] Query engine not found in expected locations, Prisma will search automatically');
    console.warn('[Prisma] Searched paths:', searchPaths);
  }
}

// Prisma Client configuration optimized for serverless (Vercel)
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

// Prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

