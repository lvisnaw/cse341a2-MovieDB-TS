import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config(); // Load environment variables

const uri: string | undefined = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ ERROR: MONGODB_URI is not defined in .env');
  process.exit(1);
}

const testConnection = async (): Promise<void> => {
  try {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10000, // 10-second timeout
    });

    console.log('🔄 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected successfully to MongoDB!');

    await client.close();
    console.log('🔌 Connection closed.');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

// Run the connection test
testConnection();
