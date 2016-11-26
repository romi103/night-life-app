// app/routes.js
module.exports = function (app, passport) {
    var async = require('async');
    var Places = require('../app/models/places');
    var Promise = require('mpromise'); //promises module to asynchronouse function

    var Yelp = require('yelp-api-v3');

    var yelp = new Yelp({
        app_id: 'XMfTt2ztl7TRQZccI1EjQg',
        app_secret: 'hHF77Tr3qr7FtUlH6Lxa93lGqGnHg62sBLIZX7VhHFcr9O37Jsbxa9AUr9dMGbPF'
    });



    app.get('/', function (req, res) {
        var userAuthenticated = req.isAuthenticated();
        console.log(req.user);
        res.render('index.ejs', {
            userLoggedIn: userAuthenticated,
            userDetails: req.user
        });

    });
    //    app.get('/', getPolls, getUserPolls, function (req, res) {
    //
    //        var userLoggedIn = req.isAuthenticated();
    //        console.log(res.userPolls);
    //        res.render('template.ejs', {
    //
    //            poll: res.polls,
    //            userLogged: userLoggedIn,
    //            userPolls: res.userPolls
    //        });
    //
    //    });
    //


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

    //
    //    app.get('/getpoll/:pollId', function (req, res) {
    //
    //        var polls = Polls.find({
    //            "_id": req.params.pollId
    //        }).exec(function (err, polls) {
    //            res.send(polls);
    //        });
    //
    //    });



    //    //getting polls' info (labels) to be voted for
    //    app.get('/vote/:pollId', function (req, res) {
    //
    //        var polls = Polls.find({
    //            "_id": req.params.pollId
    //        }).exec(function (err, polls) {
    //            res.send(polls);
    //        });
    //
    //    });

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

    //show the login form
    //        app.get('/email-signup', function (req, res) {
    //    
    //            // render the page and pass in any flash data if it exists
    //            res.render('email-signup.ejs', {
    //                message: req.flash('signupMessage')
    //            });
    //        });
    //
    //
    //    // process the sign in form
    //    app.post('/login', passport.authenticate('local-login', {
    //        successRedirect: '/', // redirect to the secure profile section
    //        failureRedirect: '/login', // redirect back to the signup page if there is an error
    //        failureFlash: true // allow flash messages
    //
    //    }));
    //    


    app.post('/test', function (req, res) {
        var bisId = req.body.bisId;
        var user = req.body.user;


        var newPlaces = new Places();
        newPlaces.placeId = bisId;
        newPlaces.users = user;


        newPlaces.save(function (err, newPlaces, numAffected) {
            if (err) {
                console.log(err);
            }
        });


    });

    app.post('/search', function (req, res) {

        var query = req.body.searchBox;
        console.log(req.user);
        //waterfall function to control async processes
        async.waterfall([
            /////// first fn
    function (callback) {


                    yelp.search({
                        term: 'bar pub restaurant',
                        location: query,
                        limit: 10
                    }).then(function (data) {
                        callback(null, data);
                    });




    },
            ////////////////////second fn
    function (data, callback) {
                    // arg1 now equals 'one' and arg2 now equals 'two'
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
                                //                                        var usersArray = atandant[0].users;

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

                var p = JSON.stringify(places);
                console.log(places);
                res.send(p);
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
    //gives number of goers (if logged user is in the data base, deduc 1) 
    function checkGoers() {
        placeId, placeData, userId
    } {

    }

    // going-to-button route 
    app.get('/go/:placeId', function (req, res) {

        var userAuthenticated = req.isAuthenticated();
        var placeId = req.params.placeId;





        //                    Places.find({
        //                                    "placeId": placeId
        //                                }).exec(function (err, place) {
        //                                    if (err) {
        //                                        console.error(err);
        //                                    }
        //                        
        //                                    console.log(place);
        //
        //                    });



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
                                numberOfGoers = arrayUsers.length;
                                console.log("user in databese")
                            }

                            //                arrayUsers.forEach(function(element) {
                            //    console.log(typeof element);
                        } else {

                            // if there is no pub create one in datebase
                            // create the user
                            numberOfGoers = 1;
                            var tempArrayUser = [];
                            tempArrayUser.push(userId.toString());
                            var newPlace = new Places();

                            // 
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



        //                    Places.findOne({ 'placeId' :  placeId }, function(err, place) {
        //            // if there are any errors, return the error
        //                if (err)
        //                        throw err;
        //
        //            // check to see if theres already pub in the datebase
        //            if (place) {
        //                
        //                console.log("place exists");
        //                console.log(place);
        //                
        //                var arrayUsers = place.users;
        //                
        //                
        //                
        //                var search = arrayUsers.find(function(user){
        //                    return user == userId;
        //                })
        //                
        //                if (!search) {
        //                    numberOfGoers = arrayUsers.length;
        //                } else {
        //                    numberOfGoers = arrayUsers.length - 1;
        //                }
        //              
        //            } else {
        //
        //                // if there is no pub create one in datebase
        //                // create the user
        //                
        //                var tempArrayUser = [];
        //                tempArrayUser.push(userId);
        //                var newPlace            = new Places();
        //
        //                // 
        //                newPlace.placeId    = placeId;
        //                newPlace.users = tempArrayUser;
        //;
        //                // save the place
        //                newPlace.save(function(err) {
        //                    if (err)
        //                        throw err;
        //                    console.log("a new place added")
        //                    
        //                });
        //            }
        //
        //        });    







        //decides if the user is to be rediracted in order to signed in. true of false to be sent

        //                var data = JSON.stringify({
        //                    isAuthenticated: userAuthenticated,
        //                    numberAtten: numberOfGoers
        //                });
        //                res.contentType('application/json');
        //                res.end(data);


        //        console.log(req.params.placeID);
        //        res.end();

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


        // if they aren't redirect them to the home page

    }



    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    //    app.get('/signup', function (req, res) {
    //
    //        // render the page and pass in any flash data if it exists
    //        res.render('signup.ejs', {
    //            message: req.flash('signupMessage')
    //        });
    //    });



    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    //    app.get('/profile', isLoggedIn, function (req, res) {
    //        res.render('profile.ejs', {
    //            user: req.user // get the user out of session and pass to template
    //        });
    //    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function (req, res) {
        req.logout();
        req.flash('logout', 'You have been logged out!');
        res.redirect('/');


    });
};