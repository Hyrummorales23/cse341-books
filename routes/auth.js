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
 *       200:
 *         description: OAuth callback handled successfully
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
 *                 nextStep:
 *                   type: string
 *       401:
 *         description: Authentication failed
 */
router.get('/google/callback',
  (req, res, next) => {
    console.log('=== GOOGLE CALLBACK INITIATED ===');
    console.log('Query params:', req.query);
    
    passport.authenticate('google', (err, user, info) => {
      console.log('=== PASSPORT AUTHENTICATE CALLBACK ===');
      console.log('Error:', err);
      console.log('User:', user);
      console.log('Info:', info);
      
      if (err) {
        console.log('Authentication error:', err);
        return res.status(500).json({
          success: false,
          error: 'Authentication failed',
          details: err.message
        });
      }
      
      if (!user) {
        console.log('No user returned from authentication');
        return res.status(401).json({
          success: false,
          error: 'Google authentication failed - no user data returned'
        });
      }
      
      // Manually log in the user
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.log('Login error:', loginErr);
          return res.status(500).json({
            success: false,
            error: 'Login failed',
            details: loginErr.message
          });
        }
        
        console.log('=== MANUAL LOGIN SUCCESSFUL ===');
        console.log('Is authenticated after manual login:', req.isAuthenticated());
        console.log('User after manual login:', req.user);
        console.log('Session ID:', req.sessionID);
        
        // Save the session explicitly
        req.session.save((saveErr) => {
          if (saveErr) {
            console.log('Session save error:', saveErr);
            return res.status(500).json({
              success: false,
              error: 'Session save failed',
              details: saveErr.message
            });
          }
          
          console.log('=== SESSION SAVED SUCCESSFULLY ===');
          console.log('Session after save:', req.session);
          
          // Send success response directly (no redirect)
          res.json({
            success: true,
            message: 'Google OAuth authentication successful!',
            user: {
              id: user.id,
              displayName: user.displayName,
              email: user.emails ? user.emails[0].value : 'No email',
              photo: user.photos ? user.photos[0].value : 'No photo'
            },
            sessionId: req.sessionID,
            nextStep: 'You can now make authenticated API requests to protected endpoints'
          });
        });
      });
    })(req, res, next);
  }
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
 *       401:
 *         description: User not authenticated
 */
router.get('/login-success', (req, res) => {
  console.log('=== LOGIN SUCCESS ROUTE ===');
  console.log('Is authenticated:', req.isAuthenticated());
  console.log('User:', req.user);
  console.log('Session ID:', req.sessionID);
  console.log('Passport in session:', req.session.passport);
  
  if (!req.isAuthenticated()) {
    console.log('NOT AUTHENTICATED');
    return res.status(401).json({
      success: false,
      error: 'Not authenticated. Please complete the OAuth flow first.',
      sessionId: req.sessionID
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
      },
      sessionId: req.sessionID
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Not authenticated. Please log in first.',
      sessionId: req.sessionID
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
    
    // Destroy the session completely
    req.session.destroy((destroyErr) => {
      if (destroyErr) {
        console.log('Session destroy error:', destroyErr);
      }
      console.log('Logout and session destroy successful');
      res.json({
        success: true,
        message: 'Logout successful'
      });
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
  
  res.json({
    sessionId: req.sessionID,
    authenticated: req.isAuthenticated(),
    user: req.user,
    session: {
      passport: req.session.passport,
      cookie: req.session.cookie
    }
  });
});

/**
 * @swagger
 * /auth/test:
 *   get:
 *     summary: Test OAuth flow with simple HTML page
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Returns a simple HTML page for testing
 */
router.get('/test', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>OAuth Test Page</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
            button { padding: 10px 20px; margin: 10px; font-size: 16px; }
            pre { background: #f4f4f4; padding: 10px; border-radius: 5px; }
            .success { color: green; }
            .error { color: red; }
        </style>
    </head>
    <body>
        <h1>OAuth Authentication Test</h1>
        
        <h2>Step 1: Start OAuth Flow</h2>
        <button onclick="startOAuth()">Login with Google</button>
        
        <h2>Step 2: Test Authentication</h2>
        <button onclick="checkAuth()">Check Auth Status</button>
        <button onclick="testProtectedRoute()">Test Protected Route (Create Author)</button>
        <button onclick="logout()">Logout</button>
        
        <h2>Results:</h2>
        <div id="status">Status: Not authenticated</div>
        <div id="result"></div>
        
        <script>
            const baseUrl = '${req.protocol}://${req.get('host')}';
            
            async function startOAuth() {
                // Open Google OAuth in a new window
                const authWindow = window.open(baseUrl + '/auth/google', 'oauth', 'width=600,height=600');
                
                // Check every second if the window closed (user completed auth)
                const checkWindow = setInterval(() => {
                    if (authWindow.closed) {
                        clearInterval(checkWindow);
                        document.getElementById('status').innerHTML = 'Status: OAuth flow completed. Check authentication status.';
                        checkAuth();
                    }
                }, 1000);
            }
            
            async function checkAuth() {
                try {
                    const response = await fetch(baseUrl + '/auth/user', {
                        credentials: 'include'
                    });
                    const data = await response.json();
                    
                    if (data.success) {
                        document.getElementById('status').innerHTML = 
                            '<span class="success">Status: Authenticated as ' + data.user.displayName + '</span>';
                    } else {
                        document.getElementById('status').innerHTML = 
                            '<span class="error">Status: Not authenticated</span>';
                    }
                    
                    document.getElementById('result').innerHTML = 
                        '<h3>Auth Response:</h3><pre>' + JSON.stringify(data, null, 2) + '</pre>';
                } catch (error) {
                    document.getElementById('result').innerHTML = 'Error: ' + error;
                }
            }
            
            async function testProtectedRoute() {
                try {
                    const response = await fetch(baseUrl + '/authors', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            firstName: 'Test',
                            lastName: 'User ' + Date.now(),
                            nationality: 'Test'
                        }),
                        credentials: 'include'
                    });
                    const data = await response.json();
                    document.getElementById('result').innerHTML += 
                        '<h3>Protected Route Response:</h3><pre>' + JSON.stringify(data, null, 2) + '</pre>';
                } catch (error) {
                    document.getElementById('result').innerHTML += 'Error testing protected route: ' + error;
                }
            }
            
            async function logout() {
                try {
                    const response = await fetch(baseUrl + '/auth/logout', {
                        credentials: 'include'
                    });
                    const data = await response.json();
                    document.getElementById('status').innerHTML = 'Status: Logged out';
                    document.getElementById('result').innerHTML = 
                        '<h3>Logout Response:</h3><pre>' + JSON.stringify(data, null, 2) + '</pre>';
                } catch (error) {
                    document.getElementById('result').innerHTML = 'Error logging out: ' + error;
                }
            }
            
            // Check auth status on page load
            checkAuth();
        </script>
    </body>
    </html>
  `);
});

module.exports = router;