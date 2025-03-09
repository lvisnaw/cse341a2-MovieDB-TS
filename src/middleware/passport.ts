import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user';
import { HydratedDocument } from 'mongoose';

// ✅ Extract correct Mongoose Schema type
export type UserType = HydratedDocument<typeof User>;

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
        return done(err as Error, false); // ✅ Fix: Return `false` instead of `null`
      }
    }
  )
);

// ✅ Fix `serializeUser` and `deserializeUser`
passport.serializeUser((user: UserType, done) => {
  console.log('Serializing user:', user._id); // ✅ Ensure `_id` is used
  done(null, user._id.toString()); // ✅ Convert ObjectId to string
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    if (!user) throw new Error('User not found');
    console.log('Deserializing user:', user);
    done(null, user);
  } catch (err) {
    done(err as Error, false);
  }
});

export default passport;

// import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import { Request } from 'express';
// import User from '../models/user';

// interface UserType {
//   id: string;
//   googleId?: string;
//   username?: string;
//   accountType: 'read' | 'read-write' | 'admin';
// }

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//       callbackURL:
//         process.env.NODE_ENV === 'production'
//           ? 'https://cse341a2-movie-lesson7.onrender.com/auth/google/callback'
//           : 'http://localhost:3000/auth/google/callback',
//       scope: ['profile', 'email'],
//       passReqToCallback: true, // Allow access to request object (optional)
//     },
//     async (req: Request, accessToken: string, refreshToken: string, profile: any, done) => {
//       try {
//         console.log('🔹 OAuth Callback Reached');
//         console.log('🔹 Google Profile Data:', profile);
//         console.log('🔹 Access Token:', accessToken);

//         let user = await User.findOne({ googleId: profile.id });

//         if (!user) {
//           user = new User({
//             username: profile.displayName,
//             googleId: profile.id,
//             accountType: 'read',
//           });

//           await user.save();
//           console.log('✅ New User Created:', user);
//         } else {
//           console.log('✅ Existing User Found:', user);
//         }

//         return done(null, user);
//       } catch (err) {
//         console.error('❌ Error in OAuth Strategy:', err);
//         return done(err, null);
//       }
//     }
//   )
// );

// passport.serializeUser((user: UserType, done) => {
//   console.log('Serializing user:', user.id);
//   done(null, user.id);
// });

// passport.deserializeUser(async (id: string, done) => {
//   try {
//     const user = await User.findById(id);
//     console.log('Deserializing user:', user);
//     done(null, user);
//   } catch (err) {
//     done(err, null);
//   }
// });

// export default passport;
