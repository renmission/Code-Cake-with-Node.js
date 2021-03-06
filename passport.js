const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/Users');
var FacebookStrategy = require('passport-facebook').Strategy;

var bcrypt = require('bcryptjs');

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findOne({ _id: id }, (err, user) => {
        done(err, user);
    });
});


//APP LOGIN
passport.use(new LocalStrategy({ usernameField: 'email' }, (username, password, done) => {

    User.findOne({ email: username }).then(user => {
        if (!user) return done(null, false, { message: 'No user found' });

        bcrypt.compare(password, user.password, (err, matched) => {

            if (err) return err;

            if (matched) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect password' });
            }

        });
    });
}));


//PASSPORT FACEBOOK
passport.use(new FacebookStrategy({
    clientID: '652615318580637',
    clientSecret: 'f1e2a4614a02abd4782fd7e18fb5a17f',
    callbackURL: 'https://code-cake.herokuapp.com/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'email']
},
    (token, refreshToken, profile, done) => {
        User.findOne({ facebookId: profile.id }, (err, user) => {
            if (err) return done(err);

            if (user) {
                return done(null, user);
            } else {
                User.findOne({ email: profile.emails[0].value }, (err, user) => {
                    if (user) {
                        user.facebookId = profile.id
                        return user.save(err => {
                            if (err) return done(null, false, { message: "Can't save user info" });
                            return done(null, user);
                        })
                    }

                    var user = new User();
                    user.name = profile.displayName;
                    user.email = profile.emails[0].value;
                    user.facebookId = profile.id;
                    user.save(err => {
                        if (err) return done(null, false, { message: "Can't save user info" });
                        return done(null, user);
                    })
                })
            }
        })
    }
));



module.exports = passport;