var userapp = angular.module('userapp',[]);

userapp.controller('userctrl',function($scope,$http){

//1. success: 请求成功的回调
//2. error: 请求失败的回调
//这两个方法都有四个参数:①data: 返回的数据(或错误)②status: 响应的状态码 

var refresh = function(){

		$scope.score_options = [1,2,3,4,5];
		/*
		$http.get('/user/marks').success(
			function(data,status){
				$scope.mymarks = data;
			}
		);
		*/

		$http.get('/user/profile').success(
			function(data,status){
			$scope.user = data;
			$scope.error = "";
			//console.log(data);
		}).error(
			function(data,status){
				$scope.user = {};
				$scope.error = data;
				//console.log($scope.error);
		});

		//获取当前订单，若未付款，则显示未付款订单，不显示打分界面
		//若用户已经付款，则此已付款订单不再显示，显示打分界面
		//当用户打完分，信息将传入record表，
		//*同时在订单表中删除此人的已付款订单（也可以交给管理员删除）

		$http.get('/order/info').success(
			function(data,status){
			//这里获取了订单信息，获取status判断
			//console.log(data);
			if(data){
				//wconsole.log(data.status);
			if (data.status == 4) {
				//直接输入／user错误
				
				$scope.CurrentStatus = "排队中";
				$scope.UnpaidOrder = {  
                	show: true  
            	}
            	$scope.markedTip = {
            		show: true
            	}
            	$scope.cancelBtn = {
            		show: true
            	}
				$scope.order = data;
				$scope.error = "";
			}

			if (data.status == -1) {
				//直接输入／user错误
				//当status为-1时，说明有空位可以让其入座
				$scope.CurrentStatus = "可入座";
				$scope.paidTip = {
					show: false
				};
				$scope.UnpaidOrder = {  
                	show: true  
            	};
            	$scope.markedTip = {
            		show: true
            	};
            	$scope.cancelBtn = {
            		show: true
            	}
				$scope.order = data;
				$scope.error = "";
			}

			if (data.status == 0) {
				//直接输入／user错误
				//当status为0时，说明未付款，则显示出订单
				$scope.CurrentStatus = "用餐中";
				//console.log("OK");
				$scope.UnpaidOrder = {  
                	show: true  
            	}
            	$scope.markedTip = {
            		show: true
            	}
            	$scope.cancelBtn = {
            		show: false
            	}
				$scope.order = data;
				$scope.error = "";
			}  

			if(data.status == 1){
				//bug:未显示可打分信息
				$scope.CurrentStatus = "请打分";
				$scope.UnpaidOrder = {  
                	show: false  
            	}
				$scope.UnmarkedOrder = {  
                	show: true  
            	}

            	$scope.paidTip = {
            		show: true
            	}

            	$scope.markedTip = {
            		show: false
            	}
            	//console.log(data);
				//当status为1时，说明已付款，但未打分，显示打分界面，不显示该订单
				//此处bug：当该用户，已付款了a订单但未打分，下单了b订单，则a订单会被覆盖，
				//则a订单的打分表无法显示在	个人中心。［设置a订单未打分不能下单］

				//original idea: 用户未付款，不能接续下单。用户付款后，用户没有打分，可以下单。

				//new idea: 无论付款与否，个人中心都显示订单，
				//设置：用户提交订单后，数据库中存在用户订单（status＝＝0），用户无法继续下单，无法进入下单页面，即此处只用到add操作
				//而当用户进行第二次下单时，用户已经付款了（status == 1 or 2）
					//当status ＝＝ 1 时，未打分，提交后，此时该订单的status变为0，此前的打分表消失无法对上一订单评分。（相当于删除了）
					//当status ＝＝ 2 时，已打分，提交后，此时该订单的status变为0，此前的打分表已经打过分，并不影响。
				//record表只显示用户打过分的foods
				$scope.marktable = data;
				//console.log($scope.marktable);
				$scope.error = "";
				//console.log($scope.marktable);
			}

			/*
			if(data.status == 2){
				$scope.CurrentStatus = "无订单且无需评分";

				$scope.paidTip = {
            		show: true
            	}
            	$scope.markedTip = {
            		show: true
            	}
            	$scope.UnmarkedOrder = {  
                	show: false  
            	}
				//status为2时，说明已打分，管理员还未删除用户已付款订单，但并不显示
				$scope.order =  {};
				$scope.marktable = {};
				$scope.error = "No data"
			}
			*/
			}else{
			//当无订单信息时，无订单信息显示
			$scope.CurrentStatus = "无订单且无需评分";
			$scope.UnpaidOrder = {  
                	show: false  
            };
			$scope.paidTip = {
            		show: true
            }
            $scope.markedTip = {
            		show: true
            }
            $scope.UnmarkedOrder = {  
                	show: false  
            }
		}

		}).error(
			function(data,status){
				$scope.order = {};
				$scope.error = data;
				//console.log($scope.error);
		});

} 

refresh();

$scope.cancelorder = function(){
	$http.get('/order/info').success(
		function(data,status){
			//console.log(data);
			var theStatus=data.status;
			if(theStatus==0) {
				$scope.CurrentStatus = "用餐中";
				alert("状态已经更新为进餐中，无法取消订单");
				$scope.cancelBtn = {
            		show: false
            	}
				//刷新页面，使按钮消失（“用餐”中取消按钮消失）
			}else if(theStatus==1){
				$scope.CurrentStatus = "请打分";
				alert("订单已完成，请打分");
				refresh();
			}else{
			var orderid = data._id;
			$http.post('/order/delete/'+orderid).success(
			function(data,status){
				refresh();
			})
			}
		}
	);
}

$scope.addrecord = function(){
		var orderid = $scope.marktable._id; //获取订单的id
		var len = $scope.marktable.foods.length; //获取订单的所有的食物的数量
		var score =new Array();
		var foodid = new Array();
		var mark = new Array();
		for (var i=0;i<len;i++){
			foodid[i] = $scope.marktable.foods[i][0];
			//foodname[i] = $scope.marktable.foods[i][1];
			score[i] = $scope.marktable.foods[i][3];
			//mark[i] = [food[i],score[i]]; //定义mark为二维数组
			mark[i] = {"foodid": foodid[i],"score":score[i]}; //定义为有tag的数组
			//mark是一个二维数组mark[][0]为foodid，mark[][1]为该food的score
		}
		//在此处的marktable已经有score的值了
		//将订单id也传过去
		for(var j=0;j<len;j++){
			if (score[j]==0) {
				alert("未全部评分");
				break;
			}
		}
		//完成确认所有food都已经评分
		if(j==len){
			$http.post('/record/add',{mark:mark,orderid:orderid}).success(
			function(data,status){
				//console.log("添加记录成功");
				//记录添加成功后删除订单
				$http.post('/order/delete/'+orderid).success(function(){
					refresh();
				});

				//refresh();
			}).error(
			function(data,status){
				//console.log("添加记录失败");
				refresh();
			})
		}

}


});