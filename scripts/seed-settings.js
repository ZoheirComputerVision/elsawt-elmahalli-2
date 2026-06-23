const fs = require('fs');
const envRaw = fs.readFileSync('.env', 'utf8');
const match = envRaw.match(/DATABASE_URL="([^"]+)"/);
const url = match[1];
const { Pool } = require('pg');
const pool = new Pool({ connectionString: url });
const cuid = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
const now = new Date().toISOString();
pool.query(
  "INSERT INTO app_settings(id,key,value,updated_at) VALUES($1,$2,$3,$4),($5,$6,$7,$8) ON CONFLICT(key) DO NOTHING",
  [cuid(), 'stop_auto_publish', 'false', now, cuid(), 'require_human_review', 'false', now]
).then(r => { console.log('Seeded', r.rowCount, 'settings'); pool.end(); })
.catch(e => { console.error(e.message); pool.end(); });
