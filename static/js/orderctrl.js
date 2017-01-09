var orderapp = angular.module('orderapp',["checklist-model"]);

orderapp.controller('orderctrl',function($scope,$http,$window){

	var refresh=function(){
		$scope.staple = "米饭";
		$scope.guestnum = "2";
		$scope.avoid = "";
		$http.get('/menu').success(
			function(data,status){
			$scope.menu = data;//将food信息传递给menu
			//console.log(data);
			var foodtotal = data.length;
			var soup=[]; //汤
			var sweet=[]; //甜品
			var cold=[]; //冷菜
			var meat=[]; //荤菜
			var vege=[]; //蔬菜
			var drink=[]; //饮料
			var mainf=[]; //主食
			var unknow=[]; //未知
			//console.log(foodtotal);
			for(var i=0;i<foodtotal;i++){
				switch(data[i].foodtype){
					case "soup":
					soup.push(data[i]);
					break;
					case "sweet":
					sweet.push(data[i]);
					break;
					case "cold":
					cold.push(data[i]);
					break;
					case "meat":
					meat.push(data[i]);
					break;
					case "vege":
					vege.push(data[i]);
					break;
					case "drink":
					drink.push(data[i]);
					break;
					case "mainf":
					mainf.push(data[i]);
					default:
					unknow.push(data[i]);
				}
			}

			var pageSize = 5; //每页的内容数量

			var mainfpages = Math.ceil(mainf.length / pageSize); //分页数
			var souppages = Math.ceil(soup.length / pageSize); //分页数
			var sweetpages = Math.ceil(sweet.length / pageSize); //分页数
			var coldpages = Math.ceil(cold.length / pageSize); //分页数
			var meatpages = Math.ceil(meat.length / pageSize); //分页数
			var vegepages = Math.ceil(vege.length / pageSize); //分页数
			var drinkpages = Math.ceil(drink.length / pageSize); //分页数

			$scope.mainfpageList = [];
			$scope.souppageList = [];
			$scope.sweetpageList = [];
			$scope.coldpageList = [];
			$scope.meatpageList = [];
			$scope.vegepageList = [];
			$scope.drinkpageList = [];

			for(var i=0;i< mainfpages ;i++){
				$scope.mainfpageList.push(i+1); //pageList储存页码
			} //初始化获取页码数组

			for(var i=0;i< souppages ;i++){
				$scope.souppageList.push(i+1); //pageList储存页码
			} //初始化获取页码数组

			for(var i=0;i< sweetpages ;i++){
				$scope.sweetpageList.push(i+1); //pageList储存页码
			} //初始化获取页码数组

			for(var i=0;i< coldpages ;i++){
				$scope.coldpageList.push(i+1); //pageList储存页码
			} //初始化获取页码数组

			for(var i=0;i< meatpages ;i++){
				$scope.meatpageList.push(i+1); //pageList储存页码
			} //初始化获取页码数组

			for(var i=0;i< vegepages ;i++){
				$scope.vegepageList.push(i+1); //pageList储存页码
			} //初始化获取页码数组

			for(var i=0;i< drinkpages ;i++){
				$scope.drinkpageList.push(i+1); //pageList储存页码
			} //初始化获取页码数组

			$scope.mainfselPage = 1;
			$scope.soupselPage = 1;
			$scope.sweetselPage = 1;
			$scope.coldselPage = 1;
			$scope.meatselPage = 1;
			$scope.vegeselPage = 1;
			$scope.drinkselPage = 1;

			$scope.mainf = mainf.slice(0, pageSize);//初始化提取主食中的前五个数据
			$scope.soup = soup.slice(0, pageSize);//初始化提取主食中的前五个数据 
			$scope.sweet = sweet.slice(0, pageSize);//初始化提取主食中的前五个数据 
			$scope.cold = cold.slice(0, pageSize);//初始化提取主食中的前五个数据 
			$scope.meat = meat.slice(0, pageSize);//初始化提取主食中的前五个数据 
			$scope.vege = vege.slice(0, pageSize);//初始化提取主食中的前五个数据 
			$scope.drink = drink.slice(0, pageSize);//初始化提取主食中的前五个数据 

			$scope.isActivePage_mainf = function(page){
				return $scope.mainfselPage == page;
			}

			$scope.isActivePage_soup = function(page){
				return $scope.soupselPage == page;
			}

			$scope.isActivePage_cold = function(page){
				return $scope.coldselPage == page;
			}

			$scope.isActivePage_meat = function(page){
				return $scope.meatselPage == page;
			}

			$scope.isActivePage_vege = function(page){
				return $scope.vegeselPage == page;
			}

			$scope.isActivePage_drink = function(page){
				return $scope.drinkselPage == page;
			}

			$scope.isActivePage_sweet = function(page){
				return $scope.sweetselPage == page;
			}

			//点击的页码
			$scope.mainfSelectPage = function(page){

				if(page<1 || page>mainfpages) {
					return;
				}
				$scope.mainfselPage = page; //选定的页面为第page页赋值给selPage
				$scope.mainf = mainf.slice((pageSize*(page-1)),(pageSize*page));
				//$scope.mainf显示当前第page页的数据
				$scope.isActivePage_mainf(page); //改变状态
			};

			$scope.soupSelectPage = function(page){

				if(page<1 || page>souppages) {
					return;
				}
				$scope.soupselPage = page; //选定的页面为第page页赋值给selPage
				$scope.soup = soup.slice((pageSize*(page-1)),(pageSize*page));
				//$scope.mainf显示当前第page页的数据
				$scope.isActivePage(page); //改变状态
			};

			$scope.sweetSelectPage = function(page){

				if(page<1 || page>sweetpages) {
					return;
				}
				$scope.sweetselPage = page; //选定的页面为第page页赋值给selPage
				$scope.sweet = sweet.slice((pageSize*(page-1)),(pageSize*page));
				//$scope.mainf显示当前第page页的数据
				$scope.isActivePage(page); //改变状态
			};

			$scope.coldSelectPage = function(page){

				if(page<1 || page>coldpages) {
					return;
				}
				$scope.coldselPage = page; //选定的页面为第page页赋值给selPage
				$scope.cold = cold.slice((pageSize*(page-1)),(pageSize*page));
				//$scope.mainf显示当前第page页的数据
				$scope.isActivePage(page); //改变状态
			};

			$scope.meatSelectPage = function(page){

				if(page<1 || page>meatpages) {
					return;
				}
				$scope.meatselPage = page; //选定的页面为第page页赋值给selPage
				$scope.meat = meat.slice((pageSize*(page-1)),(pageSize*page));
				//$scope.mainf显示当前第page页的数据
				$scope.isActivePage(page); //改变状态
			};

			$scope.vegeSelectPage = function(page){

				if(page<1 || page>vegepages) {
					return;
				}
				$scope.vegeselPage = page; //选定的页面为第page页赋值给selPage
				$scope.vege = vege.slice((pageSize*(page-1)),(pageSize*page));
				//$scope.mainf显示当前第page页的数据
				$scope.isActivePage(page); //改变状态
			};

			$scope.drinkSelectPage = function(page){

				if(page<1 || page>drinkpages) {
					return;
				}
				//用于上一页和下一页的界值
				$scope.drinkselPage = page; //选定的页面为第page页赋值给selPage
				$scope.drink = drink.slice((pageSize*(page-1)),(pageSize*page));
				//$scope.mainf显示当前第page页的数据
				$scope.isActivePage(page); //改变状态
			};
			
			
			//上一页
			$scope.mainfPrevious = function () {
				$scope.mainfSelectPage($scope.mainfselPage - 1);
			}
			//下一页
			$scope.mainfNext = function () {
				$scope.mainfSelectPage($scope.mainfselPage + 1);
			};
			//上一页
			$scope.soupPrevious = function () {
				$scope.soupSelectPage($scope.soupselPage - 1);
			}
			//下一页
			$scope.soupNext = function () {
				$scope.soupSelectPage($scope.soupselPage + 1);
			};
			//上一页
			$scope.coldPrevious = function () {
				$scope.coldSelectPage($scope.coldselPage - 1);
			}
			//下一页
			$scope.coldNext = function () {
				$scope.coldSelectPage($scope.coldselPage + 1);
			};
			//上一页
			$scope.meatPrevious = function () {
				$scope.meatSelectPage($scope.meatselPage - 1);
			}
			//下一页
			$scope.meatNext = function () {
				$scope.meatSelectPage($scope.meatselPage + 1);
			};
			//上一页
			$scope.vegePrevious = function () {
				$scope.vegeSelectPage($scope.vegeselPage - 1);
			}
			//下一页
			$scope.vegeNext = function () {
				$scope.vegeSelectPage($scope.vegeselPage + 1);
			};
			//上一页
			$scope.drinkPrevious = function () {
				$scope.drinkSelectPage($scope.drinkselPage - 1);
			}
			//下一页
			$scope.drinkNext = function () {
				$scope.drinkSelectPage($scope.drinkselPage + 1);
			};
			//上一页
			$scope.sweetPrevious = function () {
				$scope.sweetSelectPage($scope.sweetselPage - 1);
			}
			//下一页
			$scope.sweetNext = function () {
				$scope.sweetSelectPage($scope.sweetselPage + 1);
			};

			$scope.error = "";
			$scope.order = {};
			$scope.order.foodinfo = "";//初始化

		}).error(
		function(data,status){

			$scope.menu = {};
			$scope.error = data;
				//console.log($scope.error);
				$scope.order = {};
				$scope.order.foodinfo = "";
			});
	}

	refresh();

$scope.clear = function(){
	$scope.order.foodinfo = "";
}

//order()函数用于提交预订的菜单到数据库
$scope.addorder = function(){
	if($scope.order.foodinfo==""){
		alert("未点菜，无法提交");
	}else{
		$http.get('/order/info').success(
			function(data,status){
				//console.log(data);
				if (data.status == 0) {
				//当用户还有未付款的订单时，无法点单
				//$window.location.href="/";
				alert("尚有未付款的订单，无法下单");
			}else if(data.status == -1){
				//当前用户在可入座名单中
				alert("已点单，待确认入座");
			}else{
				if(confirm("确认提交订单吗？")){
					if ($scope.avoid == "") {
						$scope.avoid = "无";
					}
					//console.log($scope.avoid );
					$http.post('/order/add',{
						orderfoods:$scope.order.foodinfo,
						avoid:$scope.avoid,
						guestnum:$scope.guestnum,
						staple:$scope.staple
					}).success(
					function(data){
						console.log("提交成功");
						$window.location.href="/confirm";
						//$http.post('/confirm');
			//数据添加成功后页面跳转到确认页面
			//在成功将菜单添加到数据库后进行页面跳转
		}).error(function(data){
			console.log('点菜失败！');
		});
	}else{
				//当未确认时，无继续操作
			}			
		}
	}).error(function(data,status){
			//此时用户收到404
			$window.location.href="/";
			console.log('无法获取status值');
		});
}			
}

});