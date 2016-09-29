//when deploying the app on herku please remeber to change the link var to PROD_MONGODB
//var link = process.env.PROD_MONGODB;
var link = process.env.MONGODB_URI;
//var link = "mongodb://romi103:tyfus12@ds013310.mlab.com:13310/heroku_tq5jcl24";

module.exports = {
    url: link
};