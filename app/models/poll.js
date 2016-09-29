
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var poll = mongoose.Schema({
    
pollName : String,
labels : [],
dataset : [],
userId: String,
unix: String

});


// create the model for poll and expose it to our app
module.exports = mongoose.model('Poll', poll);