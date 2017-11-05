const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/user');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const auth = require('./auth');
  

passport.use('local', new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }

            User.comparePassword(password, user.password, function(err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);

                } else {
                    return done(null, false, { message: 'Invalid password' });
                }
            });

        });
    }
));

//gooogle strategy

passport.use(new GoogleStrategy({
     clientID :    auth.google.clientID,
     clientSecret: auth.google.clientSecret,
     callbackURL : auth.google.callbackURL 
  },
  function(accessToken, refreshToken, profile, done) {
     User.findOne({ googleId : profile.id}).then((regUser) => {
         if(regUser) {
           done(null, regUser);
         } else {
           const user = new User({
              googleId : profile.id,
              username : profile.displayName
           });
           user.save((newUser) => {
              console.log(newUser);
           });
         }
     } )
  }
))


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});