var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var FoodSchema = new Schema({
	foodname: {type:String,unique:true},
	foodimg: {type:String},
	foodprice: {type:String},
	fooddesc: {type: String},
	foodhot:{type:Number},
	foodtype:{type: String},
	foodarea:{type: String},
	foodscore:{type:Number} 
},{ collection: 'foods' });

mongoose.model('Food',FoodSchema);