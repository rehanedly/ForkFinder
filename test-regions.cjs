const { Client } = require('pg');

async function findPooler() {
  const projectRef = 'vqwesznblttmeodxetkr';
  const regions = [
    'ap-south-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'ap-northeast-2',
    'eu-central-1', 'eu-west-1', 'eu-west-2', 'eu-west-3',
    'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
    'sa-east-1', 'ca-central-1'
  ];

  for (const region of regions) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    const client = new Client({
      host,
      port: 6543,
      user: `postgres.${projectRef}`,
      password: '3A4uid6/SsSF#Ca',
      database: 'postgres',
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 2000
    });

    try {
      await client.connect();
      console.log(`✅ SUCCESS: ${region} (${host})`);
      await client.end();
      process.exit(0);
    } catch (err) {
      if (err.message.includes('ENOTFOUND')) {
          // Skip DNS errors
      } else if (err.message.includes('password authentication failed')) {
          console.log(`🔑 AUTH FAILED: ${region} (Password issue?)`);
      } else if (err.message.includes('Tenant or user not found')) {
          console.log(`📂 TENANT NOT FOUND: ${region} (Wrong region)`);
      } else {
          console.log(`❓ OTHER ERROR [${region}]: ${err.message}`);
      }
    }
  }
  console.log("Finished scan.");
}

findPooler();
