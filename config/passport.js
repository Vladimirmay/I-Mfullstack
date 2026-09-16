const passport = require("passport");
const { Strategy: BearerStrategy } = require("passport-http-bearer");
const { User } = require("../models");

passport.use(
  new BearerStrategy(async (token, done) => {
    try {
      const user = await User.findOne({ token });
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

module.exports = passport;
