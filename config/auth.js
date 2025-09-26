const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Session configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: true, // Changed to true for better session handling
  saveUninitialized: true, // Changed to true to save session immediately
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  },
  name: 'libraryapi.sid'
};

// Function to initialize passport with Google strategy
const initializePassport = (googleClientId, googleClientSecret, googleCallbackUrl) => {
  if (!googleClientId || !googleClientSecret) {
    throw new Error('Google OAuth Client ID and Client Secret are required');
  }

  const strategy = new GoogleStrategy({
    clientID: googleClientId,
    clientSecret: googleClientSecret,
    callbackURL: googleCallbackUrl,
    passReqToCallback: true // Important: pass the request to callback
  }, (req, accessToken, refreshToken, profile, done) => {
    // Enhanced profile handling
    console.log('Google OAuth callback received profile:', profile.displayName);
    
    // Return the entire profile
    return done(null, {
      id: profile.id,
      displayName: profile.displayName,
      emails: profile.emails,
      photos: profile.photos,
      provider: profile.provider
    });
  });

  passport.use(strategy);

  // Serialize user to session
  passport.serializeUser((user, done) => {
    console.log('Serializing user to session:', user.displayName);
    done(null, user);
  });

  // Deserialize user from session
  passport.deserializeUser((user, done) => {
    console.log('Deserializing user from session:', user ? user.displayName : 'No user');
    done(null, user);
  });
};

module.exports = {
  sessionConfig,
  initializePassport
};