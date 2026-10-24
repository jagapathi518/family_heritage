const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local if present
try {
  if (process.loadEnvFile) {
    process.loadEnvFile(path.resolve(__dirname, '../../.env.local'));
  }
} catch (e) {}

async function run() {
  const dbPassword = process.env.SUPABASE_DB_PASSWORD || process.env.DATABASE_PASSWORD || '';
  const encodedPassword = encodeURIComponent(dbPassword);

  const connectionStrings = process.env.DATABASE_URL
    ? [process.env.DATABASE_URL]
    : [
        `postgresql://postgres:${encodedPassword}@db.zykmfbkqubietfzlrlvu.supabase.co:5432/postgres`,
        `postgresql://postgres.zykmfbkqubietfzlrlvu:${encodedPassword}@aws-0-ap-south-1.pooler.supabase.com:5432/postgres`,
      ];

  let client = null;
  let connected = false;

  for (const connStr of connectionStrings) {
    try {
      client = new Client({
        connectionString: connStr,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000,
      });
      await client.connect();
      console.log('Successfully connected to Supabase PostgreSQL!');
      connected = true;
      break;
    } catch (err) {
      if (client) {
        try { await client.end(); } catch (e) {}
      }
    }
  }

  if (!connected || !client) {
    console.log('Could not connect directly via node-postgres. Migrations can also be run in Supabase SQL editor.');
    return;
  }

  const migrationFiles = [
    'supabase/migrations/001_initial_schema.sql',
    'supabase/migrations/002_rls_and_functions.sql',
    'supabase/migrations/003_seed_demo.sql',
  ];

  for (const file of migrationFiles) {
    const fullPath = path.resolve(__dirname, '../../', file);
    if (fs.existsSync(fullPath)) {
      console.log(`Executing migration ${file}...`);
      const sql = fs.readFileSync(fullPath, 'utf8');
      try {
        await client.query(sql);
        console.log(`Successfully executed ${file}!`);
      } catch (sqlErr) {
        console.error(`Error in ${file}:`, sqlErr.message);
      }
    }
  }

  await client.end();
  console.log('All migrations completed!');
}

run().catch(console.error);
