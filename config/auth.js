//var clientIDAcebook = process.env.CLIENT_ID_FACBOOK;
var clientIDAcebook = '1657531017878504';

//var clientSecretFacebook = process.env.CLIENT_SECRET_FACBOOK;
var clientSecretFacebook = '19e7b298efd31ed5a24f541f3c370798';

var callbackURLFacbook = process.env.CALLBACK_FACBOOK;
var callbackURLFacbook = process.env.CALLBACK_FACBOOK;


module.exports = {

    'facebookAuth' : {
        'clientID'      : clientIDAcebook, // your App ID
        'clientSecret'  : clientSecretFacebook, // your App Secret
        'callbackURL'   : callbackURLFacbook
    }
//
//    'twitterAuth' : {
//        'consumerKey'       : 'your-consumer-key-here',
//        'consumerSecret'    : 'your-client-secret-here',
//        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
//    },
//
//    'googleAuth' : {
//        'clientID'      : 'your-secret-clientID-here',
//        'clientSecret'  : 'your-client-secret-here',
//        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
//    }

};