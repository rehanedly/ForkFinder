const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runSchema() {
  const client = new Client({
    host: 'db.vqwesznblttmeodxetkr.supabase.co',
    port: 6543, // Pooler port
    user: 'postgres.vqwesznblttmeodxetkr', // Format for pooler
    password: '3A4uid6/SsSF#Ca',
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    console.log("Connecting to Session Pooler...");
    await client.connect();
    console.log("Connected. Reading schema...");
    const schemaSql = fs.readFileSync(path.join(__dirname, 'supabase', 'schema.sql'), 'utf-8');
    
    console.log("Executing schema...");
    await client.query(schemaSql);
    console.log("✅ Schema executed successfully.");
  } catch (err) {
    console.error(`❌ Failed: ${err.message}`);
    
    if (err.message.includes('ENOTFOUND')) {
        console.log("Trying alternative pooler host...");
        // Try the common alternative pooler host
        const altClient = new Client({
            host: 'aws-0-ap-south-1.pooler.supabase.com',
            port: 6543,
            user: 'postgres.vqwesznblttmeodxetkr',
            password: '3A4uid6/SsSF#Ca',
            database: 'postgres',
            ssl: { rejectUnauthorized: false }
        });
        try {
            await altClient.connect();
            console.log("Connected via alt pooler. Executing schema...");
            const schemaSql = fs.readFileSync(path.join(__dirname, 'supabase', 'schema.sql'), 'utf-8');
            await altClient.query(schemaSql);
            console.log("✅ Schema executed successfully via alt pooler.");
            await altClient.end();
            return;
        } catch (altErr) {
            console.error(`❌ Alt pooler failed: ${altErr.message}`);
        }
    }
  } finally {
    await client.end();
  }
}

runSchema();
