const express = require('express');
const router = express.Router();
const passport = require('passport');
const AuthController = require('../controllers/auth.controller');
require('../services/passport');

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/auth/google/callback',
  (req, res, next) => {
    passport.authenticate('google', (err, profile, accessToken) => {
      req.user = profile;
      if (accessToken) {
        req.accessToken = accessToken;
      }
      next();
    })(req, res, next);
  },
  (req, res) => {
    res.redirect(`${process.env.HTTP}/login?code=${req?.accessToken}`);
  }
);


module.exports = router;