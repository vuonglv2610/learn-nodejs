const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();
const passport = require('passport');
const UserModel = require('../models/user.model');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, cb) => {
      console.log(profile,{
        id: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        google_id: accessToken,
        roleId: '1',
      },)
      if (profile?.id) {
            UserModel.findOrCreate({
              where: { id: profile.id },
              defaults: {
                id: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName,
                google_id: accessToken,
                roleId: '1',
              },
            });
      }
      return cb(null, profile, accessToken);
    }
  )
);

