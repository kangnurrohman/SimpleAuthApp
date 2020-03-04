const express = require('express');
const router = express.Router();
const passport = require('passport');

// Requiring user model
const User = require('../models/usermodel');

// Checks if user is authenticated
function isAuthenticatedUser(req, res, next) {
 if (req.isAuthenticated()) {
  return next();
 }
 req.flash('error', 'Please login first to access this page.');
 res.redirect('/login');
}

// GET routes
router.get('/login', (req, res) => {
 res.render('login');
});

router.get('/signup', (req, res) => {
 res.render('signup');
});

router.get('/', isAuthenticatedUser, (req, res) => {
 res.render('dashboard');
});

router.get('/logout', (req, res) => {
 req.logOut();
 req.flash('success_msg', 'You have been logged out');
 res.redirect('/login');
});

// POST routes
router.post('/login', passport.authenticate('local', {
 successRedirect: '/',
 failureRedirect: '/login',
 failureFlash: 'Invalid email or password. Try again!!!'
}));

router.post('/signup', (req, res) => {
 let {
  name,
  email,
  password
 } = req.body;

 let userData = {
  name,
  email
 };

 User.register(userData, password, (err, user) => {
  if (err) {
   req.flash('error_msg', 'ERROR' + err);
   res.redirect('/signup');
  }
  passport.authenticate('local')(req, res, () => {});
  req.flash('success_msg', 'Account created successfully');
  res.redirect('/login');
 });
});
module.exports = router;