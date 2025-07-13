const express = require('express');
const router = express.Router();
const passport = require('passport');
const AuthController = require('../controllers/auth.controller');
const { sendWelcomeEmail } = require('../services/emailService.js');
require('../services/passport');

router.post('/login', AuthController.login);
router.post('/login-success', AuthController.loginSuccess);
router.post('/register', AuthController.register);
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: true, prompt: 'select_account' })
);

router.get(
  '/auth/google/callback',
  (req, res, next) => {
    passport.authenticate('google', async (err, profile, accessToken) => {
      if (err) {
        console.error('Google authentication error:', err);
        return res.redirect(`${process.env.HTTP}/login?error=auth_failed`);
      }
      
      req.user = profile;
      if (accessToken && profile?.emails?.[0]?.value) {
        req.accessToken = accessToken;
        try {
          await sendWelcomeEmail(profile.emails[0].value, profile.displayName);
        } catch (emailError) {
          console.error('Error sending email:', emailError);
          // Continue even if email fails
        }
      }
      next();
    })(req, res, next);
  },
  (req, res) => {
    // Redirect với customerId thay vì Google profile ID
    res.redirect(`${process.env.HTTP}/login?code=${req?.user?.customerId || req?.user?.id}`);
  }
);


module.exports = router;

