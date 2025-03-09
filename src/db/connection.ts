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


// import dotenv from 'dotenv';
// import mongoose from 'mongoose';

// dotenv.config(); // Load environment variables

// const connectDB = async (): Promise<void> => {
//   try {
//     const mongoURI = process.env.MONGODB_URI;

//     if (!mongoURI) {
//       throw new Error('❌ MONGODB_URI is not defined in .env');
//     }

//     await mongoose.connect(mongoURI, {
//       // ✅ Remove deprecated options, as Mongoose 6+ no longer needs them
//     });

//     console.log('✅ Connected to MongoDB Atlas:', mongoose.connection.name);
//   } catch (err) {
//     console.error('❌ MongoDB Connection Error:', err);
//     process.exit(1); // Exit on failure
//   }
// };

// export default connectDB; // ✅ Use ES Module export
