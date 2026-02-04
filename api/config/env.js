import fs from "fs";
import dotenv from "dotenv";

export function loadEnvVariables() {
  const envPath = `./api/config/.env.${process.env.NODE_ENV}`;

  if (process.env.NODE_ENV !== "production" && fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log(`Loaded env from ${envPath}`);
  }

  const requiredVars = ["MONGODB_URI"];
  const missing = requiredVars.filter((v) => !process.env[v]);

  if (missing.length) {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }

  console.log("env variables are ready to go");
}
