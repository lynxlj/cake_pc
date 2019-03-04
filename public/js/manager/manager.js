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
	},
	addListener(){
		//点击翻页处理
		$(".pagination").on("click",".page",this.loadByPageHandler.bind(this));
		//添加商品
		$(".btn-add-cake").on("click",this.addCakeHandler.bind(this));
		//添加店铺
		$(".btn-add-store").on("click",this.addStoreHandler.bind(this));
		//页面后退
		$(".pagination").on("click",".previous",this.loadByPrevious.bind(this));
		//页面前进
		$(".pagination").on("click",".next",this.loadByNext.bind(this));
		//删除商品
		$("tbody").on("click",".removeCake",function(e){
			if(confirm("确认删除吗?")){
				this.removeCakeHandler(e.target);
			}
		}.bind(this));
		//删除店铺
		$("tbody").on("click",".removeStore",function(e){
			if(confirm("确认删除吗?")){
				this.removeStoreHandler(e.target);
			}
		}.bind(this));
		//点击修改获取当前商品信息
		$("tbody").on("click",".updateCake",this.nowId);
		//点击修改获取当前商品信息
		$("tbody").on("click",".updateStore",this.nowStoreId);
		//修改商品
		$(".btn-update-cake").on("click",this.updateCakeHandler.bind(this));
		//修改店铺
		$(".btn-update-store").on("click",this.updateStoreHandler.bind(this));
		//搜索类型
		$(".chooseType").on("click","a",this.chooseType);
		//商品搜索
		$(".find").on("click",this.findCake.bind(this));
		//店铺搜索
		$(".findStore").on("click",this.findStore.bind(this));
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
		$("#addmanagerModal").modal("hide");
		const data = $(".add-manager-form").serialize()+"&level=1";
		//console.log(data);
		const url="/api/register";
		$.post(url,data,(data)=>{
			//console.log(data);
			// 处理响应数据
			if (data.res_code === 1) { // 注册管理员成功
				this.success('注册管理员成功');
			} else { // 注册失败
				this.error('注册管理员失败');
			}
		});
	},
	//修改订单状态
	changeState(e){
		const src = e.target;
		const name = $(src).parent().siblings(".username").html();
		const orderId = $(src).parent().siblings(".id").html();
		let state = $(src).parent().siblings(".state").html();
		if(state == '已完成'){
			return;
		}
		state = '已完成';
		$(src).parent().siblings(".state").html('已完成')
		console.log('change',state);
		$.post("/api/find",{name,level:0},(data)=>{
			console.log(data)
			if(data.res_code ===1){
				console.log('订单',data.res_body.data[0].cake);
				var arr=data.res_body.data[0].cake;
				for(var i=0;i<arr.length;i++){
					if(arr[i].id == orderId){
						arr[i].state = state;
					}
				}
				cake = JSON.stringify(arr);
				$.post("/api/update",{name:name,cake:cake,level:0},(data)=>{
					console.log('修改订单状态',data);
					if(data.res_code === 1){
						this.success('修改状态成功');
					}else{
						this.error('删除状态失败');
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
										<td class='username'>${name}</td>
										<td class='id'>${arr[key].id}</td>
										<td>${arr[key].cakename}</td>
										<td>${arr[key].cakenum}</td>
										<td>${arr[key].order_time}</td>
										<td class='state'>${arr[key].state}</td>
										<td>
											<a href="javascript:void(0);" title="" class="changeState">修改订单状态</a>
										</td>
										<td>
											<a href="javascript:void(0);" title="" class="removeOrder">删除订单</a>
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
					var html="";
					for(var key in arr){
						html+=`<tr>
						<td class='username'>${name}</td>
						<td class='id'>${arr[key].id}</td>
						<td>${arr[key].cakename}</td>
						<td>${arr[key].cakenum}</td>
						<td>${arr[key].order_time}</td>
						<td class='state'>${arr[key].state}</td>
						<td>
							<a href="javascript:void(0);" title="" class="changeState">修改订单状态</a>
						</td>
						<td>
							<a href="javascript:void(0);" title="" class="removeOrder">删除订单</a>
						</td>
						</tr>`;
					}
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
		}else if(this.tab ===2){
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
					html+=`<tr>
	 						<td class="id">${curr._id}</td>
							<td><img src="${curr.cover}" with="60"  height="60"}></td>
							<td>${curr.name}</td>
							<td>${curr.type}</td>
							<td>${curr.price}</td>
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
		}else if(this.tab === 1){
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
		}else if(this.tab===2){
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
		}else if(this.tab===3){
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
		let formData=new FormData($(".add-cake-form")[0]);
		let url ="/api/cake/publish";
		var _this=this;
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
	},
	//添加店铺
	addStoreHandler(){
		console.log('>>>>>')
		let formData=new FormData($(".add-store-form")[0]);
		let url ="/api/store/publish";
		var _this=this;
		console.log('222name',formData.get("name"));
		// $.ajax({
		// 	type:"post",
		// 	url,
		// 	data:formData,
		// 	dataType:"json",
		// 	processData:false,
		// 	contentType:false,
		// 	success(data){
		// 		// 关闭模态框
		// 		$("#addModalStore").modal("hide");
		// 		if(data.res_code===1){
		// 			_this.loadByPage();
		// 			_this.loadPage();
		// 			_this.success('添加店铺成功');
		// 		}else{
		// 			_this.error('添加店铺失败');
		// 		}
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
					_this.success('添加店铺成功');
				}else{
					_this.error('添加店铺失败');
				}
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
		let url ="/api/cake/update";
		var _this=this;
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
		obj.info=value;
		obj.type=key;
		
		//console.log(obj);
		let url ="/api/cake/find";
		$.post(url,obj,(data)=>{
			//console.log(data);
			//获取查询后的数据渲染页面
			if(data.res_body.data.length){
				var html="";
				data.res_body.data.forEach((curr,index)=>{
					html+=`<tr>
	 						<td class="id">${curr._id}</td>
							<td><img src="${curr.cover}" with="60"  height="60"}></td>
							<td>${curr.name}</td>
							<td>${curr.type}</td>
							<td>${curr.price}</td>
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
			}else{
				this.error('没有查询的商品');
			}
		});
	},
	//分类查找店铺
	findStore(){
		let value=$(".findStoreCondition").val();
		if(!$(".thistype").attr("what"))
		{var key = "_id";
			}else{
				var key = $(".thistype").attr("what");
			}
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
				this.error('没有查询的商品');
			}
		});
	},
	//切换内容刷新（选项卡）
	changeContent(e){
		var src = e.target;
		src = $(src).parent();
		$(src).addClass("active").siblings().removeClass("active");
		var index=$(src).index();
		this.tab = index;
		if(index==0) $(".cake_manage").css("display","block").siblings("div").css("display","none");
		else if(index==1) $(".store_manage").css("display","block").siblings("div").css("display","none");
		else if(index==2) $(".message_manage").css("display","block").siblings("div").css("display","none");
		else if(index==3) $(".person_manage").css("display","block").siblings("div").css("display","none");
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
