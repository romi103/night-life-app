var sanitizer = require('sanitizer');


var yelp_app_id = process.env.YELP_APP_ID;

var yelp_app_secret = process.env.YELP_APP_SECRET; 

// app/routes.js
module.exports = function (app, passport) {
    var async = require('async');
    var Places = require('../app/models/places');
    var Promise = require('mpromise'); //promises module to asynchronouse function

    var Yelp = require('yelp-api-v3');

    var yelp = new Yelp({
        app_id: yelp_app_id,
        app_secret: yelp_app_secret
    });

    app.get('/', function (req, res) {
        var userAuthenticated = req.isAuthenticated();
        res.render('index.ejs', {
            userLoggedIn: userAuthenticated,
            userDetails: req.user,
            loginMessage: req.flash('loginMessage')
        });

    });

    // =====================================
    // LOGIN ===============================
    // ===================================

    //    
    app.get('/signin', function (req, res) {
        var userAuthenticated = req.isAuthenticated();
        // render the page and pass in any flash data if it exists

        res.render('signin.ejs', {
            userLoggedIn: userAuthenticated,
            userDetails: req.user,
            signinMasaage: req.flash('signinMasaage')
        });
    });


    app.get('/email-signup', function (req, res) {
        var userAuthenticated = req.isAuthenticated();

        res.render('email-signup.ejs', {
            userLoggedIn: userAuthenticated,
            signupAlertMessage: req.flash('signupAlertMessage'),
            userDetails: req.user
        });
    });

    app.get('/email-signin', function (req, res) {
        var userAuthenticated = req.isAuthenticated();
        // render the page and pass in any flash data if it exists
        res.render('email-signin.ejs', {
            userLoggedIn: userAuthenticated,
            signupAlertMessage: req.flash('signupAlertMessage'),
            loginMessage: req.flash('loginMessage'),
            userDetails: req.user

        });
    });

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    //    app.get('/login', function (req, res) {
    //
    //        // render the page and pass in any flash data if it exists
    //        res.render('login.ejs', {
    //            message: req.flash('loginMessage')
    //        });
    //    });
    //
    //    // process the signup form
    app.post('/email-signup', passport.authenticate('local-signup', {
        successRedirect: '/email-signin', // redirect to the secure profile section
        failureRedirect: '/email-signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));


    app.post('/email-signin', passport.authenticate('local-login', {

        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/email-signin', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));


    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: 'email'
    }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/',
            failureRedirect: '/email-signin'
        }));




    app.get('/search', function (req, res) {
        var userAuthenticated = req.isAuthenticated();
        // render the page and pass in any flash data if it exists
        var query = sanitizer.escape(req.query.searchBox);
        var userAuthenticated = req.isAuthenticated();
        //waterfall function to control async processes
        async.waterfall([
            ///// first fn
    function (callback) {

                    yelp.search({
                        term: 'bar pub restaurant',
                        location: query,
                        limit: 10
                    }).then(function (data) {
                        callback(null, data);
                    });
    },

    function (data, callback) {

                    var content = JSON.parse(data);
                    var bisArrayRef = content.businesses;
                    var places = [];
                    var fetchingIsFinished;
                    var noUsers;

                    // getting user's id 
                    var userAuthenticated = req.isAuthenticated();
                    if (userAuthenticated) {
                        var userId = req.user_id;
                    }

                    async.each(bisArrayRef, function (ele, callbackEAch) {

                        var yelpId = ele.id;
                        var bar;

                        Places.find({
                            "placeId": yelpId
                        }).exec(function (err, atandant) {
                            if (err) {
                                console.error(err);
                            }

                            //number of user attending
                            if (atandant.length > 0) {

                                noUsers = atandant[0].users.length;
                            } else {
                                noUsers = 0;
                            }

                            bar = new BarRes(ele.name, ele.location.address1, ele.location.address2, ele.location.city, ele.location.zip_code, yelpId, ele.url, ele.image_url, ele.rating, noUsers);

                            places.push(bar);
                            console.log('pub processed');
                            callbackEAch();
                        });


                    }, function (err) {
                        // if any of the file processing produced an error, err would equal that error
                        if (err) {
                            // One of the iterations produced an error.
                            // All processing will now stop.
                            console.log('An error cccured');
                        } else {
                            fetchingIsFinished = true;
                            console.log('All pubs have been processed successfully');
                            if (fetchingIsFinished) {

                                callback(null, places);
                            }
                        }
                    });
    }],
            //finish callback 
            function (err, places) {
                res.render('index.ejs', {
                    userLoggedIn: userAuthenticated,
                    userDetails: req.user,
                    query: query,
                    places: places,
                    loginMessage: req.flash('loginMessage')
                });
            });
    });

    //place constructor to be send
    function BarRes(name, address1, address2, city, zip_code, id, url, image_url, rating, noUsers) {
        this.name = name,
            this.address1 = address1
        this.address2 = address2,
            this.city = city,
            this.zip_code = zip_code,
            this.atendants = noUsers,
            this.id = id,
            this.url = url,
            this.image_url = image_url,
            this.rating = rating

    }

    // going-to-button route 
    app.get('/go/:placeId', function (req, res) {

        var userAuthenticated = req.isAuthenticated();
        var placeId = req.params.placeId;

        async.waterfall([
    function (callback) {

                if (userAuthenticated) {
                    //check if already in database if not add to the data base and amend
                    var userId = req.user._id;

                    Places.findOne({
                        'placeId': placeId
                    }, function (err, place) {
                        // if there are any errors, return the error
                        if (err)
                            throw err;

                        var numberOfGoers;

                        // check if theres already pub in the datebase
                        if (place) {

                            console.log("place exists");
                            var arrayUsers = place.users;
                            var search = arrayUsers.find(function (user) {
                                return user == userId;
                            })

                            if (!search) {
                                numberOfGoers = arrayUsers.length + 1;
                                place.users.push(userId.toString());
                                place.save(function (err) {
                                    if (err)
                                        throw err;
                                    console.log("a new goer added")
                                });

                            } else {
                                var index = arrayUsers.indexOf(userId);
                                numberOfGoers = arrayUsers.length - 1;
                                place.users.splice(index, 1);
                                place.save(function (err) {
                                    if (err)
                                        throw err;
                                    console.log("user removed")
                                });
                                
                                
                                
                            }
                        } else {

                            // if there is no pub create one in datebase
                            // create the user
                            numberOfGoers = 1;
                            var tempArrayUser = [];
                            tempArrayUser.push(userId.toString());
                            var newPlace = new Places();

                            newPlace.placeId = placeId;
                            newPlace.users = tempArrayUser;;
                            // save the place
                            newPlace.save(function (err) {
                                if (err)
                                    throw err;
                                console.log("a new place added")
                            });
                        }
                        callback(null, numberOfGoers);
                    });

                } else {
                    //if not logged in sent no goers number, custom.js will will redirect to the sigin page
                    callback(null, null);
                }
    }
], function (err, numberOfGoers) {
            if (err)
                throw err;

            var data = JSON.stringify({
                isAuthenticated: userAuthenticated,
                numberAtten: numberOfGoers,

            });
            res.contentType('application/json');
            res.end(data);
            console.log("Number of goers sent: " + numberOfGoers);
        });
    });

    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated()) {
            return next();
            //                
        } else {
            req.flash('signinMasaage', "Please signup or signin if you want let know others where you are going.");
            res.redirect('/signin');
        }
    }

    app.get('/logout', function (req, res) {
        req.logout();
        req.flash('logout', 'You have been logged out!');
        res.redirect('/');

    });
};