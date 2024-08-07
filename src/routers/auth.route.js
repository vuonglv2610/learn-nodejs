const express = require('express');
const router = express.Router();
const passport = require('passport');
const AuthController = require('../controllers/auth.controller');
const { sendEmailService } = require('../services/emailService.js');
require('../services/passport');

router.post('/login', AuthController.login);
router.post('/login-success', AuthController.loginSuccess);
router.post('/register', AuthController.register);

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] ,session: true, prompt: 'select_account'})
);

router.get(
  '/auth/google/callback',
  (req, res, next) => {
    passport.authenticate('google', async (err, profile, accessToken) => {
      req.user = profile;
      if (accessToken) {
        req.accessToken = accessToken;
        await sendEmailService(profile.emails[0].value);
      }
      next();
    })(req, res, next);
  },
  (req, res) => {
    res.redirect(`${process.env.HTTP}/login?code=${req?.user.id}`);
  }
);


module.exports = router;