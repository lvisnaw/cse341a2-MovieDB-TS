import dotenv from 'dotenv';
dotenv.config();

import './middleware/passport'; // ✅ Required to register Google OAuth strategy

import express from 'express';
import session from 'express-session';
import passport from 'passport';

import { connectDB } from './db/connection';
import moviesRouter from './routes/movies';
import wishListRouter from './routes/wishlists';
import usersRouter from './routes/users';
import authRoutes from './routes/auth';
import mediaTypeRouter from './routes/mediaTypes';
import { setupSwagger } from './swagger';
import { errorHandler } from './middleware/errorHandler';
import cors from 'cors';


const app = express();
app.set('trust proxy', 1);
const port: number = parseInt(process.env.PORT || '3000', 10);

app.use(cors());

// ✅ Ensure JWT_SECRET is always set
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('❌ ERROR: JWT_SECRET is missing! Exiting...');
  process.exit(1);
}
console.log('🔍 JWT_SECRET being used in server:', JWT_SECRET); // ✅ Debugging log

// ✅ Session & Passport Middleware
app.use(session({
  secret: process.env.SESSION_SECRET || JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// ✅ Body Parsing Middleware
app.use(express.json());

// ✅ API Routes
app.use('/auth', authRoutes);
app.use('/api/users', usersRouter);
app.use('/api/movies', moviesRouter);
app.use('/api/wishlists', wishListRouter);
app.use('/api/media-types', mediaTypeRouter);

// ✅ Swagger Docs
setupSwagger(app);

// ✅ Home Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to My Movies API! Visit /api-docs for Swagger documentation.' });
});

// ✅ Global Error Handler
app.use(errorHandler);

// // ✅ Start Server Only After Database Connects
// connectDB(process.env.MONGODB_URI as string) // ✅ Now passing URI
//   .then(() => {
//     app.listen(port, () => {
//       console.log(`🚀 Server running at http://localhost:${port}/api-docs`);
//     });
//   })
//   .catch((err) => {
//     console.error('❌ Failed to connect to MongoDB:', err);
//     process.exit(1);
//   });
// // connectDB()

// Trying to get JEST to work

export { app }; // ✅ Ensure compatibility with TypeScript modules
