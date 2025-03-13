import { MongoClient, Db } from 'mongodb';

let dbInstance: Db | null = null;

export async function connectDB(uri: string) {
  if (!dbInstance) {
    const client = new MongoClient(uri);
    await client.connect();
    dbInstance = client.db();
    console.log('✅ Connected to MongoDB Atlas:', dbInstance.databaseName);
  }
  return dbInstance;
}

export function getDb() {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return dbInstance;
}
