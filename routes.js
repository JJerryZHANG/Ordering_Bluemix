//var crypto=require('crypto'); // 加密解密功能
var express = require('express');
var multer = require('multer');

module.exports = function(app) {
	var users = require('./controllers/users_controller');
	var foods = require('./controllers/foods_controller');
	var orders = require('./controllers/orders_controller');
	var records = require('./controllers/records_controller');

	//用于传输food图片
	var storage = multer.diskStorage({
		destination: './static/imgs/foodimgs',
  		filename: function (req, file, cb) {
    	cb(null, req.body.foodimg + '.jpg')
  		}
	});

	var upload = multer({
		storage : storage,
	});

	app.use('/static', express.static('./static')).
	use('/lib',express.static('../lib')).use('/imgs',express.static('../imgs'));
	//app.use(express.static(__dirname + '/views'));

	app.get('/',function(req,res){
		if (req.session.user) {
			if (req.session.username == "admin") {
				res.redirect('/logout');//当管理员身份进入主页时，管理员身份被注销进入主页
			}else{
				res.render('index',{
				username:req.session.username,
			});
			}
		}else{
			res.render('index',{
				username:"Guest",
			});
		}
	});

	app.get('/user',function(req,res){
		if(req.session.user){
			if (req.session.username == "admin") {
				//console.log("Only For Users");
				res.redirect('/logout');//当管理员身份进入用户中心时，管理员身份被注销进入主页
			}else{
				res.render('user',{
				msg: req.session.msg
			});
			}			
		}else{
			req.session.msg = 'Access denied!';
			res.redirect('/login');
		}
	});

	app.get('/signup',function(req,res){
		res.render('signup',{
			//msg:req.session.msg
		});
	});

	app.get('/login',function(req,res){
		//当页面无用户登陆了则转向登陆页
			res.render('login',{
		});		
	});

	app.get('/logout',function(req,res){
		req.session.destroy(function(){
			res.redirect('/');//注销后跳转到主页
		});
	});

	//1、当输入localhost:3000/foodadmin,页面自动跳转到food管理页面
	//仅管理员可以登陆

	//用户下订单界面
	app.get('/order',function(req,res){
		//console.log(req.session.user);
		if(req.session.user){
			//获取当前订单状态
			if (req.session.username == "admin") {
				console.log("Only For Users");
				res.redirect('/logout');//当管理员身份进入点单页面时，管理员身份被注销进入主页
			}else{
				res.render('order',{
				msg: req.session.msg,				
			});
			}
		}else{
			req.session.msg = 'Access denied!';
			res.redirect('/login');
		}
	});

	app.get('/confirm',function(req,res){
		if(req.session.user){
			if (req.session.username == "admin") {
				res.redirect('/logout');//当管理员身份进入订单确认页面时，管理员身份被注销进入主页
			}else{
				res.render('confirm',{				
				//msg: req.session.msg,				
			});
			}			
		}else{
			req.session.msg = 'Access denied!';
			res.redirect('/login');
		}
	});

	app.get('/foodadmin',function(req,res){
		
		if (req.session.username == "admin") {
			res.render('foodadmin',{
		});			
		}else{
			req.session.msg = 'Access denied!';	
			console.log(req.session.username);
			console.log("管理员页面");
			res.redirect('/login');		
		}
		//打开该页面自动获取所有food
	});

	//仅管理员可以登陆
	app.get('/ordersadmin',function(req,res){
		if(req.session.username == "admin"){
			res.render('ordersadmin',{				
				msg: req.session.msg,				
			});			
		}else{
			req.session.msg = 'Access denied!';
			console.log("管理员页面");
			res.redirect('/login');			
		}			
	});

	app.get('/record',function(req,res){
		if(req.session.username == "admin"){
			res.render('record',{				
				msg: req.session.msg,				
			});			
		}else{
			req.session.msg = 'Access denied!';
			//console.log("管理员页面");
			res.redirect('/login');			
		}			
	});

	app.post('/signup',users.signup);
	//app.post('/user/update',users.updateUser);
	//app.post('/user/delete',users.deleteUser);
	app.post('/login',users.login);
	app.get('/user/profile',users.getUserProfile);

	app.get('/menu',foods.getMenu);

	//3、fooadmin页面发送了/food/add的post方法，此处给出了执行过程，为food控制文件中的addFood函数
	app.post('/food/add',upload.single('foodimg'),foods.addFood);
	app.post('/food/delete/:id',foods.deleteFood); //当页面网址如上时可以删除此id的food
	app.post('/food/search/:keyword',foods.searchFood);
	app.get('/food/edit/:id',foods.editFood);
	app.put('/food/update/:id',foods.updateFood);
	app.get('/food/hot',foods.hotFood);

	app.post('/order/add',orders.addOrder);
	app.get('/order/info',orders.getOrderInfo);

	//app.get('/orders/info',orders.getOrdersInfo);
	app.get('/orders/unpaid',orders.getUnpaidOrders);
	app.get('/orders/paid',orders.getPaidOrders);
	//app.get('/orders/marked',orders.getMarkedOrders);
	app.get('/orders/waiting',orders.getWaitingOrders);
	app.get('/orders/available',orders.getAvailableOrders);

	app.post('/order/sit/:id',orders.sitOrder);
	app.post('/order/pay/:id',orders.payOrder);
	//app.post('/order/mark/:id',orders.markOrder);
	app.post('/order/delete/:id',orders.deleteOrder);

	app.post('/record/add',records.addRecord);

	app.get('/users/get',records.getUsers);
	app.get('/foods/get',records.getFoods);
	app.get('/food/get/:id',records.getFood);
	app.get('/records/get',records.getRecords);
	app.get('/user/get',records.getInputUser);
	app.get('/user/marks',records.userMarks);

}