// server.js

// set up ======================================================================
// get all the tools we need
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
 
//var Chart = require('src/chart.js')


var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');


//static contents
app.use(express.static(__dirname + '/public'));

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

var db = mongoose.connection; //testing mongo db conneton
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("we're connected to database");
});

//
require('./config/passport')(passport); // pass passport for configuration
//
// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms


app.set('views', './views');
app.set('view engine', 'ejs'); // set up ejs for templating
//
// required for passport
app.use(session({
    secret: 'ilovescotchscotchyscotchscotch'
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
//reqiuer undefine - problem - http://sstackoverflow.com/questions/33007878/nodejs-typeerror-require-is-not-a-function

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);