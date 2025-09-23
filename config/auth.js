const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Session configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your-session-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
};

// Function to initialize passport with Google strategy
const initializePassport = (googleClientId, googleClientSecret, googleCallbackUrl) => {
  // Validate that required parameters are provided
  if (!googleClientId || !googleClientSecret) {
    throw new Error('Google OAuth Client ID and Client Secret are required');
  }

  const strategy = new GoogleStrategy({
    clientID: googleClientId,
    clientSecret: googleClientSecret,
    callbackURL: googleCallbackUrl
  }, (accessToken, refreshToken, profile, done) => {
    // Simple profile handling for this project
    return done(null, profile);
  });

  passport.use(strategy);

  // Serialize user to session
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // Deserialize user from session
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};

module.exports = {
  sessionConfig,
  initializePassport
};