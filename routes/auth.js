const express = require('express');
const passport = require('passport');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The user ID
 *         displayName:
 *           type: string
 *           description: The user's display name
 *         emails:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               value:
 *                 type: string
 *                 description: The user's email
 *         photos:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               value:
 *                 type: string
 *                 description: The user's photo URL
 */

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Initiate Google OAuth login
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirects to Google OAuth consent screen
 */
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback URL
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirects to home page after successful login
 *       401:
 *         description: Authentication failed
 */
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/auth/login-failed',
    successRedirect: '/auth/login-success'
  })
);

/**
 * @swagger
 * /auth/login-success:
 *   get:
 *     summary: Login success page
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Returns login success message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 sessionId:
 *                   type: string
 *                   description: The session ID for debugging
 */
router.get('/login-success', (req, res) => {
  console.log('=== LOGIN SUCCESS ROUTE ===');
  console.log('Is authenticated:', req.isAuthenticated());
  console.log('User:', req.user);
  console.log('Session ID:', req.sessionID);
  console.log('Session:', req.session);
  
  if (!req.isAuthenticated()) {
    console.log('NOT AUTHENTICATED - returning error');
    return res.status(401).json({
      success: false,
      error: 'Not authenticated after OAuth flow'
    });
  }

  console.log('AUTHENTICATED - sending user data');
  res.json({
    success: true,
    message: 'Login successful!',
    user: {
      id: req.user.id,
      displayName: req.user.displayName,
      email: req.user.emails ? req.user.emails[0].value : 'No email',
      photo: req.user.photos ? req.user.photos[0].value : 'No photo'
    },
    sessionId: req.sessionID
  });
});

/**
 * @swagger
 * /auth/login-failed:
 *   get:
 *     summary: Login failed page
 *     tags: [Authentication]
 *     responses:
 *       401:
 *         description: Returns login failure message
 */
router.get('/login-failed', (req, res) => {
  console.log('=== LOGIN FAILED ROUTE ===');
  res.status(401).json({
    success: false,
    error: 'Google authentication failed'
  });
});

/**
 * @swagger
 * /auth/user:
 *   get:
 *     summary: Get current user information
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Returns current user data if authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: User not authenticated
 */
router.get('/user', (req, res) => {
  console.log('=== USER ROUTE ===');
  console.log('Is authenticated:', req.isAuthenticated());
  console.log('User:', req.user);
  console.log('Session ID:', req.sessionID);
  
  if (req.isAuthenticated()) {
    res.json({
      success: true,
      user: {
        id: req.user.id,
        displayName: req.user.displayName,
        email: req.user.emails ? req.user.emails[0].value : 'No email',
        photo: req.user.photos ? req.user.photos[0].value : 'No photo'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Not authenticated'
    });
  }
});

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.get('/logout', (req, res) => {
  console.log('=== LOGOUT ROUTE ===');
  console.log('User before logout:', req.user);
  
  req.logout((err) => {
    if (err) {
      console.log('Logout error:', err);
      return res.status(500).json({
        success: false,
        error: 'Logout failed'
      });
    }
    console.log('Logout successful');
    res.json({
      success: true,
      message: 'Logout successful'
    });
  });
});

/**
 * @swagger
 * /auth/debug:
 *   get:
 *     summary: Debug authentication session
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Returns debug information about the session
 */
router.get('/debug', (req, res) => {
  console.log('=== DEBUG ROUTE ===');
  console.log('Session ID:', req.sessionID);
  console.log('Session:', req.session);
  console.log('Authenticated:', req.isAuthenticated());
  console.log('User:', req.user);
  console.log('Headers:', req.headers);
  
  res.json({
    sessionId: req.sessionID,
    authenticated: req.isAuthenticated(),
    user: req.user,
    headers: req.headers
  });
});

module.exports = router;