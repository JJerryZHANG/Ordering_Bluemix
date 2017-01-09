var mongoose = require('mongoose'),
Record = mongoose.model('Record');
Order = mongoose.model('Order');
User = mongoose.model('User');
Food = mongoose.model('Food');
mongoose.Promise = global.Promise;
var ObjectId = require('mongodb').ObjectId; 

exports.addRecord = function(req,res){
	var orderid = req.body.orderid
	var newmark = req.body.mark;
	var objorderid = new ObjectId(orderid);
	var userid = req.session.user; //the current user's id
	//console.log(mark);

	mongodb.collection("records").findOne(
		{userid:userid},
		function(err,record){
			console.log(record);
			if(!record){
				//当没有该用户id下的记录时添加记录
				mongodb.collection("records").insertOne({
					userid:userid,
					mark:newmark
				},function(err,record){
					res.json(record);
				})
				//console.log("新添了数据到record表");
			}else{
				//当表中存在该用户记录时
				//首先获取该id下的信息
				//console.log("表中存在该用户");

			var recordUpdate = function(){
				mongodb.collection("records").update(
					{userid:userid},
					{$set:{mark:record.mark}},
						function(err,record){
							//console.log("更新了record表数据");
							res.json(record);
					});
			}
			
			var markUpdate = function(){
				var i,j=0;
				var l = record.mark.length;//用于增加数组
				var m = record.mark.length;
				var n = newmark.length;

				//更新分数
				for(j = 0;j<n;j++){ 
					//新增的分数表
					for(i=0;i<m;i++){ 
						//原纪录中的分数表
						if(record.mark[i].foodid == newmark[j].foodid){
							//找到了该foodid，更新分数
							record.mark[i].score = newmark[j].score;
							break;
						}	
					}
					//当在记录表中未找到该foodid，添加到record.mark数组里
						if(i==m){
							//console.log(newmark[j]);
							//record.mark[l] = newmark[j];
							record.mark.push(newmark[j]);
							//console.log(newmark[j]);
							//l=l+1;
						}
				}
				recordUpdate();
			}

			markUpdate();
			//recordUpdate();

			} //end of "else"

			/* this code is update the order to status:2, in fact, it can be deleted now*/
			/*
			var orderUpdate = function(){
			mongodb.collection("orders").update(
				{_id:orderid},
				{$set:{status:2}},
				function(err,order){
					console.log("该订单status已经置为2");
				});
			}
			orderUpdate();
			*/
			/*
			var orderDeleted = function(){
				mongodb.collection("orders").remove(
					{_id:objorderid},
					function(err,order){
						console.log("the order is deleted");
						res.json(order);
					}
			)}

			orderDeleted();
			*/
		}) //end of "mongodb.collection("orders").findOne(""
}

exports.getInputUser = function(req,res){
	if(req.session.user){
		//当session中有user时
		var InputUserid = req.session.user;//在会话中取用户id
		var InputUserarea = req.session.userarea;//在会话中取用户地区
		//console.log(InputUserarea);
		//var str = "InputUserid:"+InputUserid+","+"InputUserarea:"+InputUserarea;
		//console.log(str);
		res.json({"InputUserid":InputUserid,"InputUserarea":InputUserarea});
		//res.json({"InputUserid:"+InputUserid+","+"InputUserarea:"+InputUserarea});
	}else{
		res.json("");
	}
}

exports.getUsers = function(req,res){
	mongodb.collection("users").find({},
		{'hashed_password':0,'__v':0}).toArray(
			function(err,users){
				res.json(users);
			}
		);
}

exports.getFoods = function(req,res){
	//用于推荐foods信息
	mongodb.collection("foods").find({},
		{'fooddesc':0,'foodhot':0,'foodscore':0,'__v':0}).toArray(
			function(err,foods){
				res.json(foods);
			}
		);
}

exports.getFood = function(req,res){
	//获取特定用户的food
	var userid=req.params.id;
	//console.log(userid);
	//the data of order had been deleted, so the food info come from records
	mongodb.collection("records").findOne(
		{userid:userid},
		function(err,food){
			//console.log(food);
			res.json(food);
		}
	);
}

exports.getRecords = function(req,res){
	mongodb.collection("records").find(
		{},
		{_id:0,'__v':0}).toArray(
			function(err,records){
				res.json(records);
			}
		);
}

exports.userMarks = function(req,res){
	if (req.session.user) {
		var theUserid = req.session.user;//在会话中取用户id
		//获取用户评分
		mongodb.collection("records").find().toArray(
		function(err,record){
			res.json(record);
		}
	);}
}
	



