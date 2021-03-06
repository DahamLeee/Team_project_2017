const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

module.exports = function(passport){
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, done);
  });
  //local signin
  passport.use('local-signin', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  }, async(req, email, password, done) => {
    try {
      const user = await User.findOne({email: email});
      if(user && await user.validatePassword(password)){ //password가 같다면
        return done(null, user, req.flash('success', 'Successfully signin. Welcome!'));
      }
      return done(null, false, req.flash('danger', 'Invalid email or password')); //다르면
    } catch(err){
      done(err);
    }
  }));
};
