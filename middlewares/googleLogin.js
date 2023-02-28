const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');
const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');

const { User } = require('../models/userModel');
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, BASE_URL } = process.env;

const googleParams = {
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: `${BASE_URL}/api/users/google/callback`,
  passRecToCallback: true,
};

const googleCallback = async (accessToken, refreshToken, profile, done) => {
  try {
    const { emails } = profile;
    const email = emails[0].value;
    console.log(profile);
    const user = await User.findOne({ email });
    if (user) {
      return done(null, user); //req.user=user
    }
    const password = nanoid(10);
    const newUser = await User.create({ email, password });
    done(null, newUser);
  } catch (error) {
    done(error, false);
  }
};

const googleStrategy = new Strategy(googleParams, googleCallback);
passport.use('google', googleStrategy);

module.exports = passport;
