const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();
const passport = require('passport');
const CustomerModel = require('../models/customer.model');
const sequelize = require('sequelize');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        if (profile?.id && profile?.emails?.[0]?.value) {
          const email = profile.emails[0].value;
          const { v4: uuidv4 } = require('uuid');
          
          // Tìm customer dựa trên google_id hoặc email
          let customer = await CustomerModel.findOne({
            where: {
              [sequelize.Op.or]: [
                { google_id: profile.id },
                { email: email }
              ]
            }
          });
          
          if (!customer) {
            // Nếu không tìm thấy, tạo mới customer
            customer = await CustomerModel.create({
              id: uuidv4(),
              email: email,
              name: profile.displayName,
              google_id: profile.id,
              roleId: '1',
            });
            console.log('Created new customer with Google login');
          } else {
            // Nếu tìm thấy customer nhưng chưa có google_id, cập nhật google_id
            if (!customer.google_id) {
              await customer.update({ google_id: profile.id });
              console.log('Updated existing customer with Google ID');
            } else {
              console.log('Found existing customer with Google login');
            }
          }
          
          // Thêm ID vào profile để sử dụng trong callback
          profile.customerId = customer.id;
          
          return cb(null, profile, accessToken);
        } else {
          console.error('Missing profile information from Google');
          return cb(new Error('Missing profile information from Google'));
        }
      } catch (error) {
        console.error('Error in Google authentication:', error);
        return cb(error);
      }
    }
  )
);

// Cần thêm các hàm serialize và deserialize
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const customer = await CustomerModel.findByPk(id);
    done(null, customer);
  } catch (error) {
    done(error);
  }
});






