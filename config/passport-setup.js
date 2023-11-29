
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user-model');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy(
        {
            // options for google strategy
            clientID: 'yourclientid',
            clientSecret: 'yourclientsecretkey',
            callbackURL: '/auth/google/redirect',
            scope: ['profile', 'email'] 
        },
        (accessToken, refreshToken, profile, done) => {
            // check if user already exists in our own db
            User.findOne({ googleId: profile.id }).then((currentUser) => {
                if (currentUser) {
                    // already have this user
                    console.log('user is: ', currentUser);
                    done(null, currentUser);
                } else {
                    // if not, create user in our db
                    // console.log(profile.emails[0].value )
                    new User({
                        googleId: profile.id,
                        username: profile.displayName,
                        thumbnail: profile._json.image ? profile._json.image.url : null,
                        email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null
                    })
                        .save()
                        .then((newUser) => {
                            console.log('created new user: ', newUser);
                            done(null, newUser);
                        });
                }
            });
        }
    )
);
