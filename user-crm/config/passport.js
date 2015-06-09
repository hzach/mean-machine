var localStrategy = require('passport-local').Strategy;
var githubStrategt = require('passport-github').Strategy;
var googleStrategy = require('passport-google-oauth').OAuth2Strategy;

var User = require('../app/model/user');

var configAuth = require('./auth');

// expose this function to our app using module.exports
module.exports = function(passport) {

  passport.use('local-signup', new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, name, username, password, done) {
    
    // asynchronous
    process.nextTick(function() {

      if (!req.user) {

        User.findOne( { 'username' : username }, function(err, existingUser) {

            if (err)
              return done(err);

            if (existingUser)
              return done(null, false, { message: 'That username is already taken.'});

            else {

              // if there is not a user with that email
              // create the user
              var newUser = new User();

              newUser.username = username;
              newUser.name = name;
              newUser.password = password;

              newUser.save(function(err) {
                if (err)
                  throw err;
                //TODO: Return a JWT somehow
                return done(null, newUser);
              });
            }

      });

    });
  });

}
