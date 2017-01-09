
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var UserSchema = new Schema({
	username: {type:String,unique:true},
	hashed_password: String,
	age:Number,
	sex:String,
	area:String 
},{ collection: 'users' });

mongoose.model('User',UserSchema);