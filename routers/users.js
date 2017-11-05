const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportConf = require('../config/passport');

const User = require('../model/user');

function authenticateUser (req, res, next) {
   if(req.isAuthenticated()) {
	   return next();
   } else {
	   res.redirect('/login');
   }
}

router.get('/login', (req, res) => {
	res.render('../views/account/login',{ title : 'login page'});
});

router.get('/register', (req, res) => {
	res.render('../views/account/register',{ title : 'register page', errors : false});
});

router.get('/profile', authenticateUser, (req, res) => {
	res.render('../views/account/profile',{ title : 'profile page'});
});

router.post('/register', (req, res, next) => {
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('username', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('password', 'password is required').notEmpty();
	req.checkBody('confirm_password', 'Name is required').equals(req.body.password);

	const errors = req.validationErrors();

	if (errors) {
		req.flash('errors', 'Please check the form');
		res.render('../views/account/register', { title : 'Error registering', errors : errors});
	} else {
        const user = new User({
            name : req.body.name,
            username : req.body.username,
            email : req.body.email,
            password : req.body.password
        });

        user.save((err, data) => {
        	if (err) return next(err);
        	else console.log(data);
        	res.render('../views/account/register', { title : 'Error registering', errors : false});
        });
	}
});

router.post('/login',
  passport.authenticate('local', { successRedirect: '/profile',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// this takes user to the google consent page
router.get('/auth/google',
  passport.authenticate('google', { scope: 'profile' }));

// this redirect user back to the app
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/profile');
  });
module.exports = router;

