/**
 * PostgreSQL Backup Script
 * Usage: npx tsx scripts/backup-db.ts
 *
 * Creates a timestamped dump in backups/
 */

import { execSync } from "child_process";
import { mkdirSync, existsSync } from "fs";
import { join } from "path";

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) {
  console.error("❌ DATABASE_URL not set");
  process.exit(1);
}

const url = new URL(DB_URL);
const dbName = url.pathname.replace(/^\//, "");
const host = url.hostname;
const port = url.port;
const user = url.username;
const pass = url.password;

const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const backupDir = join(process.cwd(), "backups");
if (!existsSync(backupDir)) mkdirSync(backupDir, { recursive: true });

const filename = `pg_dump_${dbName}_${timestamp}.sql`;
const filepath = join(backupDir, filename);

console.log(`📀 Backing up database "${dbName}"...`);
console.log(`   Host: ${host}:${port}`);
console.log(`   Output: ${filepath}`);

try {
  const cmd = `pg_dump --host=${host} --port=${port} --username=${user} --dbname=${dbName} --format=plain --no-owner --no-acl ${pass ? `--password=${pass}` : ""}`;
  execSync(cmd, {
    env: { ...process.env, PGPASSWORD: pass },
    stdio: ["ignore", "pipe", "pipe"],
    timeout: 120_000,
  });
  console.log(`✅ Backup created: ${filename}`);
} catch (error) {
  console.error("❌ Backup failed:", (error as Error).message);
  process.exit(1);
}

// Rotate: keep last 30 daily backups
const { readdirSync, unlinkSync } = await import("fs");
const backups = readdirSync(backupDir)
  .filter((f) => f.startsWith("pg_dump_") && f.endsWith(".sql"))
  .sort()
  .reverse();

if (backups.length > 30) {
  for (const old of backups.slice(30)) {
    unlinkSync(join(backupDir, old));
    console.log(`   🗑️ Removed old backup: ${old}`);
  }
}

console.log("✅ Backup complete.");
