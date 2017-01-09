var crypto = require('crypto');
var mongoose = require('mongoose'),
	User = mongoose.model('User');
mongoose.Promise = global.Promise;
var ObjectId = require('mongodb').ObjectId; 

/*
var MongoClient = require("mongodb").MongoClient;
var cfenv = require('cfenv');
var appenv = cfenv.getAppEnv();
var services = appenv.services;
var mongodb_services = services["compose-for-mongodb"];
var credentials = mongodb_services[0].credentials;
var mongodb;

MongoClient.connect(credentials.uri, 
    function(err, db) {
        if (err) {
            console.log(err);
        } else {
            mongodb = db.db("admin");
        }
    }
);
*/

function hashPW(pwd) {
	return crypto.createHash('sha256').update(pwd).digest('base64').toString();
}

exports.signup = function(req,res){
	/*
	var user = new User(
	{
		username:req.body.username
	});

	user.set('hashed_password',hashPW(req.body.password));
	user.set('sex',req.body.sex);
	user.set('age',req.body.age);
	user.set('area',req.body.area);
	*/
	// the statement is executed in the database first to unique the username
	//mongodb.collection("users").createIndex( { "username": 1 }, { unique: true } )

	mongodb.collection("users").insertOne({
    username: req.body.username, 
    hashed_password: hashPW(req.body.password),
    sex: req.body.sex,
    age: req.body.age,
    area: req.body.area
	}, 
    function(error, user) {
      if (error) {
        //res.status(500).send(error);
        //username existed
        res.redirect('/signup');

      } else {
      	//console.log(user["ops"][0]["_id"]);
      	req.session.user = user["ops"][0]["_id"];
		req.session.userarea = user["ops"][0]["area"];
		req.session.username = user["ops"][0]["username"];
		res.redirect('/');
      }
    });

	/*
	user.save(function(err){
		if (err) {
			//res.session.msg = err;
			//error 未被定义
			res.redirect('/signup');
		}else{
			req.session.user = user.id;
			req.session.userarea = user.area;
			//由mongodb创建的id被添加为req.session.user的属性
			req.session.username = user.username;
			//req.session.msg = 'Authenticated as ' + user.username;
			res.redirect('/');
		}
	});
	*/
};

exports.login = function(req,res){

	mongodb.collection("users").findOne(
	{
		username:req.body.username
	},
	function(err,user){
		//console.log(user);
		if (!user) {
			err = 'User not Found!';
		}else if (user.hashed_password === hashPW(req.body.password.toString())) 
		{
			req.session.regenerate(
				function(){
					req.session.user = user._id;
					req.session.userarea = user.area;//在会话中存用户的area
					req.session.username = user.username;
					if (user.username == "admin") {
						res.redirect('/ordersadmin');
					}else{
						res.redirect('/');
					}			
				});
		}else{
			err = 'Authentication failed.';
		}
		if (err) {
			req.session.regenerate(function(){
				req.session.msg = err;
				res.redirect('/login');
			});
		}
	});

	/*
	User.findOne({
		username:req.body.username
	}).exec(function(err,user){
		if (!user) {
			err = 'User not Found!';
		}else if (user.hashed_password ===hashPW(req.body.password.toString())) {
			req.session.regenerate(
				function(){
					req.session.user = user.id;
					req.session.userarea = user.area;//在会话中存用户的area
					//由mongodb创建的id被添加为req.session.user的属性
					req.session.username = user.username;
					//req.session.msg = 'Authenticated as ' + user.username;
					if (user.username == "admin") {
						res.redirect('/ordersadmin');
					}else{
						res.redirect('/');
					}
					
				});
		}else{
			err = 'Authentication failed.';
		}
		if (err) {
			req.session.regenerate(function(){
				req.session.msg = err;
				res.redirect('/login');
			});
		}
	});
	*/
};

exports.getUserProfile = function(req,res){
	var userid = req.session.user;
	var objid = new ObjectId(userid);
	console.log(req.session.user);
	mongodb.collection("users").findOne(
		{_id:objid},{'hashed_password':0,'__v':0,'_id':0},
		function(err,user){
			if (!user) {
				res.status(404).json({err:'User not Found.'});
			}else{
				res.json(user);
			}
		});
};
