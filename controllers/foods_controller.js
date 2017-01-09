var mongoose = require('mongoose'),
	Food = mongoose.model('Food');
mongoose.Promise = global.Promise;
var ObjectId = require('mongodb').ObjectId; 

exports.getMenu = function(req,res){
	mongodb.collection("foods").find().toArray(
		function(err,menu){
			if (!menu) {
				res.json(404,{err:'Menu not Found.'});
			}else{
				res.json(menu);
				//console.log(menu);
			}
		});
};

//4、此处执行addFood函数，获取请求的数据并分别代入设定好的food模版中
exports.addFood = function(req,res){
	console.log(req.body);
	mongodb.collection("foods").insertOne({
		foodname:req.body.foodname,
		foodhot: 0,
		foodscore: 0,
		foodimg: req.body.foodimg+'.jpg',
		foodprice: req.body.foodprice,
		fooddesc: req.body.fooddesc,
		foodtype: req.body.foodtype,
		foodarea: req.body.foodarea
	},
	function(error,food) {
		if (error) {
			req.session.msg = "Add出错！该食品已经存在";
			res.redirect('/foodadmin'); 
		}else{
			req.session.msg = "Add successfully";
			res.redirect('/foodadmin'); 
		}
	})

/*
	var food = new Food({
		foodname:req.body.foodname,
		foodhot: 0,
		foodscore: 0
	});
	food.set('foodimg',req.body.foodimg+'.jpg');
	//console.log(req.body.foodimg);
	food.set('foodprice',req.body.foodprice);
	food.set('fooddesc',req.body.fooddesc);
	food.set('foodtype',req.body.foodtype);//菜的类型
	food.set('foodarea',req.body.foodarea);//菜的菜系

	food.save(function(err){
		if (err) {
			//res.session.error = err;
			//error 未被定义
			req.session.msg = "Add出错！该食品已经存在";
			res.redirect('/foodadmin'); 
			//如果保存发生错误，比如foodname已经存在，则跳转回foodadmin页面，利用"/foodadmin" http请求
		}else{
			req.session.food = food.id;
			//由mongodb创建的id被添加为req.session.food的属性
			//req.session.msg = food.id + "添加完成";
			res.redirect('/foodadmin'); 
			//保存成功，并跳转回foodadmin页面，利用"/foodadmin" http请求
		}
	})
	*/
}

exports.searchFood = function(req,res){
	var keyword = req.params.keyword;
	var query={};
  	if(keyword) {
   		query['foodname']=new RegExp(keyword);//模糊查询参数
  	}
	console.log(query);
	mongodb.collection("foods").find(query).toArray(function(err,foods){
		if (foods) {
			res.json(foods);
		}
	})
}

exports.deleteFood = function(req,res){
	var id=req.params.id;
	var objid = new ObjectId(id);
	mongodb.collection("foods").findOne({_id:objid},
		function(err,food){
		if (food) {
			mongodb.collection("foods").remove({_id:objid},function(err){
				if(err){
					console.log('delete failed')
				}
				res.redirect('/foodadmin');
			});
		}else{
			req.session.msg = "Food Not Found! ";
			res.redirect('/foodadmin');
		}
	})

}

exports.editFood = function(req,res){
	var id = req.params.id;
	var objid = new ObjectId(id);
	//console.log(id);
	mongodb.collection("foods").findOne({_id:objid},
	function(err,food){
		console.log(food);
		if (!food) {
			res.status(404).json({err:'The food not Found.'}) 
		}else{
			console.log(food);
			res.json(food);
		}
	})
}

exports.updateFood = function(req,res){
	var id = req.params.id;
	var objid = new ObjectId(id);
	//console.log(req.body.foodimg);
	mongodb.collection("foods").update(
		{_id:objid},
		{$set: 
			{
			foodimg:req.body.foodimg, 
			foodname:req.body.foodname, 
			foodprice:req.body.foodprice, 
			fooddesc:req.body.fooddesc,
			foodhot: 0,
			foodscore: 0
			}
		},
		function(err,food){
			res.json(food);
		})
}

exports.hotFood = function(req,res){
	//取消服务器hotfood数量限制
	mongodb.collection("foods").find().sort({foodhot:-1}).toArray(
		function(err,hotfood){
		console.log(hotfood);
		if (!hotfood) {
			console.log(hotfood);
			res.json(404,{err:'The hotfood not Found.'});
		}else{
			console.log(hotfood);
			res.json(hotfood);
		}
	})
}












