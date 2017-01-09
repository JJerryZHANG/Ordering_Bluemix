/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
// create a new express server
var app = express();

// cfenv provides access to your Cloud Foundry environment
var cfenv = require('cfenv');
// get the app environment from Cloud Foundry
var appenv = cfenv.getAppEnv();
var services = appenv.services;
var mongodb_services = services["compose-for-mongodb"];
var credentials = mongodb_services[0].credentials;
var mongouri = credentials.uri;
var bodyParser = require('body-parser');
var expressSession = require('express-session');

/*
//connect to mongodb by "mongoose"
var mongoose = require('mongoose');
mongoose.createConnection(mongouri, { server:{ ssl: true }}, function(err, db){
    if(err){
        console.log(err);
    } else {
        console.log("connect successful");
    }
});
*/


//coonect to mongodb by "mongodb"
//var ca = [new Buffer(credentials.ca_certificate_base64, 'base64')];
var MongoClient = require("mongodb").MongoClient;
MongoClient.connect(mongouri,
    function(err, db) {
        if (err) {
            console.log(err);
        } else {
            mongodb = db.db("myproj");
            //unique the username in the users coolection
            mongodb.createCollection("users");
            mongodb.collection("users").createIndex(
            { "username": 1 }, { unique: true });
            mongodb.createCollection("foods");
            mongodb.createCollection("orders");
            mongodb.createCollection("records");
        }
});

/*
// connect to mongodb by "mongodb"(original code)
var mongodb;
MongoClient.connect(credentials.uri, {
        mongos: {
            ssl: true,
            sslValidate: true,
            sslCA: ca,
            poolSize: 1,
            reconnectTries: 1
        }
    },
    function(err, db) {
        if (err) {
            console.log(err);
        } else {
            mongodb = db.db("examples");
        }
    }
);
*/

// serve the files out of ./public as our main files
//app.use(express.static(__dirname + '/public'));

app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine','html'); 

app.use(bodyParser());
/*
//can not be used when update the food
app.use(bodyParser.urlencoded({
  extended: false
}));
*/

/*
var mongoStore = require('connect-mongo')(
	{
		session: expressSession
	});
*/

app.use(expressSession(
{
	secret:'SECRET',
	cookie:{maxAge:60*60*1000}
    /*,
	store: new mongoStore(
	{
		url: "credentials.uri",
		collection:'sessions'
		//session对象直接绑定在MongoDB的sessions集合中的，以便更改会话时，它们被保存在数据库中
	})
	*/
}
));

require('./models/users_model.js');
require('./models/foods_model.js');
require('./models/orders_model.js');
require('./models/records_model.js');

require('./routes')(app);

//app.listen(3001);
var port = process.env.PORT || 3000;
app.listen(port);

//require("cf-deployment-tracker-client").track();

/*
// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
*/

