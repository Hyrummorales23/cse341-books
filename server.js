const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const passport = require('passport');
const session = require('express-session');

// Load env vars FIRST
dotenv.config();

// Connect to database
connectDB();

// Import auth configuration
const { sessionConfig, initializePassport } = require('./config/auth');

// Initialize passport with Google OAuth credentials
initializePassport(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL
);

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session middleware
app.use(session(sessionConfig)); // Fixed: session() function was missing

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// debugging middleware (temporary - remove for production)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Define Routes
app.use('/auth', require('./routes/auth'));
app.use('/authors', require('./routes/authors'));
app.use('/books', require('./routes/books'));

// Keep the main router for the root path only
app.use('/', require('./routes'));

// Swagger Documentation
require('./swagger/swagger')(app);

// Central Error Handler - MUST be last middleware!
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log('OAuth configured successfully');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;