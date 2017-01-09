var orderadminapp = angular.module('orderadminapp',[]);

orderadminapp.controller('orderadminctrl',function($scope,$http){

	//订单管理界面定时刷新
		
//1. success: 请求成功的回调
//2. error: 请求失败的回调
//这两个方法都有四个参数:①data: 返回的数据(或错误)②status: 响应的状态码  
		var refresh =function(){

		//正在等待的订单
		$http.get('/orders/waiting').success(
			function(data,status){
			if (data) {
			var thelen = data.length;
			for(var i=0;i< thelen; i++){
				data[i].timestamp = data[i].timestamp.match(/\d{2}:\d{2}:\d{2}/)[0];
			}
			$scope.waitingorders = data;
			$scope.error = "";
			//console.log(data);
			}			
		}).error(
		 	//console.log("get it");
			function(data,status){
				$scope.waitingorders = {};
				$scope.error = data;
				//console.log($scope.error);
		});

		//有位置可入座的订单
		$http.get('/orders/available').success(
			//console.log("get it");
			function(data,status){
			console.log(data);
			if(data){
			var thelen = data.length;
			var timeReg = /\d{2}:\d{2}:\d{2}/
			for(var i=0;i< thelen; i++){
				//console.log(data[i].timestamp)
				data[i].timestamp = data[i].timestamp.match(/\d{2}:\d{2}:\d{2}/)[0];
				//console.log(data[i].timestamp);
			}
			$scope.availableorders = data;
			$scope.error = "";
			}		
		}).error(
		 	//console.log("get it");
			function(data,status){
				$scope.availableorders = {};
				$scope.error = data;
				//console.log($scope.error);
		});

			$http.get('/orders/unpaid').success(
			//console.log("get it");
			function(data,status){
			$scope.unpaidorders = data;
			$scope.error = "";
			//console.log(data);			
		}).error(
		 	//console.log("get it");
			function(data,status){
				$scope.unpaidorders = {};
				$scope.error = data;
				//console.log($scope.error);
		});

			$http.get('/orders/paid').success(
			function(data,status){
			if(data){
			var thelen = data.length;
			for(var i=0;i< thelen; i++){
				data[i].timestamp = data[i].timestamp.match(/\d{4}-\d{2}-\d{2}/)[0];
			}
			$scope.paidorders = data;
			//console.log(data);
			$scope.error = "";
			//console.log(data);
			//console.log($scope.orders);
			}		
		}).error(
		 	//console.log("get it");
			function(data,status){
				$scope.paidorders = {};
				$scope.error = data;
				//console.log($scope.error);
		});

		/*
			$http.get('/orders/marked').success(
			//console.log("get it");
			function(data,status){
			$scope.markedorders = data;
			$scope.error = "";
			//console.log($scope.orders);			
		}).error(
		 	//console.log("get it");
			function(data,status){
				$scope.markedorders = {};
				$scope.error = data;
				//console.log($scope.error);
		});
		*/

/*
			$http.get('/orders/info').success(
			//console.log("get it");
			function(data,status){
			$scope.orders = data;
			$scope.error = "";
			//console.log($scope.orders);			
		}).error(
		 	//console.log("get it");
			function(data,status){
				$scope.orders = {};
				$scope.error = data;
				//console.log($scope.error);
		});
*/

        }

        refresh();

        setInterval(function(){
            $scope.$apply(refresh);
            },5000);

        //确认入座
        $scope.sit = function(id) {
        	$http.post('/order/sit/'+id).success(
        		function(){
				refresh();
				console.log('确认入座');
        	}).error(
        	function(){
        		refresh();
				console.log('入座失败');
        	});
        }

        //付款
        $scope.pay = function(id) {
        	$http.post('/order/pay/'+id).success(
        		function(){
				refresh();
				console.log('pay success');
        	}).error(
        	function(){
        		refresh();
				console.log('pay failed');
        	});
        }

        //删除
		$scope.delete = function(id) {
			$http.post('/order/delete/'+id).success(
				function(){
				refresh();
				console.log('delete success');
				}).error(
				function(){
				refresh();
				console.log("delete failed");
				});
		}

});