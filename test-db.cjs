const { Client } = require('pg');

async function testConnection() {
  const regions = [
    'aws-0-us-east-1',
    'aws-0-us-east-2',
    'aws-0-us-west-1',
    'aws-0-us-west-2',
    'aws-0-ae-central-1', // Actually it's ap-south-1 etc. let's just do the main ones
    'aws-0-ap-northeast-1',
    'aws-0-ap-northeast-2',
    'aws-0-ap-south-1',
    'aws-0-ap-southeast-1',
    'aws-0-ap-southeast-2',
    'aws-0-ca-central-1',
    'aws-0-eu-central-1',
    'aws-0-eu-west-1',
    'aws-0-eu-west-2',
    'aws-0-eu-west-3',
    'aws-0-sa-east-1',
  ];

  for (const region of regions) {
    const client = new Client({
      host: `${region}.pooler.supabase.com`,
      port: 6543,
      user: 'postgres.vqwesznblttmeodxetkr',
      password: '3A4uid6/SsSF#Ca',
      database: 'postgres',
      statement_timeout: 3000
    });
    try {
      await client.connect();
      console.log(`✅ Success: ${region}`);
      await client.end();
      return;
    } catch (err) {
      if (!err.message.includes("Tenant or user not found") && !err.message.includes("getaddrinfo")) {
         console.log(`❌ Failed ${region}: ${err.message}`);
      }
    }
  }
  console.log("Failed to connect to all regions.");
}

testConnection();
