var indexapp = angular.module('indexapp',[]);

indexapp.controller('indexctrl',function($scope,$http){
		//var deferred = $q.defer();
		//1. success: 请求成功的回调
		//2. error: 请求失败的回调
		//这两个方法都有四个参数:①data: 返回的数据(或错误)②status: 响应的状态码 

		//以下获取
		var ulen,flen,rlen;
		var i,j,k,x;
		var foodArray = new Array();
		var userArray = new Array(); 
		var recordArray = new Array();
		//var simArray = new Array(); 
		var records; //records表内容
		//var recmdFood; //推荐结果
		var InputUserid;
		var InputUserarea;
		var hotfood = new Array;
		var foodsInfo = new Array();
		var recmdFoodInfo = new Array();

		var currentGuests=function(){
			//var Num = 0;
			$http.get('/orders/unpaid').success(
			function(data,status){
			//Num=data.length;
			$scope.eating=data.length;
			//console.log(data.length);
			});

			$http.get('/orders/available').success(
			function(data,status){
			//Num=data.length;
			$scope.available=data.length;
			//console.log(data.length);
			});

			$http.get('/orders/waiting').success(
			function(data,status){
			//Num=data.length;
			$scope.waiting=data.length;
			//console.log(data.length);
			});
		}

		currentGuests();

		setInterval(function(){
            $scope.$apply(currentGuests());
        },5000);

		$scope.init = function() {

		//当有用户登录时，出现“注销”，“个人中心”，“点单”按钮
		//当无用户登录时，出现“登录”，“注册”按钮
   		
    	$http.get('/food/hot').success(
			function(data,status){
			//console.log(data);
			var len=data.length;
			for(i=0;i<len;i++){
				hotfood[i]=data[i];
			}
			var hot_limited = 6; //限制显示10个热门
			data.splice(hot_limited); //data删除第六个开始的数组
			$scope.hotfood = data;
			$scope.error = "";
			later();
		});

		}

		var later = function(){

		$http.get('/user/get').success(
			function(data){
				//console.log(data);
				//$scope.InputUserid=data;
				//如果用户为空，则不去做个性化推荐
				if(data==""){
				//无用户登陆时，不显示个性化推荐
				//提示登录，显示注册 登录入口
					$scope.UserNo = {  
                	show: true  
            		}
            		$scope.UserYes = {  
                	show: false  
            		}

				}else{
				//有用户登录时，显示个性化推荐
					InputUserid = data.InputUserid;

					InputUserarea = data.InputUserarea;

					$scope.UserYes = {  
                	show: true  
            		}
            		$scope.UserNo = {  
                	show: false  
            		}
				//获取所有recordid（userid，foodid，score）
				//仅当该用户在record表中有记录才找推荐

					$http.get('/records/get').success(
					function(data){
						records = data;
						$scope.records=data;
						rlen = data.length;
						for(i=0;i<rlen;i++){
							userArray[i] = $scope.records[i].userid;
						}
						display(); //显示推荐信息
				});
				}
		});}

		//$scope.init = init();

		var display=function(){
			for(i=0;i<rlen;i++){
				if(userArray[i]==InputUserid){
					//当当前用户评分过，显示其推荐信息
					//以下为用户是老用户
					FoodsInfo();
					break;
				}
			}
			if(i==rlen){
				//当遍历整个数组未找到该用户评过分，则定义为新用户
				var len = hotfood.length;
				//console.log(len);
				var matchfood=new Array();
				//console.log(InputUserarea);

				for(i=0;i<len;i++){
					//console.log(hotfood[i].foodarea);
					if(InputUserarea==hotfood[i].foodarea){
						//获取所有用户喜爱菜系的food信息，并放入matchfood中
						matchfood.push(hotfood[i]);
					}
				}
				//热门数组中去取匹配信息
				//console.log(matchfood);
				//取其中的前6个
				$scope.recmdFoodInfo1 = matchfood.slice(0,4);
				$scope.recmdFoodInfo2 = matchfood.slice(4,8);
				//将matchfood中的信息放入推荐food中
			}
		}

		var FoodsInfo = function(){
		//当该用户为老用户时执行
		//获取所有foodid

		/*
		$http.get('/food/get/'+InputUserid).success(
			function(data){
				markedFood = data.mark; //获取该userid的food评分后
				markedlen = data.mark.length;
				for(var i=0;i<markedlen;i++){
					//獲得所有foodid和對應的score
				}
		});
		*/

		$http.get('/foods/get').success(
			function(data){
				$scope.foods=data;
				flen = data.length;
				//$scope.flen = data.length;
				for(i=0;i<flen;i++){
					foodArray[i] = $scope.foods[i]._id;
					//所有food的id集合
				}

				for(i=0;i<flen;i++){
					foodsInfo[i] = $scope.foods[i];
				}
				getRecmdfoodInfo();//获取推荐food信息
			}
		);
	
		}

		var getRecordArray = function(){			
			//*（增加对于未评分的数据进行预测）
			//初始化评分数组allArray，全部置为0（一维数组）
			var allArray = new Array();
			var recorddata = new Array();
			var InputFoodid;
			i=0;
			for(j=0;j<flen;j++){
				for(k=0;k<rlen;k++){
					allArray[i]=[foodArray[j],userArray[k],0];
					i++;
				}	
			}

			//获取records表中的所有数据，组成一个[foodid,userid,score]结构的数组recorddata
			x=0;
			for(k=0;k<flen;k++){
				InputFoodid = $scope.foods[k]._id;
				for(i=0;i<rlen;i++){
					mlen = $scope.records[i].mark.length;
					for(j=0; j<mlen; j++){
						if($scope.records[i].mark[j].foodid == InputFoodid){
							recorddata[x] = [$scope.records[i].mark[j].foodid,$scope.records[i].userid,$scope.records[i].mark[j].score];
							x++;	
						}	
					}
				}
			}

			//将评分放入初始化表，获得一个完整的用户评分矩阵
			var al = allArray.length;
			var rl = recorddata.length;
			for(i=0;i<al;i++){
				for(j=0;j<rl;j++){
					if(allArray[i][0]==recorddata[j][0]&&allArray[i][1]==recorddata[j][1]){
						allArray[i][2]=recorddata[j][2];
						break;
					}
				}
			}

			//将矩阵格式化成一个多维数组
			k=0;
			for(i=0;i<flen;i++){
				var tArray = new Array();//每次要重新使用tArray时，需要重新定义，指针重新指向
				for(j=0;j<rlen;j++){
					tArray[j]= allArray[k];
					k++;
				}
				recordArray[i] = tArray;
			}	
			$scope.recordArray = recordArray; //用户评分表，以item为主键
			console.log(recordArray);
		}

		//获取food向量数组,
		var vector = function(id){
			var foodVector = new Array();
			for(i=0;i<flen;i++){
				if(recordArray[i][0][0]==id){
					for(j=0;j<rlen;j++){
						foodVector[j]= Number(recordArray[i][j][2]);
					}
					break;
				}
			}
			//console.log(foodVector);
			return foodVector;
		}
		$scope.vector = vector;	


		//余弦相似度计算公式（food x,y 的相似度）
		var sim = function(x,y){
			var foodVector1 = new Array();
			var foodVector2 = new Array();
			var newVector1 = new Array();
			var newVector2 = new Array();
			var bleft=0;
			var bright=0;
			var top=0;
			var Sim =0;
			foodVector1 = vector(x);//得到food x的数组（包括0）
			foodVector2 = vector(y);//得到food y的数组（包括0）
			//console.log(foodVector1);
			//console.log(foodVector2);
			for(var i=0;i<rlen;i++){
				if(foodVector1[i]*foodVector1[i]!=0){
					//console.log(foodVector1[i])
					newVector1.push(foodVector1[i]);
					newVector2.push(foodVector2[i]);
				}
			}
			//console.log(newVector1.length);
			//console.log(newVector1);
			//console.log(newVector2);

			var newVelen = newVector1.length;
			/*
			for(i=0;i<rlen;i++){
				top = top + foodVector1[i]*foodVector2[i];
				bleft = bleft + foodVector1[i]*foodVector1[i];
				bright = bright + foodVector2[i]*foodVector2[i];
			}
			*/

			//相似度向量 選擇 所有不包含0的，向量長度可能不同
			for(i=0;i<newVelen;i++){
				top = top + newVector1[i]*newVector2[i];
				bleft = bleft + newVector1[i]*newVector1[i];
				bright = bright + newVector2[i]*newVector2[i];
			}

			Sim = (top/((Math.sqrt(bleft))*(Math.sqrt(bright)))).toFixed(6);
			Sim = parseFloat(Sim);
			return Sim;
		}

		$scope.sim = sim;//function

		/*
		var getSimArray = function(){
		//初始化相似值二维数组，默认全部相似度为1
			for(i=0;i<flen;i++){    
				simArray[i]=new Array(flen);  //声明二维，每一个一维数组里面的一个元素都是一个数组；	
			}
			for(i=0;i<flen;i++){
				for(j=0;j<flen;j++){
					//此处的vector 需要修改
					simArray[i][j] = [foodArray[i],foodArray[j],1];
				}
			}
			//计算所有food之间的相似度，分别代入相似度数组
			var m,n;
			for(m=0;m<flen-1;m++){
				for(n=m+1;n<flen;n++){
					simArray[m][n][2] = sim(foodArray[m],foodArray[n]);
					simArray[n][m][2] = sim(foodArray[m],foodArray[n]);
				}
			}
		$scope.simArray = simArray; //value
		//console.log(simArray);
		}
		*/

		var predictScore = function(targetfoodid,userMark){
			var top = 0;
			var bottom = 0;
			for(var i=0;i<userMark.length;i++){
				top=top+sim(userMark[i].foodid,targetfoodid)*userMark[i].score;
				bottom = bottom + sim(userMark[i].foodid,targetfoodid);
			}
			var theScore = top/bottom;
			return theScore;
		}

		//输入一个用户userid,找出其买过的所有food，按给分高低排序（a 5,b 4,c 3,d 2,e 1,f 0）
		var foodsbyscore = function(userid){
			var userMark;
			var unMarked = [];
			for(i=0;i<rlen;i++){
				if(records[i].userid == userid){
					userMark = records[i].mark;
					//获取了该用户的所有分数
					break;
				}
			}
			//console.log(userMark);

			for(var i=0;i<foodArray.length;i++){
				for(var j=0;j<userMark.length;j++){
					if(foodArray[i]==userMark[j].foodid){
						break;
					}
				}
				if(j==userMark.length){
					unMarked.push(foodArray[i]); //將未找到的foodid放入數組
				}
			}

			//console.log(unMarked); //获得了未评分food數組
			//predict(userid,foodid)
			//total flen的food，不是所有的food相似度都需要比較，只需要該userid評分過的比較
			var totalMark = [];
			for(var i=0;i<foodArray.length;i++){
				//获得所有foodid，去userMark中比对
				for(var j=0;j<userMark.length;j++){
					if(foodArray[i]==userMark[j].foodid){
						totalMark.push([foodArray[i],userMark[j].score]);
						break;
					}
				}
				if(j==userMark.length){
					totalMark.push([foodArray[i],parseFloat(predictScore(foodArray[i],userMark).toFixed(6))]);
				}

			}

			console.log(totalMark);
			//totalMark 包括了所有foodid，然後排序

			
			var totalMarkLen = totalMark.length;
			for(var i=0;i<totalMarkLen;i++){
				for(var j=i;j<totalMarkLen;j++){
					if(totalMark[i][1]<totalMark[j][1]){
						var temp = totalMark[i];
						totalMark[i] = totalMark[j];
						totalMark[j] = temp;
					}
				}
			}

			console.log(totalMark); //排序后的Mark

			return totalMark;
			


			//usermark和unmarked中的foodid的相似度，構成一個預測的評分表
			//如果有真實評分的，分數可見， 未評分的則有預測分數
			//直接取得所有food，及其分數，[{foodid,score},{foodid,score},...,{}]
			//if score is 0, then predict the foodid's score.
			// sum(sim[i]*userMark[i]/(sum(sim[i])

			//得到一个以userid为主键的 评分表，即 用户A对所有food的评价
			//1. 从foodArray得到所有foodid，2. 从recordArray得到该用户的所有评分即userMark
			//3. 在userMark中查找foodArray[i]的score，如果没找到，predict
			//4. 得到一個數組[[foodid1,score],[foodid2,score],...,[foodidn,score]]
			//5. 以下方式排序

			/*
			var userMarkLen = userMark.length;
			for(i=0;i<userMarkLen;i++){
				for(j=i;j<userMarkLen;j++){
					if(userMark[i].score<userMark[j].score){
						var temp = userMark[i];
						userMark[i] = userMark[j];
						userMark[j] = temp;
					}
				}
			}

			return userMark; //這個需要被取消，應該將所有物品的預測分數放入後再推薦。
			*/
			
		}

		$scope.foodsbyscore = foodsbyscore;//foodsbyscore操作

		//输入一个foodid，按相似度排序
		/*
		var foodsbysim = function(foodid){
			//console.log("foodsbysim");
			//console.log(flen);
			for(i=0;i<flen;i++){
				if(simArray[i][0][0] == foodid){
					var mostSim = new Array();
					for(x=0;x<flen;x++){
						mostSim[x]=simArray[i][x];//将所有数组赋值给mostSim
					}							
					for(k=0;k<flen;k++){
						for(j=k;j<flen;j++){
							if(mostSim[k][2]<mostSim[j][2]){
								var temp = mostSim[k];
								mostSim[k] = mostSim[j];
								mostSim[j] = temp;
							}
						}
					}
				break;			
				}
			}
		return mostSim;
		}

		$scope.foodsbysim = foodsbysim; //foodsbysim操作
		*/

		//获取 已经点过的food数组foodsbyscore(userid),取分数>＝3的所有foodid
		//获取 最相似food数组foodsbysim(foodid) 找出每个foodid的所有最相似food
		//获取 所有food数组foodArray，从分数最高最相似的foodid开始在foodArray中找，找到就往前排,得到一个推荐数组or_recmd数组
		//获取 recommend数组，指定用户food表recordArray[i],进行比对，将没点过的排前,得到ul_recmd数组

		/*
		var recmd = function(userid){
			var a,b,c,d;
			var favorite = new Array();		
			var ordered = foodsbyscore(userid);
			var orederedlen = ordered.length;
			//获取取分数>＝3的所有foodid
			var goodfoodscore = 3;
			for(a=0;a<orederedlen;a++){
				if(ordered[a].score < goodfoodscore ){
					break;
				}
				favorite[a] = ordered[a];
			}

			//找出所有food的相似度大于0.8的所有food放入数组or_recmdall
			var or_recmdall = new Array();
			var favlen = favorite.length;
			b=0;
			c=0;
			for(a=0;a<favlen;a++){
				var mostsims = foodsbysim(favorite[a].foodid);
				var mostsimslen = mostsims.length;
				for(b=0;b<mostsimslen;b++){
					if(mostsims[b][2]<0.8){
						break;
					}
				or_recmdall[c] = mostsims[b][1];
				c++;
				}	
			}
			//获得了包含所有推荐的foodid的or_recmdall数组（内部存在大量重复）
			var or_recmdalllen = or_recmdall.length;
			var or_recmd = new Array();
			var e=0;
			var f;
		   	outer_1:for(d=0;d<or_recmdalllen;d++){
						//取出or_recmd数组內的所有foodid，删除其中重复的数据
						//在放入or_recmd数组前查找它是否存在数组中
							var or_recmdlen = or_recmd.length;
							for(f=0;f<or_recmdlen;f++){
								if(or_recmdall[d]==or_recmd[f]){
									continue outer_1;//结束放入数组or_recmd
								}
							}
							or_recmd[e] = or_recmdall[d];
							e++;
						}

			//获得了or_recmd数组（无foodid重复）
			//将这个数组和user的food数组（可使用ordered，orederedlen为长度）比对
			var g,h;
			var or_recmd_len = or_recmd.length;
			var recmdyes = new Array();
			var recmdno = new Array();
			var p=0;
			var q=0;
			outer_2:for(g=0;g<or_recmd_len;g++){
						for(h=0;h<orederedlen;h++){
						//如果在ordered中找到了该food则放到recmdyes
						//如果在ordered中未找到了该food则放到recmdno
							if(or_recmd[g]==ordered[h].foodid){
								recmdyes[p] = or_recmd[g];
								p++;
								continue outer_2;
							}
						}
						//说明循环结束还未找到
						recmdno[q] = or_recmd[g];
						q++;
				   	}
					recmdFood = recmdno.concat(recmdyes);
					//$scope.recmdFood = recmdno.concat(recmdyes);
		}
		//$scope.recmd = recmd; //recmd操作
		*/

		var getRecmdfoodInfo = function(){
			//获取所有推荐的food的id后，查找food具体信息
			var Userid = InputUserid;
			getRecordArray(); //获取用户评分表
			var recmd = foodsbyscore(Userid); //获取對所有食物的评分
			//foodsInfo 保存了food的具体信息
			//推薦food数量為4个
			var recmd_amount = 2;
			console.log(foodsInfo);
			console.log(recmd);
			for(var i=0;i<recmd_amount;i++){
				for(var j=0;j<foodsInfo.length;j++){
					if(recmd[i][0]==foodsInfo[j]._id){
						recmdFoodInfo.push(foodsInfo[j]);
						break;
					}
				}
			}


			/*
			getSimArray();	//获取food相似表
			recmd(Userid);//获取推荐food及其信息
			var recmdFoodlen = recmdFood.length;
			var recmdfood_limited = 8;//限制取的推荐的物品数量
			if(recmdFoodlen>recmdfood_limited ){
				//限定了推荐的food的数量
				recmdFoodlen = recmdfood_limited;
			}

			k=0;
			for(i=0;i<recmdFoodlen;i++){
				for(j=0;j<flen;j++){
					if(foodsInfo[j]._id==recmdFood[i]){
						recmdFoodDisplay[k] = foodsInfo[j];
						k++;
						break;
					}
				}
			}
			*/
			//$scope.recmdFoodInfo = recmdFoodInfo;
			$scope.recmdFoodInfo1 = recmdFoodInfo.slice(0,4);
			$scope.recmdFoodInfo2 = recmdFoodInfo.slice(4,8);
			//console.log(recmdFoodInfo);
		}

});