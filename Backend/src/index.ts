import "./env";
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
