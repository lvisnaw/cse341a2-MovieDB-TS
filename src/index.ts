import app from './server';
import { connectDB } from './db/connection';

const port: number = parseInt(process.env.PORT || '3000', 10);

connectDB(process.env.MONGODB_URI as string)
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}/api-docs`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
  });
