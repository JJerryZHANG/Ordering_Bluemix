var menuapp = angular.module('menuapp',[]);

menuapp.controller('menuctrl',function($scope,$http){
		
//1. success: 请求成功的回调
//2. error: 请求失败的回调
//这两个方法都有四个参数:①data: 返回的数据(或错误)②status: 响应的状态码  
	$scope.refresh=function(){
	$http.get('/menu').success(
			function(data,status){
			$scope.menu = data;
			//console.log(data);
			//$scope.error = "";
			//console.log($scope.error);
		}).error(
			function(data,status){
				$scope.menu = {};
				//$scope.error = data;
				//console.log($scope.error);
		});
	}

	$scope.refresh();

	$scope.searchfood=function(keyword){
		if (!keyword) {
			alert("请输入查询内容");
		}else{
			$http.post('/food/search/'+keyword).success(
			function(data,status){
				//console.log(data);
				if (data=="") {
					//console.log("无查询结果!");
					alert("无查询结果!");
					refresh();
				}else{
					$scope.menu = data;
				}
			})
		}	
	}

	$scope.deletefood=function(id){
		$http.post('/food/delete/'+id).success(
			function(){
				$scope.refresh();
				//$scope.error = "delete success";
				//console.log('delete success');
			}).error(
			function(){
				$scope.refresh();
				console.log("delete failed");
			});
	}

	//该功能函数指向 /food/edit/:id
	$scope.editfood=function(id){
		$http.get('/food/edit/'+id).success(
			function(data){
				$scope.editedfood = data;
				//console.log('I can edit food now');
			}).error(
			function(data){
				$scope.editedfood = {};
				console.log('can not edit food');
			});
	}

	$scope.updatefood = function(id){
		//console.log($scope.editedfood);
		if($scope.editedfood.fooddesc==""||$scope.editedfood.foodprice==""){
			alert("input the price or description")
		}else{
		$http.put('/food/update/'+id,$scope.editedfood).success(
			function(data){
				$scope.refresh();
				$scope.editedfood = {};
				//console.log('update success');
			}).error(
			function(data){
				$scope.refresh();
				$scope.editedfood = {};
				//console.log('update failed');
			});
		}
	}

});