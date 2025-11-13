import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
  generator: {
    client: {
      provider: "prisma-client-js",
      output: "./lib/generated/prisma",
      binaryTargets: ["native", "rhel-openssl-3.0.x"],
    },
  },
});
