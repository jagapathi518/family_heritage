const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function run() {
  const connectionStrings = [
    // Direct connection
    'postgresql://postgres:Jagapathi%40518@db.zykmfbkqubietfzlrlvu.supabase.co:5432/postgres',
    // Session pooler (IPv4 compatible)
    'postgresql://postgres.zykmfbkqubietfzlrlvu:Jagapathi%40518@aws-0-ap-south-1.pooler.supabase.com:5432/postgres',
    'postgresql://postgres.zykmfbkqubietfzlrlvu:Jagapathi%40518@aws-0-us-east-1.pooler.supabase.com:5432/postgres',
  ];

  let client = null;
  let connected = false;

  for (const connStr of connectionStrings) {
    try {
      console.log('Attempting connection to:', connStr.split('@')[1]);
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
      console.log('Connection failed:', err.message);
      if (client) {
        try { await client.end(); } catch (e) {}
      }
    }
  }

  if (!connected || !client) {
    console.error('Could not connect to Supabase PostgreSQL directly. Will provide SQL copy instruction.');
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
