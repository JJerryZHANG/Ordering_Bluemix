var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


var RecordSchema = new Schema ({
	userid :String,
	mark:Array
},{ collection: 'records' });

mongoose.model('Record',RecordSchema);
