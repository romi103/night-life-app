
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var places = mongoose.Schema({
    

placeId : String,
users : []

});


// create the model for poll and expose it to our app
module.exports = mongoose.model('Places', places);