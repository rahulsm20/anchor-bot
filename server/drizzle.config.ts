import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { config } from "./src/utils/config";

export default defineConfig({
  out: "./_drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: config.DATABASE_URL!,
  },
});
