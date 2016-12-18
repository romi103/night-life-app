var clientIDAcebook = process.env.CLIENT_ID_FACBOOK;
var clientSecretFacebook = process.env.CLIENT_SECRET_FACBOOK;
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