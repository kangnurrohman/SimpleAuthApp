const express = require('express');
const app = express();

const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const session = require('express-session');
const localStrategy = require('passport-local').Strategy;

// Requiring user route
const userRoutes = require('./routes/users');
// Requiring user model
const User = require('./models/usermodel');

dotenv.config({
 path: './config.env'
});

mongoose.connect(process.env.DATABASE_LOCAL, {
 useNewUrlParser: true,
 useUnifiedTopology: true,
 useCreateIndex: true
});

// middleware for session
app.use(session({
 secret: 'Just a simple login/sign up application.',
 resave: true,
 saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy({
 usernameField: 'email'
}, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware flash messages
app.use(flash());

// setting middleware globally
app.use((req, res, next) => {
 res.locals.success_msg = req.flash(('success_msg'));
 res.locals.error_msg = req.flash(('error_msg'));
 next();
});

app.use(bodyParser.urlencoded({
 extended: true
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(userRoutes);

app.listen(process.env.PORT, () => {
 console.log('Connected!!!');
})