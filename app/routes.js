// app/routes.js
module.exports = function (app, passport) {


    ///////////// /////////////////////////////////TEST/////////////////////////////////////////
   
    var Polls = require('../app/models/poll'); //poll model
    var Promise = require('mpromise'); //promises module to asynchronouse function
    //if user is logged in req object is passed to from checkIfIsLogged to anonymouse function -> render user's polls otherwise checkIfISLoggedIn renders homepage site
    app.get('/', getPolls, getUserPolls, function (req, res) {

        var userLoggedIn = req.isAuthenticated();
        console.log(res.userPolls);
        res.render('template.ejs', {

            poll: res.polls,
            userLogged: userLoggedIn,
            userPolls: res.userPolls
        });

    });

    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/');
    }

    function getPolls(req, res, next) {

        Polls.find().sort({
            unix: -1
        }).exec(function (err, polls) {
            res.polls = polls;

            next();
        });

    }

    function getUserPolls(req, res, next) {
        //download the user's polls 
        var promise = new Promise;
        promise.then(function (err, a) {
            console.log("resolved");
            next();
        });

        if (req.isAuthenticated()) {
            Polls.find({
                userId: req.user._id
            }).sort({
            unix: -1
        }).exec(function (err, userPolls) {

                if (userPolls) {
                    res.userPolls = userPolls;

                    promise.resolve();

                } else {
                    res.userPolls = userPolls;

                    promise.resolve();
                }

            });
        } else {
            promise.resolve();
        }

    }

    //////////////////////////////////////////////////
    app.post('/newpoll', function (req, res, next) {
        if (req.isAuthenticated()) {
            console.log("logged");
            //console.log(req.user);
            return next();
        }
        console.log("not loged in");
        //console.log(req.user);
        res.redirect('/');
    }, function (req, res) {


        var newPoll = new Polls();

        
        newPoll.pollName = req.body.pollName;
        newPoll.labels = req.body.labels;
        var arrayLabel = req.body.labels;

        var newDataSet = [];

        arrayLabel.forEach(function () {
            newDataSet.push(0);
        });


        newPoll.dataset = newDataSet;

        newPoll.userId = req.user._id;
        newPoll.unix = Date.now();
        

        // save the user
        newPoll.save();

        res.send(newPoll);

    });

    // =====================================
    // GETTING LIST OF POLLS ===============
    // =====================================
    // main.js performs ajax call to /getpolls once the documnet is loaded.
    app.get('/getpolls', function (req, res) {

        var polls = Polls.find().exec(function (err, polls) {
            res.send(polls);
        });
        // var polls =  db.polls.find();



        //        res.render('login.ejs', {
        //            message: req.flash('loginMessage')
        //        });
    });


    app.get('/getpoll/:pollId', function (req, res) {

        var polls = Polls.find({
            "_id": req.params.pollId
        }).exec(function (err, polls) {
            res.send(polls);
        });
        // var polls =  db.polls.find();



        //        res.render('login.ejs', {
        //            message: req.flash('loginMessage')
        //        });
    });



    //getting polls' info (labels) to be voted for
    app.get('/vote/:pollId', function (req, res) {

        var polls = Polls.find({
            "_id": req.params.pollId
        }).exec(function (err, polls) {
            res.send(polls);
        });
        // var polls =  db.polls.find();



        //        res.render('login.ejs', {
        //            message: req.flash('loginMessage')
        //        });
    });

    //saving votes in to the database
    app.post('/votePoll', function (req, res) {

        var votedPollId = req.body.votedPollId;
        var votaData = req.body.votaData;
        var votedIndex;
        
        var votedPoll = Polls.find({
            "_id": votedPollId
        }).exec(function (err, poll) {
          
            votedIndex = poll[0].labels.indexOf(votaData);
            //var changeDataseet = poll[0].dataset[votedIndex];
            var arrrayDataset = poll[0].dataset;
            var updatedIndex = arrrayDataset[votedIndex];
            updatedIndex++
            var newDatasetArray = arrrayDataset;
            newDatasetArray[votedIndex] = updatedIndex;

            Polls.findOneAndUpdate({
                "_id": votedPollId
            }, {
                $set: {
                    dataset: newDatasetArray
                }
            }, {
                new: true
            }, function (err, doc) {
                if (err) {
                    console.log("Something wrong when updating data!");
                }
                res.end();

            });
        });

    });
    
    
    //deleting poll from the database
    app.post('/deletePoll', function (req, res) {

        //FBFriendModel.find({ id:333 }).remove().exec();
        
        
//        var votedPollId = req.body.votedPollId;
//        var votaData = req.body.votaData;
//        var votedIndex;
      
        Polls.find({ "_id" : req.body.pollId }).remove().exec(function(){
            res.end();
        });
        
        
//        var votedPoll = Polls.find({
//            "_id": votedPollId
//        }).exec(function (err, poll) {
//            //console.log(poll[0].labels.indexOf(votaData));
//            votedIndex = poll[0].labels.indexOf(votaData);
//            //var changeDataseet = poll[0].dataset[votedIndex];
//            var arrrayDataset = poll[0].dataset;
//            var updatedIndex = arrrayDataset[votedIndex];
//            updatedIndex++
//            var newDatasetArray = arrrayDataset;
//            newDatasetArray[votedIndex] = updatedIndex;
//
//            Polls.findOneAndUpdate({
//                "_id": votedPollId
//            }, {
//                $set: {
//                    dataset: newDatasetArray
//                }
//            }, {
//                new: true
//            }, function (err, doc) {
//                if (err) {
//                    console.log("Something wrong when updating data!");
//                }
//                res.end();
//
//            });
//        });

    });



    //////////////////////////////////////////////TEST/////////////////////////////////////////


    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    //    app.get('/', function(req, res) {
    //        
    //        res.render('index.ejs');// load the index.ejs file
    //        
    //    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function (req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', {
            message: req.flash('loginMessage')
        });
    });

    ///template(remove once finish bulding template)
//    app.get('/template', function (req, res) {
//
//        // render the page and pass in any flash data if it exists
//        res.render('template.ejs', {
//            user: req.user
//
//        });
//    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));


    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages

    }));



    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function (req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', {
            message: req.flash('signupMessage')
        });
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function (req, res) {
        req.logout();
        req.flash('logout', 'You have been logged out!');
        res.redirect('/');


    });
};