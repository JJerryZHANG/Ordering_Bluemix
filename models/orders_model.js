var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


var OrderSchema = new Schema ({
	userid :String,
	username: String,
	guestnum: Number,
	staple: String,
	foods: Array,
	avoid: String,
	total: String,
	timestamp: {type: Date, default: Date.now},
	status: Number
},{ collection: 'orders' });

mongoose.model('Order',OrderSchema);
