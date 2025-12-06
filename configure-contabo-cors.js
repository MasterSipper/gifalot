// Node.js script to configure CORS for Contabo Object Storage
const { S3Client, PutBucketCorsCommand, GetBucketCorsCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

const config = {
  endpoint: 'https://eu2.contabostorage.com',
  region: 'eu-central-1',
  credentials: {
    accessKeyId: '4b2d2c88ee716e93979600d46b195a40',
    secretAccessKey: 'ad213eb1c1ef8d67835522dff7cf2a16',
  },
  forcePathStyle: true,
};

const s3Client = new S3Client(config);
const bucketName = 'gifalot-alot';

const corsConfiguration = {
  CORSRules: [
    {
      AllowedOrigins: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3000/*',
        'http://localhost:3001/*',
      ],
      AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD', 'OPTIONS'],
      AllowedHeaders: ['*'],
      ExposeHeaders: ['ETag', 'Content-Length'],
      MaxAgeSeconds: 3000,
    },
  ],
};

async function configureCORS() {
  try {
    console.log('Configuring CORS for Contabo Object Storage...');
    console.log('Bucket:', bucketName);
    console.log('Endpoint:', config.endpoint);
    
    const command = new PutBucketCorsCommand({
      Bucket: bucketName,
      CORSConfiguration: corsConfiguration,
    });

    await s3Client.send(command);
    console.log('✅ CORS configuration applied successfully!');

    // Verify the configuration
    console.log('\nVerifying CORS configuration...');
    const getCommand = new GetBucketCorsCommand({
      Bucket: bucketName,
    });
    
    const result = await s3Client.send(getCommand);
    console.log('Current CORS rules:');
    console.log(JSON.stringify(result.CORSRules, null, 2));
    
  } catch (error) {
    console.error('❌ Error configuring CORS:');
    console.error(error.message);
    if (error.$metadata) {
      console.error('Status:', error.$metadata.httpStatusCode);
      console.error('Request ID:', error.$metadata.requestId);
    }
    process.exit(1);
  }
}

configureCORS();



