var confirmapp = angular.module('confirmapp',[]);

confirmapp.controller('confirmctrl',function($scope,$http,$window){
		
//1. success: 请求成功的回调
//2. error: 请求失败的回调
//这两个方法都有四个参数:①data: 返回的数据(或错误)②status: 响应的状态码  
		$http.get('/order/info').success(
			function(data,status){
			//当查询order数据库表后，返回值为空则跳转到主页
			if(data==""){
				$window.location.href = "/";
			}
			$scope.order = data;
			$scope.error = "";
			//console.log($scope.order);			
		}).error(
			function(data,status){
				$scope.order = {};
				$scope.error = data;
				//$window.location.href = "/";
		});

		$scope.close = function(){
			$window.location.href = "/";
		}
});