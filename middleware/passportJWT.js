const config = require('../config/config');
const User = require('../models/user');
const passport = require('passport');

const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.JWT_SECRET;
//opts.issuer = 'accounts.examplesoft.com';
//opts.audience = 'yoursite.net';
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await User.findById(jwt_payload.id);
        if (!user) {
            return done(new Error('Use not found'), null);
        }

        return done(null, user);

    } catch (error) {
        done(error);
    }
}));

module.exports.isLoginUser = passport.authenticate('jwt', { session: false });