import mongoose, { Schema, model } from "mongoose";
import dotenv from "dotenv";

import { connectDB } from "./db.js";
import { migrations } from "./dbscripts/migrations.js";

dotenv.config({ path: `./api/config/.env.${process.env.NODE_ENV}` });

const MigrationSchema = new Schema({
  name: { type: String, required: true, unique: true },
  appliedAt: { type: Date, required: true },
});

const Migration = model("Migration", MigrationSchema);

async function runMigrations() {
  console.log("Connecting to db");
  await connectDB(process.env.MONGODB_URI);

  console.log("Getting applied migrations");
  const applied = await Migration.find().lean();
  const appliedNames = new Set(applied.map((m) => m.name));

  for (const migration of migrations) {
    if (appliedNames.has(migration.name)) {
      console.log(`Already executed ${migration.name}`);
      continue;
    }

    console.log(`Running migration: ${migration.name}`);

    await migration.up(mongoose.connection);

    await Migration.create({ name: migration.name, appliedAt: new Date() });

    console.log(`Completed: ${migration.name}`);
  }

  console.log("Applied all migrations");
  process.exit(0);
}

runMigrations();
