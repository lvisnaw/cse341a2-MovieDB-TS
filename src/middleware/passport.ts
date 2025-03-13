import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User, { IUser } from '../models/user'; // Ensure IUser is imported
import { HydratedDocument } from 'mongoose';

// ✅ Define a properly typed user instance
export type UserInstance = HydratedDocument<IUser> & { _id: string };

// ✅ Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL:
        process.env.NODE_ENV === 'production'
          ? 'https://cse341a2-movie-lesson7.onrender.com/auth/google/callback'
          : 'http://localhost:3000/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('🔹 Google Profile Data:', profile);

        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = new User({
            username: profile.displayName,
            googleId: profile.id,
            accountType: 'read',
          });

          await user.save();
          console.log('✅ New User Created:', user);
        }

        return done(null, user);
      } catch (err) {
        console.error('❌ Error in OAuth Strategy:', err);
        return done(err as Error, false);
      }
    }
  )
);

passport.serializeUser((user: Express.User, done) => {
  const mongooseUser = user as UserInstance; // ✅ Ensure user is a Mongoose document
  console.log('Serializing user:', mongooseUser._id.toString());
  done(null, mongooseUser._id.toString());
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      console.error('❌ User not found during deserialization');
      return done(null, false);
    }
    console.log('Deserializing user:', user);
    done(null, user);
  } catch (err) {
    done(err as Error, false);
  }
});

export default passport;
