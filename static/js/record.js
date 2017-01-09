var recordapp = angular.module('recordapp',[]);

recordapp.controller('recordctrl',function($scope,$http){
		var ulen,flen,rlen;
		var i,j,k,x;
		var foodArray = new Array();
		var userArray = new Array(); 
		var recordArray = new Array();
		var simArray = new Array(); 
		var records; //records表内容
		var recmdFood; //推荐结果

		$http.get('/users/get').success(
			function(data){
				$scope.users=data;
			}
			).error(
			function(data){
				$scope.users={};
			}
		);

		//获取所有foodid
		$http.get('/foods/get').success(
			function(data){
				$scope.foods=data;
				flen = data.length;
				//$scope.flen = data.length;
				for(i=0;i<flen;i++){
					foodArray[i] = $scope.foods[i]._id;
				}
			}
		).error(
			function(data){
				$scope.foods={};
			}
		);
		$scope.foodArray = foodArray;

		//获取所有recordid（userid，foodid，score）
		$http.get('/records/get').success(
			function(data){
				records = data;
				$scope.records=data;
				rlen = data.length;
				//$scope.rlen = data.length;
				for(i=0;i<rlen;i++){
					userArray[i] = $scope.records[i].userid;
				}
				getRecordArray(); //获取用户评分表
				getSimArray();	//获取food相似表
			}
		).error(
			function(data){
				$scope.records={};
			}
		);
		$scope.userArray = userArray;//获取所有评分过的用户id

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
			//将矩阵格式化成一个三维数组
			k=0;
			for(i=0;i<flen;i++){
				var tArray = new Array();//每次要重新使用tArray时，需要重新定义，指针重新指向
				for(j=0;j<rlen;j++){
					tArray[j]= allArray[k];
					k++;
				}
				recordArray[i] = tArray;
			}	
			$scope.recordArray = recordArray; //value
		}

		//获取food向量数组
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
			console.log(foodVector);
			return foodVector;
		}
		$scope.vector = vector;	


		//余弦相似度计算公式（food x,y 的相似度）
		var sim = function(x,y){
			var foodVector1,foodVector2 = new Array();
			var bleft=0;
			var bright=0;
			var top=0;
			var Sim =0;
			foodVector1 = vector(x);//得到food x的数组
			foodVector2 = vector(y);//得到food y的数组
			for(i=0;i<rlen;i++){
				top = top + foodVector1[i]*foodVector2[i];
				bleft = bleft + foodVector1[i]*foodVector1[i];
				bright = bright + foodVector2[i]*foodVector2[i];
			}
			Sim = (top/((Math.sqrt(bleft))*(Math.sqrt(bright)))).toFixed(6);
			Sim = parseFloat(Sim);
			console.log(Sim);
			return Sim;
		}

		$scope.sim = sim;//function

		var getSimArray = function(){
		//初始化相似值二维数组，默认全部相似度为1
			for(i=0;i<flen;i++){    
				simArray[i]=new Array(flen);  //声明二维，每一个一维数组里面的一个元素都是一个数组；	
			}
			for(i=0;i<flen;i++){
				for(j=0;j<flen;j++){
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
		}

		//输入一个用户userid,找出其买过的所有food，按给分高低排序（a 5,b 4,c 3,d 2,e 1,f 0）
		var foodsbyscore = function(userid){
			var userMark;
			for(i=0;i<rlen;i++){
				if(records[i].userid == userid){
					userMark = records[i].mark;//获取了该用户的所有分数
					break;
				}
			}
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
			console.log(userMark);
			return userMark;
		}

		$scope.foodsbyscore = foodsbyscore;//foodsbyscore操作

		//输入一个foodid，按相似度排序
		var foodsbysim = function(foodid){
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
		console.log(mostSim);
		return mostSim;
		}

		$scope.foodsbysim = foodsbysim; //foodsbysim操作

		//获取 已经点过的food数组foodsbyscore(userid),取分数>＝3的所有foodid
		//获取 最相似food数组foodsbysim(foodid) 找出每个foodid的所有最相似food
		//获取 所有food数组foodArray，从分数最高最相似的foodid开始在foodArray中找，找到就往前排,得到一个推荐数组or_recmd数组
		//获取 recommend数组，指定用户food表recordArray[i],进行比对，将没点过的排前,得到ul_recmd数组
		var recmd = function(userid){
			var a,b,c,d;
			var favorite = new Array();		
			var ordered = foodsbyscore(userid);
			var orederedlen = ordered.length;
			//获取取分数>＝3的所有foodid
			for(a=0;a<orederedlen;a++){
				if(ordered[a].score < 3){
					break;
				}
				favorite[a] = ordered[a];
			}

			//找出所有food的相似度大于0.8的所有food放入数组or_recmdall
			var favlen = favorite.length;
			var or_recmdall = new Array();
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
					$scope.recmdFood = recmdno.concat(recmdyes);			
			}
			$scope.recmd = recmd; //recmd操作
})