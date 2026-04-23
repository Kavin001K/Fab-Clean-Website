import fs from "fs";
import path from "path";

try {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath) && typeof process.loadEnvFile === "function") {
    process.loadEnvFile(envPath);
  }
} catch (err) {
  // Ignore errors; environment variables are likely set by the host (e.g., Render)
}

import app from "./app";
import { logger } from "./lib/logger";

const requiredEnv = ["PORT", "DATABASE_URL", "SUPABASE_URL", "SUPABASE_SERVICE_KEY"] as const;

for (const name of requiredEnv) {
  if (!process.env[name]?.trim()) {
    throw new Error(`${name} environment variable is required but was not provided.`);
  }
}

const rawPort = process.env["PORT"];

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, "0.0.0.0", () => {
  logger.info({ port }, "Server listening on 0.0.0.0");
});
