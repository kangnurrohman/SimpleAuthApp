const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

let userSchema = new mongoose.Schema({
 name: String,
 email: String,
 password: {
  type: String,
  select: false
 }
});

userSchema.plugin(passportLocalMongoose, {
 usernameField: 'email'
});
module.exports = mongoose.model('User', userSchema);