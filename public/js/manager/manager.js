function Cake(){
	this.addListener();
	this.init();
}
$.extend(Cake.prototype,{
	tab:0,
	init(){
		$(".position-page").addClass("active").siblings().removeClass("active");
		this.loadByPage(1);
		this.loadPage();
		this.handleGetAllStoreAndType();
	},
	addListener(){
		//点击翻页处理
		$(".pagination").on("click",".page",this.loadByPageHandler.bind(this));
		//添加商品
		$(".btn-add-cake").on("click",this.addCakeHandler.bind(this));
		//添加店铺
		$(".btn-add-store").on("click",this.addStoreHandler.bind(this));
		//添加类型
		$(".btn-add-type").on("click",this.addTypeHandler.bind(this));
		//页面后退
		$(".pagination").on("click",".previous",this.loadByPrevious.bind(this));
		//页面前进
		$(".pagination").on("click",".next",this.loadByNext.bind(this));
		//删除商品
		$("tbody").on("click",".removeCake",function(e){
			if(confirm("确认删除该商品吗?")){
				this.removeCakeHandler(e.target);
			}
		}.bind(this));
		//删除店铺
		$("tbody").on("click",".removeStore",function(e){
			if(confirm("确认删除该颠店铺吗?")){
				this.removeStoreHandler(e.target);
			}
		}.bind(this));
		//删除类型
		$("tbody").on("click",".removeType",function(e){
			if(confirm("确认删除该类型吗?")){
				this.removeTypeHandler(e.target);
			}
		}.bind(this));
		//点击修改获取当前商品信息
		$("tbody").on("click",".updateCake",this.nowId);
		//点击修改获取当前店铺信息
		$("tbody").on("click",".updateStore",this.nowStoreId);
		//点击修改获取当前类型信息
		$("tbody").on("click",".updateType",this.nowTypeId);
		//修改商品
		$(".btn-update-cake").on("click",this.updateCakeHandler.bind(this));
		//修改店铺
		$(".btn-update-store").on("click",this.updateStoreHandler.bind(this));
		//修改类型
		$(".btn-update-type").on("click",this.updateTypeHandler.bind(this));
		//搜索类型
		$(".chooseType").on("click","a",this.chooseType);
		//商品搜索
		$(".find").on("click",this.findCake.bind(this));
		//店铺搜索
		$(".findStore").on("click",this.findStore.bind(this));
		//类型搜索
		$(".findType").on("click",this.findType.bind(this));
		//重新加载全部商品信息
		$(".reload").on("click",this.init.bind(this));
		//内容切换
		$(".change-content").on("click","li",this.changeContent.bind(this));
		//查看订单详情
		$(".user-table").on("click",".seemore",this.cakeDetails.bind(this));
		//修改订单状态
		$(".details-table").on("click",".changeState",this.changeState.bind(this));
		//删除订单
		$(".details-table").on("click",".removeOrder",this.removeOrder.bind(this));		
		//查看购物车详情
		$(".user-table").on("click",".seecart",this.cakeCart.bind(this));
		//查看商品评论详情
		$(".cake-table").on("click",".seecomment",this.cakeComment.bind(this));
		//删除评论
		$(".comments-table").on("click",".removeComment",this.removeComment.bind(this))
		//增加管理员
		$(".btn-add-manager").on("click",this.addManager.bind(this));
		//获取当前管理员信息
		$("tbody").on("click",".updateManager",this.nowManager);
		//更新管理员信息
		$(".update-btn").on("click",this.updateManager.bind(this));
		//修改密码按钮
		$(".password-btn").on("click",this.changePassword.bind(this));
	},
	//获取所有店铺
	handleGetAllStoreAndType(){
		$.post("/api/store/findAll",(data)=>{
			if(data.res_code == 1) {
				var html="";
				data.res_body.data.forEach((curr,index)=>{
					html+=`<option>${curr.name}</option>`;
				});
				$("#store").html(html);
				$("#updateStore").html(html);
			}
		});
		$.post("/api/type/findAll",(data)=>{
			if(data.res_code == 1) {
				var html="";
				data.res_body.data.forEach((curr,index)=>{
					html+=`<option>${curr.name}</option>`;
				});
				$("#type").html(html);
				$("#updateType").html(html);
			}
		});
		
	},
	success(text){
		$(".update-success").html(text);
		$(".update-success").removeClass("hidden");
		setTimeout(()=>{
			$(".update-success").addClass("hidden");
		},1500);
	},
	error(text){
		$(".update-error").html(text);
		$(".update-error").removeClass("hidden");
		setTimeout(()=>{
			$(".update-error").addClass("hidden");
		},1500);
	},
	addManager(){
		let formData=new FormData($(".add-manager-form")[0]);
		$("#addmanagerModal").modal("hide");
		const _data = $(".add-manager-form").serialize()+"&level=1";
		//console.log(data);
		$.post('/api/findAll',(data)=>{
			//console.log(data);
			// 处理响应数据
			if (data.res_code === 1) { // 注册管理员成功
				let isHave = false;
				console.log(formData.get("name"),data.res_body.data)
				data.res_body.data.forEach( ele => {
					if(ele.name == formData.get("name")){
						this.error('该用户名已被注册');
						isHave = true;
					}
				})
				if(!isHave){
					const url="/api/register";
						$.post(url,_data,(data)=>{
							//console.log(data);
							// 处理响应数据
							if (data.res_code === 1) { // 注册管理员成功
								this.success('注册管理员成功');
							} else { // 注册失败
								this.error('注册管理员失败');
							}
						});
				}
			} else { // 注册失败
				this.error('注册管理员失败');
			}
		});
	},
	//修改订单状态
	changeState(e){
		this.handleGetAllStoreAndType();
		const src = e.target;
		const name = $(src).parent().siblings(".username").html();
		const orderId = $(src).parent().siblings(".id").html();
		let state = $(src).parent().siblings(".state").html();
		if(state == '已完成'){
			alert('该订单已完成');
			return;
		}
		if(state == '配送中'){
			alert('该订单已发货，正在配送中...');
			return;
		}
		state = '配送中';
		$.post("/api/find",{name,level:0},(data)=>{
			console.log(data)
			if(data.res_code ===1){
				console.log('订单',data.res_body.data[0].cake);
				var arr=data.res_body.data[0].cake;
				for(var i=0;i<arr.length;i++){
					if(arr[i].length >1 ){
						for(let a = 0; a<arr[i].length;a++){
							if(arr[i][a].order_id == orderId){
								arr[i][a].state = state;
							}
						}
					}else{
						if(arr[i][0].order_id == orderId){
							arr[i][0].state = state;
						}
					}
					
				}
				cake = JSON.stringify(arr);
				$.post("/api/update",{name:name,cake:cake,level:0},(data)=>{
					console.log('修改订单状态',data);
					if(data.res_code === 1){
						this.success('修改状态成功');
						$(src).parent().siblings(".state").html('配送中')
					}else{
						this.error('修改状态失败');
					}
				});

			}
		});
	},
	//删除订单
	removeOrder(e){
		const src = e.target;
		const name = $(src).parent().siblings(".username").html();
		const orderId = $(src).parent().siblings(".id").html();
		$.post("/api/find",{name,level:0},(data)=>{
			console.log(data)
			if(data.res_code ===1){
				var arr=data.res_body.data[0].cake;
				arr = arr.filter(function(item,index){
					return item.id !== orderId;
				})
				cake = JSON.stringify(arr);
				$.post("/api/update",{name:name,cake:cake,level:0},(data)=>{
					console.log('删除订单',data)
					if(data.res_code === 1){
						this.success('删除订单成功');
						$.post("/api/find",{name,level:0},(data)=>{
							if(data.res_code ===1){
								//console.log(data.res_body);
								if(data.res_body.data[0].cake.length===0){
									var html = `<p>该用户暂无订单</p>`;
									$(".details-table tbody").html(html);
								}else{
									var arr=data.res_body.data[0].cake;
									var html="";
									for(var key in arr){
										html+=`<tr>
										<td class='username' style='display:none'>${name}</td>
										<td class='id'>${arr[key].order_id}</td>
										<td>${arr[key].cakename}</td>
										<td>${arr[key].cakenum}</td>
										<td>${arr[key].order_time}</td>
										<td>${arr[i][0].totalPrice}</td>
										<td class='state'>${arr[key].state}</td>
										<td>
											<a href="javascript:void(0);" title="" class="changeState">确定发货</a>
										</td>
										</tr>`;
									}
									$(".details-table tbody").html(html);
								}	
							}
						});
					}else{
						this.error('删除订单失败');
					}
				});

			}
		});
	},
	//订单信息
	cakeDetails(e){
		const src = e.target;
		const name = $(src).parent().siblings(".username").html();
		$.post("/api/find",{name,level:0},(data)=>{
			if(data.res_code ===1){
				//console.log(data.res_body);
				if(data.res_body.data[0].cake.length===0){
					var html = `<p>该用户暂无订单</p>`;
					$(".details-table tbody").html(html);
				}else{
					var arr=data.res_body.data[0].cake;
					console.log('order',arr)
					var html="";
					for(let i = 0; i<arr.length; i++){
						if(arr[i].length >1){
							for(let j = 0; j < arr[i].length ; j++){
								if( j === 0 ){
									html+=`<tr>
										<td class='username' style='display:none'>${name}</td>
										<td class='id'>${arr[i][0].order_id}</td>
										<td>${arr[i][0].cakename}</td>
										<td>${arr[i][0].cakeprice}</td>
										<td>${arr[i][0].cakenum}</td>
										<td>${arr[i][0].order_time}</td>
										<td>${arr[i][0].totalPrice}</td>
										<td>${arr[i][0].address_name}</td>
										<td>${arr[i][0].address_tel}</td>
										<td>${arr[i][0].address_content}</td>
										<td class='state'>${arr[i][0].state}</td>
										<td>
											<a href="javascript:void(0);" title="" class="changeState">确定发货</a>
										</td>
										</tr>`;
								}else{
									html+=`<tr>
										<td class='username' style='display:none'></td>
										<td class='id'></td>
										<td>${arr[i][j].cakename}</td>
										<td>${arr[i][j].cakeprice}</td>
										<td>${arr[i][j].cakenum}</td>
										<td>${arr[i][j].order_time}</td>
										<td>${arr[i][0].totalPrice}</td>
										<td>${arr[i][0].address_name}</td>
										<td>${arr[i][0].address_tel}</td>
										<td>${arr[i][0].address_content}</td>
										<td class='state'></td>
										<td>
										</td>
										</tr>`;
								}
							}
						}else{
							for(var key in arr[i]){
								html+=`<tr>
								<td class='username' style='display:none'>${name}</td>
								<td class='id'>${arr[i][key].order_id}</td>
								<td>${arr[i][key].cakename}</td>
								<td>${arr[i][key].cakeprice}</td>
								<td>${arr[i][key].cakenum}</td>
								<td>${arr[i][key].order_time}</td>
								<td>${arr[i][0].totalPrice}</td>
								<td>${arr[i][0].address_name}</td>
								<td>${arr[i][0].address_tel}</td>
								<td>${arr[i][0].address_content}</td>
								<td class='state'>${arr[i][key].state}</td>
								<td>
									<a href="javascript:void(0);" title="" class="changeState">确定发货</a>
								</td>
								</tr>`;
							}
						}
					}
					// for(var key in arr){
					// 	html+=`<tr>
					// 	<td class='username'>${name}</td>
					// 	<td class='id'>${arr[key].id}</td>
					// 	<td>${arr[key].cakename}</td>
					// 	<td>${arr[key].cakeprice}</td>
					// 	<td>${arr[key].cakenum}</td>
					// 	<td>${arr[key].order_time}</td>
					// 	<td class='state'>${arr[key].state}</td>
					// 	<td>
					// 		<a href="javascript:void(0);" title="" class="changeState">修改订单状态</a>
					// 	</td>
					// 	<td>
					// 		<a href="javascript:void(0);" title="" class="removeOrder">删除订单</a>
					// 	</td>
					// 	</tr>`;
					// }
					$(".details-table tbody").html(html);
				}	
			}
		});
	},
	//购物车信息
	cakeCart(e){
		const src = e.target;
		const name = $(src).parent().siblings(".username").html();
		this.name = name;
		$.post("/api/find",{name,level:0},(data)=>{
			if(data.res_code ===1){
				if(data.res_body.data[0].cart.length===0){
					var html = `<p>该用户购物车为空</p>`;
					$(".carts-table tbody").html(html);
				}else{
					var arr=data.res_body.data[0].cart;
					var html="";
					for(var key in arr){
						html+=`<tr>
						<td>${arr[key].id}</td>
						<td>${arr[key].cakename}</td>
						<td>${arr[key].cakeprice}</td>
						<td>${arr[key].cakenum}</td>
						</tr>`;
					}
					$(".carts-table tbody").html(html);
				}	
			}
		});
	},
	//商品评论信息
	cakeComment(e){
		const src = e.target;
		const _id = $(src).parent().siblings(".id").html();
		$.post("/api/cake/find",{_id},(data)=>{
			if(data.res_code ===1){
				console.log(">>>",data.res_body,data.res_body.data[0].comment.length);
				if(data.res_body.data[0].comment.length===0){
					var html = `<p>该商品评论为空</p>`;
					$(".comments-table tbody").html(html);
				}else{
					var arr=data.res_body.data[0].comment;
					console.log(arr);
					var html="";
					for(var key in arr){
						html+=`<tr>
						<td class='id'>${_id}</td>
						<td class='commentId'>${arr[key].id}</td>
						<td>${arr[key].content}</td>
						<td>
							<a href="javascript:void(0);" title="" class="removeComment"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>
						</td>
						</tr>`;
					}
					$(".comments-table tbody").html(html);
				}	
			}
		});
	},
	//删除评论
	removeComment(e){
		const src = e.target;
		const _id = $(src).parent().parent().siblings(".id").html();
		const commentId = $(src).parent().parent().siblings(".commentId").html();
		$.post("/api/cake/find",{_id},(data)=>{
			if(data.res_code ===1){
				let arr = data.res_body.data[0].comment;
				arr = arr.filter(function(item,index){
					return item.id !== commentId;
				})
				const comment = JSON.stringify(arr)
				$.post("/api/cake/update",{_id,comment:comment},(data)=>{
					if(data.res_code ===1){
						this.success('删除评论成功');
						$.post("/api/cake/find",{_id},(data)=>{
							if(data.res_code ===1){
								console.log(">>>",data.res_body);
								if(data.res_body.data[0].comment.length===0){
									var html = `<p>该商品评论为空</p>`;
									$(".comments-table tbody").html(html);
								}else{
									var arr=data.res_body.data[0].comment;
									console.log(arr);
									var html="";
									for(var key in arr){
										html+=`<tr>
										<td class='id'>${_id}</td>
										<td class='commentId'>${arr[key].id}</td>
										<td>${arr[key].content}</td>
										<td>
											<a href="javascript:void(0);" title="" class="removeComment"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>
										</td>
										</tr>`;
									}
									$(".comments-table tbody").html(html);
								}	
							}
						});
					}else{
						this.error('删除评论失败');
					}
				});
			}
		});
	},
	//修改密码操作
	changePassword(){
		//获取两次输入的密码，判断是否一致
		var newPwd=$("#newPwd").val();
		if($("#againNewPwd").val()===newPwd){
			const name = JSON.parse(sessionStorage.loginUser).name;
			const data = $(".password-form").serialize()+"&level=1&name="+name;
			//console.log(data);
			const url="/api/update/";
			$.post(url,data,(data)=>{
				if(data.res_code===1){
					// 修改成功
					this.success("修改密码成功,请重新登录");
					setTimeout(()=>{
						$.get("/api/logout",(data)=>{
							if(data.res_code===1){
								sessionStorage.removeItem("loginUser");
								// 刷新
								window.location.href = "/";
							}
						});
					},1500);
				}else{
					this.error("原密码错误，请重新尝试");
				}	
			});
		}else{
			this.error('两次密码输入不一致');
		}
		
	},
	//当前搜索类型
	chooseType(){
		var aaa=$(this).html();
		var type=$(this).attr("class");
		//console.log(aaa);
		$(".thistype").attr("what",type);
		//console.log($(".thistype").attr("what"));
		$(".thistype").html(aaa+"<span class='caret'></span>");
	},
	//加载页数
	loadPage(){
		if(this.tab ===0){
			$.post("/api/cake/findpage",(data)=>{
				this.page=data.res_body.data;
				var html=`<li class="previous">
					      <a href="javascript:void(0);" aria-label="Previous">
					        <span aria-hidden="true">&laquo;</span>
					      </a>
					    </li>`;
				for(var i=0;i<this.page;i++){
					if(i==0) html+=`<li class="active page"><a href="javascript:void(0);">${i+1}</a></li>`;
					else html+=`<li ><a class="page" href="javascript:void(0);">${i+1}</a></li>`;
				}
				html+=`<li class="next">
					      <a href="javascript:void(0);" aria-label="Next">
					        <span aria-hidden="true">&raquo;</span>
					      </a>
					    </li>`;
				$(".pagination").html(html);
			});
		}else if(this.tab ===1){
			$.post("/api/type/findpage",(data)=>{
				this.page=data.res_body.data;
				var html=`<li class="previous">
					      <a href="javascript:void(0);" aria-label="Previous">
					        <span aria-hidden="true">&laquo;</span>
					      </a>
					    </li>`;
				for(var i=0;i<this.page;i++){
					if(i==0) html+=`<li class="active page"><a href="javascript:void(0);">${i+1}</a></li>`;
					else html+=`<li ><a class="page" href="javascript:void(0);">${i+1}</a></li>`;
				}
				html+=`<li class="next">
					      <a href="javascript:void(0);" aria-label="Next">
					        <span aria-hidden="true">&raquo;</span>
					      </a>
					    </li>`;
				$(".pagination").html(html);
			});
		}else if(this.tab ===2){
			$.post("/api/store/findpage",(data)=>{
				this.page=data.res_body.data;
				var html=`<li class="previous">
					      <a href="javascript:void(0);" aria-label="Previous">
					        <span aria-hidden="true">&laquo;</span>
					      </a>
					    </li>`;
				for(var i=0;i<this.page;i++){
					if(i==0) html+=`<li class="active page"><a href="javascript:void(0);">${i+1}</a></li>`;
					else html+=`<li ><a class="page" href="javascript:void(0);">${i+1}</a></li>`;
				}
				html+=`<li class="next">
					      <a href="javascript:void(0);" aria-label="Next">
					        <span aria-hidden="true">&raquo;</span>
					      </a>
					    </li>`;
				$(".pagination").html(html);
			});
		}else if(this.tab ===3){
			$.post("/api/find",{name:"kry",level:0},(data)=>{
				//console.log(data);
				this.page = Math.ceil(data.res_body.data.length/3);
				var html =`<li class="previous">
					      <a href="javascript:void(0);" aria-label="Previous">
					        <span aria-hidden="true">&laquo;</span>
					      </a>
					    </li>`;
				for(var i=0;i<this.page;i++){
					if(i==0) html+=`<li class="active page"><a href="javascript:void(0);">${i+1}</a></li>`;
					else html+=`<li ><a class="page" href="javascript:void(0);">${i+1}</a></li>`;
				}
				html+=`<li class="next">
					      <a href="javascript:void(0);" aria-label="Next">
					        <span aria-hidden="true">&raquo;</span>
					      </a>
					    </li>`;
				$(".pagination").html(html);
			});
		}
		
	},
	//按页加载商品信息
	loadByPage(page){
		page=page||1;
		//加载页面
		//console.log(this.tab);
		if(this.tab === 0){
			//获取商品信息
			$.post("/api/cake/findbypage",{page},(data)=>{
				//console.log(data);
				var html="";
				data.res_body.data.forEach((curr,index)=>{
					$.post("/api/store/findAll",(data)=>{
						storeArr = data.res_body.data;
						storeArr.map((item,index) => {
							if(item._id == curr.store){
								curr.store = item.name;
							}
						});
						$.post("/api/type/findAll",(data)=>{
							typeArr = data.res_body.data;
							typeArr.map((item,index) => {
								if(item._id == curr.type){
									curr.type = item.name;
								}
							});
							html+=`<tr>
								<td class="id">${curr._id}</td>
								<td><img src="${curr.cover}" with="60"  height="60"}></td>
								<td>${curr.name}</td>
								<td>${curr.type}</td>
								<td>${curr.price}</td>
								<td>${curr.store}</td>
								<td>
									<button type="button" class="btn btn-primary seecomment" data-toggle="modal" data-target="#cakeCommetModal">查看详情</button>
								</td>
								<td>
									<a href="javascript:void(0);" title="" class="updateCake" data-toggle="modal" data-target="#updateModal"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a>
									<a href="javascript:void(0);" title="" class="removeCake"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>
								</td>
							</tr>
							`;
							$(".cake-table tbody").html(html);
							$(".paginationHide").removeClass("hide");
						});
					});
				});
			
			});
		}else if(this.tab === 1){
			//获取类型信息
			$.post("/api/type/findbypage",{page},(data)=>{
			var html="";
			data.res_body.data.forEach((curr,index)=>{
					html+=`<tr>
	 						<td class="id">${curr._id}</td>
							<td>${curr.name}</td>
							<td>
								<a href="javascript:void(0);" title="" class="updateType" data-toggle="modal" data-target="#updateModalType"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a>
								<a href="javascript:void(0);" title="" class="removeType"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>
							</td>
						</tr>
					`;
					$(".type-table tbody").html(html);
					$(".paginationHide").removeClass("hide");
				});
			});
		}else if(this.tab === 2){
			//获取店铺信息
			$.post("/api/store/findbypage",{page},(data)=>{
			//console.log(data);
			var html="";
			data.res_body.data.forEach((curr,index)=>{
					html+=`<tr>
	 						<td class="id">${curr._id}</td>
							<td>${curr.name}</td>
							<td>${curr.address}</td>
							<td>${curr.tel}</td>
							<td>
								<a href="javascript:void(0);" title="" class="updateStore" data-toggle="modal" data-target="#updateModalStore"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a>
								<a href="javascript:void(0);" title="" class="removeStore"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>
							</td>
						</tr>
					`;
					$(".store-table tbody").html(html);
					$(".paginationHide").removeClass("hide");
				});
			});
		}else if(this.tab===3){
			//获取普通用户信息
			$.post("/api/find",{page},(data)=>{
			//console.log(data);
			var html="";
			data.res_body.forEach((curr,index)=>{
					html+=`<tr>
	 						<td class="username">${curr.name}</td>
							<td>${curr.sex}</td>
							<td>${curr.age}</td>
							<td>${curr.tel}</td>
							<td>${curr.reg_time}</td>
							<td>
							<button type="button" class="btn btn-primary seemore" data-toggle="modal" data-target="#userdetailModal">查看详情</button>
							</td>
							<td>
							<button type="button" class="btn btn-primary seecart" data-toggle="modal" data-target="#usercartModal">查看详情</button>
							</td>
						</tr>
					`;
					$(".user-table tbody").html(html);
					$(".paginationHide").removeClass("hide");
				});
			});
		}else if(this.tab===4){
			//获取管理员信息
			var name=JSON.parse(sessionStorage.loginUser).name;
			$.post("/api/find",{name,level:1},(data)=>{
				//console.log(data);
				var html="";
				html+=`<tr>
						<td class="username">${data.res_body.data[0].name}</td>
						<td>${data.res_body.data[0].sex}</td>
						<td>${data.res_body.data[0].age}</td>
						<td>${data.res_body.data[0].tel}</td>
						<td>${data.res_body.data[0].reg_time}</td>
						<td>
							<a href="javascript:void(0);" title="" class="updateManager" data-toggle="modal" data-target="#updateManagerModal"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a>
						</td>
					</tr>
				`;
				$(".manager-table tbody").html(html);
				$(".paginationHide").removeClass("hide");
				
				
			});
		}
		
	},
	//翻页处理
	loadByPageHandler(e){
		const src=e.target;
		const page=Number($(src).text())||1;
		this.loadByPage(page);
		$(src).parent().addClass("active").siblings().removeClass("active");
		return false;
	},
	//页面后退
	loadByPrevious(){
		var index=Number($(".pagination").children(".active").children("a").html());
		index=index>1?--index:1;
		this.loadByPage(index);
		$(".pagination").children("li:eq("+index+")").addClass("active").siblings().removeClass("active");
		$(".new-pagination").children("li:eq("+index+")").addClass("active").siblings().removeClass("active");
	},
	//页面前进
	loadByNext(){
		var index=Number($(".pagination").children(".active").children("a").html());
		//当前总页数
		maxIndex=this.page;
		index=index<maxIndex?++index:maxIndex;
		this.loadByPage(index);
		$(".pagination").children("li:eq("+index+")").addClass("active").siblings().removeClass("active");
		$(".new-pagination").children("li:eq("+index+")").addClass("active").siblings().removeClass("active");
	},
	//添加商品
	addCakeHandler(){
		var _this=this;
		let formData=new FormData($(".add-cake-form")[0]);
		let store =  formData.get("store");
		let type =  formData.get("type");
		let _id =  formData.get("_id");
		formData.append("store_name", store);
		formData.append("type_name", type);
		let storeArr = [];
		let typeArr = [];
		let isHave = false;
		$.post("/api/cake/findAll",(_data)=>{
			cakeArr = _data.res_body.data;
			cakeArr.map((item,index) => {
				if(item._id == _id){
					isHave = true;
				}
			})
			if(isHave){
				$("#addModal").modal("hide");
				_this.error('该商品Id已存在');
			}else{
				$.post("/api/store/findAll",(data)=>{
					storeArr = data.res_body.data;
					storeArr.map((item,index) => {
						if(item.name == store){
							formData.set("store", item._id);
						}
					});
					$.post("/api/type/findAll",(data)=>{
						typeArr = data.res_body.data;
						typeArr.map((item,index) => {
							if(item.name == type){
								formData.set("type", item._id);
							}
						});
						let url ="/api/cake/publish";
						$.ajax({
							type:"post",
							url,
							data:formData,
							dataType:"json",
							processData:false,
							contentType:false,
							success(data){
								// 关闭模态框
								$("#addModal").modal("hide");
								if(data.res_code===1){
									_this.loadByPage();
									_this.loadPage();
									_this.success('添加商品成功');
								}else{
									_this.error('添加商品失败');
								}
							}
						});
					});
				});
			}
		});
	},
	//添加店铺
	addStoreHandler(){
		console.log('////')
		let formData=new FormData($(".add-store-form")[0]);
		let url ="/api/store/publish";
		var _this=this;
		var data = {};
		data._id = formData.get("_id");
		data.name = formData.get("name");
		data.address = formData.get("address");
		data.tel = formData.get("tel");
		let isHave = false;
		$.post("/api/store/findAll",(_data)=>{
			storeArr = _data.res_body.data;
			storeArr.map((item,index) => {
				if(item._id == data._id){
					isHave = true;
				}
			})
			if(isHave){
				$("#addModalStore").modal("hide");
				_this.error('该店铺Id已存在');
			}else{
				//add
				$.post({
					url,
					data,
					success(data){
						// 关闭模态框
						$("#addModalStore").modal("hide");
						if(data.res_code===1){
							_this.loadByPage();
							_this.loadPage();
							_this.success('添加店铺成功');
						}else{
							_this.error('添加店铺失败');
						}
					}
				});
			}
		});
	},
	//添加类型
	addTypeHandler(){
		let formData=new FormData($(".add-type-form")[0]);
		let url ="/api/type/publish";
		var _this=this;
		var data = {};
		data._id = formData.get("_id");
		data.name = formData.get("name");
		let isHave = false;
		$.post("/api/type/findAll",(_data)=>{
			typeArr = _data.res_body.data;
			typeArr.map((item,index) => {
				if(item._id == data._id){
					isHave = true;
				}
			})
			if(isHave){
				$("#addModalType").modal("hide");
				_this.error('该类型Id已存在');
			}else{
				$.post({
					url,
					data,
					success(data){
						// 关闭模态框
						$("#addModalType").modal("hide");
						if(data.res_code===1){
							_this.loadByPage();
							_this.loadPage();
							_this.success('添加类型成功');
						}else{
							_this.error('添加类型失败');
						}
					}
				});
			}
		});
	},
	//删除商品
	removeCakeHandler(e){
		var _id=$(e).parent().parent().siblings(".id").html();
		//console.log(_id);
		let url ="/api/cake/delete";
		$.post(url,{_id},(data)=>{
			//console.log(data);
			if(data.res_code==1){
				this.loadByPage();
				this.loadPage();
				this.success('删除商品成功');
			}else{
				this.error('删除商品失败');
			}
			
		});
	},
	//删除店铺
	removeStoreHandler(e){
		var _id=$(e).parent().parent().siblings(".id").html();
		let url ="/api/store/delete";
		$.post(url,{_id},(data)=>{
			//console.log(data);
			if(data.res_code==1){
				this.loadByPage();
				this.loadPage();
				this.success('删除店铺成功');
			}else{
				this.error('删除店铺失败');
			}
			
		});
	},
	//删除类型
	removeTypeHandler(e){
		var _id=$(e).parent().parent().siblings(".id").html();
		let url ="/api/type/delete";
		$.post(url,{_id},(data)=>{
			//console.log(data);
			if(data.res_code==1){
				this.loadByPage();
				this.loadPage();
				this.success('删除类型成功');
			}else{
				this.error('删除类型失败');
			}
			
		});
	},
	//获取当前点击商品id
	nowId(){
		var _id=$(this).parent().siblings(".id").html();
		$(".update-cake-form #updateCakeId").val(_id);
	},
	//获取当前点击店铺id
	nowStoreId(){
		var _id=$(this).parent().siblings(".id").html();
		$(".update-store-form #updateStoreId").val(_id);
	},
	//获取当前点击类型id
	nowTypeId(){
		var _id=$(this).parent().siblings(".id").html();
		$(".update-type-form #updateTypeId").val(_id);
	},
	//获取当前点击管理员用户名
	nowManager(){
		console.log($(this).parent().parent().children("td:eq(0)").html());
		$(".update-form #nowManagerName").val($(this).parent().parent().children("td:eq(0)").html());
		$(".update-form #nowManagerSex").val($(this).parent().parent().children("td:eq(1)").html());
		$(".update-form #nowManagerAge").val($(this).parent().parent().children("td:eq(2)").html());
		$(".update-form #nowManagerTel").val($(this).parent().parent().children("td:eq(3)").html());
	},
	//修改商品
	updateCakeHandler(){
		let formData=new FormData($(".update-cake-form")[0]);
		let store =  formData.get("store");
		let type =  formData.get("type");
		formData.append("store_name", store);
		formData.set("type_name", type);
		console.log('>>>',store);
		let storeArr = [];
		let typeArr = [];
		let url ="/api/cake/update";
		var _this=this;
		$.post("/api/store/findAll",(data)=>{
			storeArr = data.res_body.data;
			storeArr.map((item,index) => {
				if(item.name == store){
					formData.set("store", item._id);
				}
			})
			$.post("/api/type/findAll",(data)=>{
				typeArr = data.res_body.data;
				typeArr.map((item,index) => {
					if(item.name == type){
						formData.set("type", item._id);
					}
				})
				$.ajax({
					type:"post",
					url,
					data:formData,
					dataType:"json",
					processData:false,
					contentType:false,
					success(data){
						// 关闭模态框
						if(data.res_code===1){
							_this.loadPage();
							_this.loadByPage();
							_this.success('修改商品成功');
						}else{
							_this.error('修改商品失败');
						}
						$("#updateModal").modal("hide");
					}
				});
			});
		});
	},
	//修改类型
	updateTypeHandler(){
		let formData=new FormData($(".update-type-form")[0]);
		let url ="/api/type/update";
		var _this=this;
		var data = {};
		data._id = formData.get("_id");
		data.name = formData.get("name");
		$.post({
			url,
			data,
			success(data){
				// 关闭模态框
				$("#addModalType").modal("hide");
				if(data.res_code===1){
					_this.loadByPage();
					_this.loadPage();
					_this.success('修改类型成功');
				}else{
					_this.error('修改类型失败');
				}
				$("#updateModalType").modal("hide");
			}
		});
	},
	//修改店铺
	updateStoreHandler(){
		let formData=new FormData($(".update-store-form")[0]);
		let url ="/api/store/update";
		var _this=this;
		// $.ajax({
		// 	type:"post",
		// 	url,
		// 	data:formData,
		// 	dataType:"json",
		// 	processData:false,
		// 	contentType:false,
		// 	success(data){
		// 		// 关闭模态框
		// 		if(data.res_code===1){
		// 			_this.loadPage();
		// 			_this.loadByPage();
		// 			_this.success('修改店铺成功');
		// 		}else{
		// 			_this.error('修改店铺失败');
		// 		}
		// 		$("#updateModalStore").modal("hide");
		// 	}
		// });
		var data = {};
		data._id = formData.get("_id");
		data.name = formData.get("name");
		data.address = formData.get("address");
		data.tel = formData.get("tel");
		$.post({
			url,
			data,
			success(data){
				// 关闭模态框
				$("#addModalStore").modal("hide");
				if(data.res_code===1){
					_this.loadByPage();
					_this.loadPage();
					_this.success('修改店铺成功');

				}else{
					_this.error('修改店铺失败');
				}
				$("#updateModalStore").modal("hide");
			}
		});
	},
	//分类查找商品
	findCake(){
		let value=$(".findCondition").val();
		if(!$(".thistype").attr("what"))
		{var key = "_id";
			}else{
				var key = $(".thistype").attr("what");
			}
		var obj={};
		//查找店铺
		if(key == 'store'){
			$.post("/api/store/findAll",(data)=>{
				if(data.res_code == 1) {
					var html="";
					data.res_body.data.forEach((curr,index)=>{
						if(curr.name.indexOf(value) != '-1'){
							obj.info=curr._id;
							obj.type=key;
							let url ="/api/cake/find";
							console.log(obj)
							$.post(url,obj,(data)=>{
								//获取查询后的数据渲染页面
								if(data.res_body.data.length){
									data.res_body.data.forEach((curr,index)=>{
										$.post("/api/store/findAll",(_data)=>{
											storeArr = _data.res_body.data;
											storeArr.map((item,index) => {
												if(item._id == curr.store){
													curr.store = item.name;
												}
											});
											$.post("/api/type/findAll",(_dataNow)=>{
												typeArr = _dataNow.res_body.data;
												typeArr.map((item,index) => {
													if(item._id == curr.type){
														curr.type = item.name;
													}
												});
												html+=`<tr>
												<td class="id">${curr._id}</td>
												<td><img src="${curr.cover}" with="60"  height="60"}></td>
												<td>${curr.name}</td>
												<td>${curr.type}</td>
												<td>${curr.price}</td>
												<td>${curr.store}</td>
												<td>
													<button type="button" class="btn btn-primary seecomment" data-toggle="modal" data-target="#cakeCommetModal">查看详情</button>
												</td>
												<td>
													<a href="javascript:void(0);" title="" class="updateCake" data-toggle="modal" data-target="#updateModal"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a>
													<a href="javascript:void(0);" title="" class="removeCake"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>
												</td>
											</tr>
											`;
											$(".cake-table tbody").html(html);
											$(".paginationHide").addClass("hide");
											});
										});
									});
								}else{
									this.error('没有查询的商品');
								}
							});
						}
					});
				}
			});	
		}else if(
			key == 'type'
		){
			$.post("/api/type/findAll",(data)=>{
				if(data.res_code == 1) {
					var html="";
					data.res_body.data.forEach((curr,index)=>{
						if(curr.name.indexOf(value) != '-1'){
							obj.info=curr._id;
							obj.type=key;
							let url ="/api/cake/find";
							$.post(url,obj,(data)=>{
								//获取查询后的数据渲染页面
								if(data.res_body.data.length){
									data.res_body.data.forEach((curr,index)=>{
										$.post("/api/type/findAll",(_data)=>{
											typeArr = _data.res_body.data;
											typeArr.map((item,index) => {
												if(item._id == curr.type){
													curr.type = item.name;
												}
											});
											$.post("/api/store/findAll",(_dataNow)=>{
												storeArr = _dataNow.res_body.data;
												storeArr.map((item,index) => {
													if(item._id == curr.store){
														curr.store = item.name;
													}
												});
												html+=`<tr>
												<td class="id">${curr._id}</td>
												<td><img src="${curr.cover}" with="60"  height="60"}></td>
												<td>${curr.name}</td>
												<td>${curr.type}</td>
												<td>${curr.price}</td>
												<td>${curr.store}</td>
												<td>
													<button type="button" class="btn btn-primary seecomment" data-toggle="modal" data-target="#cakeCommetModal">查看详情</button>
												</td>
												<td>
													<a href="javascript:void(0);" title="" class="updateCake" data-toggle="modal" data-target="#updateModal"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a>
													<a href="javascript:void(0);" title="" class="removeCake"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>
												</td>
											</tr>
											`;
											$(".cake-table tbody").html(html);
											$(".paginationHide").addClass("hide");
											});
										});
									});
								}else{
									this.error('没有查询的商品');
								}
							});
						}
					});
				}
			});
			
		}else{
			obj.info=value;
			obj.type=key;
			let url ="/api/cake/find";
			$.post(url,obj,(data)=>{
				console.log(data);
				//获取查询后的数据渲染页面
				if(data.res_body.data.length){
					var html ='';
					data.res_body.data.forEach((curr,index)=>{
						$.post("/api/type/findAll",(_data)=>{
							typeArr = _data.res_body.data;
							typeArr.map((item,index) => {
								if(item._id == curr.type){
									curr.type = item.name;
								}
							});
							$.post("/api/store/findAll",(_dataNow)=>{
								storeArr = _dataNow.res_body.data;
								storeArr.map((item,index) => {
									if(item._id == curr.store){
										curr.store = item.name;
									}
								});
								html+=`<tr>
								<td class="id">${curr._id}</td>
								<td><img src="${curr.cover}" with="60"  height="60"}></td>
								<td>${curr.name}</td>
								<td>${curr.type}</td>
								<td>${curr.price}</td>
								<td>${curr.store}</td>
								<td>
									<button type="button" class="btn btn-primary seecomment" data-toggle="modal" data-target="#cakeCommetModal">查看详情</button>
								</td>
								<td>
									<a href="javascript:void(0);" title="" class="updateCake" data-toggle="modal" data-target="#updateModal"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a>
									<a href="javascript:void(0);" title="" class="removeCake"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>
								</td>
							</tr>
							`;
							$(".cake-table tbody").html(html);
							$(".paginationHide").addClass("hide");
							});
						});
					});
				}else{
					this.error('没有查询的商品');
				}
			});
		}
		
	},
	//分类查找店铺
	findStore(){
		let value=$(".findStoreCondition").val();
		if(!$(".thistype").attr("what"))
		{var key = "_id";
			}else{
				var key = $(".thistype").attr("what");
			}
			console.log(key)
		var obj={};
		obj.info=value;
		obj.type=key;
		let url ="/api/store/find";
		$.post(url,obj,(data)=>{
			//获取查询后的数据渲染页面
			if(data.res_body.data.length){
				var html="";
				data.res_body.data.forEach((curr,index)=>{
					html+=`<tr>
	 						<td class="id">${curr._id}</td>
							<td>${curr.name}</td>
							<td>${curr.address}</td>
							<td>${curr.tel}</td>
							<td>
								<a href="javascript:void(0);" title="" class="updateStore" data-toggle="modal" data-target="#updateModalStore"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a>
								<a href="javascript:void(0);" title="" class="removeStore"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>
							</td>
						</tr>
					`;
					$(".store-table tbody").html(html);
					$(".paginationHide").addClass("hide");
				});
			}else{
				this.error('没有查询的店铺');
			}
		});
	},
	//分类查找类型
	findType(){
		let value=$(".findTypeCondition").val();
		if(!$(".thistype").attr("what"))
		{var key = "_id";
			}else{
				var key = $(".thistype").attr("what");
			}
		var obj={};
		obj.info=value;
		obj.type=key;
		let url ="/api/type/find";
		$.post(url,obj,(data)=>{
			//获取查询后的数据渲染页面
			if(data.res_body.data.length){
				var html="";
				data.res_body.data.forEach((curr,index)=>{
					html+=`<tr>
	 						<td class="id">${curr._id}</td>
							<td>${curr.name}</td>
							<td>
								<a href="javascript:void(0);" title="" class="updateType" data-toggle="modal" data-target="#updateModalType"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a>
								<a href="javascript:void(0);" title="" class="removeType"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>
							</td>
						</tr>
					`;
					$(".type-table tbody").html(html);
					$(".paginationHide").addClass("hide");
				});
			}else{
				this.error('没有查询的类型');
			}
		});
	},
	//切换内容刷新（选项卡）
	changeContent(e){
		this.handleGetAllStoreAndType();
		var src = e.target;
		src = $(src).parent();
		$(src).addClass("active").siblings().removeClass("active");
		var index=$(src).index();
		this.tab = index;
		if(index==0){
			$(".thistype").attr("what",'_id');
			$(".thistype").html('商品编号'+"<span class='caret'></span>");
			$(".cake_manage").css("display","block").siblings("div").css("display","none");
		} 
		else if(index==1){
			$(".thistype").attr("what",'_id');
			$(".thistype").html('类型编号'+"<span class='caret'></span>");
			$(".type_manage").css("display","block").siblings("div").css("display","none");
		} 
		else if(index==2){
			$(".thistype").attr("what",'_id');
			$(".thistype").html('店铺编号'+"<span class='caret'></span>");
			$(".store_manage").css("display","block").siblings("div").css("display","none");
		} 
		else if(index==3) $(".message_manage").css("display","block").siblings("div").css("display","none");
		else if(index==4) $(".person_manage").css("display","block").siblings("div").css("display","none");
		else $(".pwd_manage").css("display","block").siblings("div").css("display","none");
		this.loadByPage(1);
		this.loadPage();
	},
	//修改管理员信息
	updateManager(){
		$("#updateManagerModal").modal("hide");
		const data = $(".update-form").serialize()+"&level=1";
		//console.log(data);
		const url="/api/update";
		$.post(url,data,(data)=>{
			//修改成功，查询渲染页面
			// 处理响应数据
			if (data.res_code === 1) { // 修改管理员成功
				this.loadPage();
				this.loadByPage();
				this.success('修改管理员信息成功');
			} else { // 注册失败
				this.error('修改管理员信息成功失败');
			}
		});
	}
});

new Cake();
