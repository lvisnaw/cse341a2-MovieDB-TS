require('dotenv').config();
const express = require('express');
const connectDB = require('./db/connection');
const moviesRouter = require('./routes/movies');
const usersRouter = require('./routes/users');
const authRoutes = require('./routes/auth');
const { setupSwagger } = require('./swagger');
const errorHandler = require('./middleware/errorHandler');
const passport = require('./middleware/passport');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;

// ✅ Ensure JWT_SECRET is always set
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('❌ ERROR: JWT_SECRET is missing! Exiting...');
  process.exit(1);
}
console.log('🔍 JWT_SECRET being used in server:', JWT_SECRET); // ✅ Debugging log

// ✅ Session & Passport Middleware
app.use(session({
  secret: process.env.SESSION_SECRET || JWT_SECRET, // ✅ Default to JWT_SECRET for security
  resave: false,
  saveUninitialized: false, 
  cookie: { secure: process.env.NODE_ENV === 'production' } // ✅ Secure cookies in production
}));
app.use(passport.initialize());
app.use(passport.session());

// ✅ Body Parsing Middleware
app.use(express.json());

// ✅ API Routes
app.use('/auth', authRoutes);
app.use('/api/users', usersRouter);
app.use('/api/movies', moviesRouter);

// ✅ Swagger Docs
setupSwagger(app);

// ✅ Home Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to My Movies API! Visit /api-docs for Swagger documentation.' });
});

// ✅ Global Error Handler
app.use(errorHandler);

// ✅ Start Server Only After Database Connects
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}/api-docs`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
  });


// require('dotenv').config();
// const express = require('express');
// const connectDB = require('./db/connection');
// const moviesRouter = require('./routes/movies');
// const { setupSwagger } = require('./swagger');
// const usersRouter = require('./routes/users');
// const errorHandler = require('./middleware/errorHandler');
// const passport = require('./middleware/passport');
// const session = require('express-session');
// const authRoutes = require('./routes/auth');

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(session({
//   secret: process.env.SESSION_SECRET || 'your_secret',
//   resave: false,
//   saveUninitialized: false, // ✅ Change from "true" to "false"
//   cookie: { secure: false } // ✅ Set to true if using HTTPS in production
// }));

// app.use(passport.initialize());
// app.use(passport.session());
// app.use('/auth', authRoutes);

// app.use(express.json());
// setupSwagger(app);
// app.use('/api/users', usersRouter);
// app.use('/api/movies', moviesRouter);

// app.get('/', (req, res) => {
//   res.json({ message: 'Welcome to My Movies API! Visit /api-docs for Swagger documentation.' });
// });

// // Use error handler from middleware folder
// app.use(errorHandler);

// connectDB()
//   .then(() => {
//     app.listen(port, () => {
//       console.log(`🚀 Server running at http://localhost:${port}/api-docs`);
//     });
//   })
//   .catch((err) => {
//     console.error('❌ Failed to connect to MongoDB:', err);
//     process.exit(1);
//   });
