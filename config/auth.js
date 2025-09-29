const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Session configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: true, // Changed to true
  saveUninitialized: true, // Changed to true
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' // Important for cross-origin
  },
  name: 'library.sid' // Specific cookie name
};

// Function to initialize passport with Google strategy
const initializePassport = (googleClientId, googleClientSecret, googleCallbackUrl) => {
  if (!googleClientId || !googleClientSecret) {
    throw new Error('Google OAuth Client ID and Client Secret are required');
  }

  const strategy = new GoogleStrategy({
    clientID: googleClientId,
    clientSecret: googleClientSecret,
    callbackURL: googleCallbackUrl
  }, (accessToken, refreshToken, profile, done) => {
    console.log('Google OAuth profile received:', profile.displayName);
    return done(null, profile);
  });

  passport.use(strategy);

  // Serialize user to session
  passport.serializeUser((user, done) => {
    console.log('Serializing user:', user.displayName);
    done(null, user);
  });

  // Deserialize user from session
  passport.deserializeUser((user, done) => {
    console.log('Deserializing user:', user ? user.displayName : 'No user');
    done(null, user);
  });
};

module.exports = {
  sessionConfig,
  initializePassport
};