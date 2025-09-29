const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');

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

// Trust Render's proxy - CRITICAL for sessions
app.set('trust proxy', 1);

// CORS configuration
app.use(cors({
  origin: ['https://cse341-books-p8xd.onrender.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session middleware
app.use(session(sessionConfig));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Enhanced logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Session ID:', req.sessionID);
  console.log('Authenticated:', req.isAuthenticated());
  console.log('User:', req.user ? req.user.displayName : 'No user');
  console.log('Headers:', {
    cookie: req.headers.cookie,
    'user-agent': req.headers['user-agent']
  });
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