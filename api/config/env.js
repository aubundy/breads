import fs from "fs";
import dotenv from "dotenv";

export function loadEnvVariables() {
  const environment = process.env.NODE_ENV || "dev";
  const envPath = `./api/config/.env.${environment}`;

  if (environment !== "production" && fs.existsSync(envPath)) {
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

export function getEnvVariable(variable) {
  const value = process.env[variable];

  if (!value) throw new Error(`Missing env variable: ${variable}`);

  return value;
}
