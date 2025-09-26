const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Session configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // true in production
    httpOnly: true, // Prevents client-side JS from reading the cookie
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Important for cross-origin
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  },
  name: 'libraryapi.sid' // Give the cookie a specific name
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
    // Return the entire profile
    return done(null, {
      id: profile.id,
      displayName: profile.displayName,
      emails: profile.emails,
      photos: profile.photos
    });
  });

  passport.use(strategy);

  // Serialize user to session
  passport.serializeUser((user, done) => {
    console.log('Serializing user:', user.displayName);
    done(null, user);
  });

  // Deserialize user from session
  passport.deserializeUser((user, done) => {
    console.log('Deserializing user:', user.displayName);
    done(null, user);
  });
};

module.exports = {
  sessionConfig,
  initializePassport
};