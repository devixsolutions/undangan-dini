import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic", // biar Prisma pakai query engine lama yang stabil di Vercel
  datasource: {
    url: env("DATABASE_URL"),
  },
});
