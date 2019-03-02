function User(){
	this.loadInfo();
	this.addListener();
	this.init();
};
$.extend(User.prototype,{
	init(){
		//商品信息
		this.loadByPage(1);
		this.loadPage();
	},
	loadInfo(){
			let loginUser = JSON.parse(sessionStorage.loginUser);
			let html=`<tr class="userinfo">
							<td>${loginUser.name}</td>
							<td>${loginUser.sex}</td>
							<td>${loginUser.age}</td>
							<td>${loginUser.tel}</td>
							<td>${loginUser.reg_time}</td>
							<td>
								<a href="javascript:void(0);" title="" class="updatePro" data-toggle="modal" data-target="#updateModal">修改</a>
							</td>
						</tr>`;
			$(".box").eq(1).find("tbody").html(html);
	},
	update(){
		const url="/api/update/";
		data = $(".update-form").serialize() + "&level=0";
		name = $(".update-form input")[0].value;
		$.post(url,data,(data)=>{
			
			if(data.res_code===1){
				this.find({name});
			}else{
				this.error("修改信息失败");
			}
			
		})
	},
	find(condition){
		const url="/api/find";
		condition.level=0;
		$.post(url,condition,(data)=>{
			if (data.res_code === 1) { // 修改成功
				// 将修改成功的用户信息保存到 sessionStorage 中
				sessionStorage.loginUser = JSON.stringify(data.res_body.data[0]);
				// 关闭模态框
				$("#updateModal").modal('hide');
				//刷新页面
				this.loadInfo();
				// 修改成功
				this.success("修改信息成功");
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
	addListener(){
		//选项卡点击
		$(".tab").on("click",this.xxk.bind(this));
		//更新用户信息自动填充
		$(".updatePro").on("click",this.autoInput);
		//更新按钮
		$(".update-btn").on("click",this.update.bind(this));
		//点击翻页处理
		$(".pagination").on("click",".page",this.loadByPageHandler.bind(this));
		//页面后退
		$(".pagination").on("click",".previous",this.loadByPrevious.bind(this));
		//页面前进
		$(".pagination").on("click",".next",this.loadByNext.bind(this));
		//搜索类型
		$(".chooseType").on("click","a",this.chooseType);
		//搜索
		$(".find").on("click",this.findCake.bind(this));
		//重新加载全部商品信息
		$(".reload").on("click",this.init.bind(this));
		//借阅商品相关事件
		$(".cake-table tbody").on("click",".borrow",this.borrowCake.bind(this));
		//修改密码
		$(".password-btn").on("click",this.changePassword.bind(this));
		//还书按钮
		$(".table-borrowCake").on("click",".returnCake",this.returnCake.bind(this));
	},
	returnCake(e){
		const src = e.target,
			 username = JSON.parse(sessionStorage.loginUser).name,
			 cakeid = $(src).parent().siblings(".cakeId").html(),
			 data = {name:username,level:0};
		$.post("/api/find",data,(data)=>{
			if(data.res_code === 1){
				let cake = data.res_body.data[0].cake;
				for(var index in cake){
					if(cake[index].id === cakeid){
						cake.splice(index,1);
						cake = JSON.stringify(cake);
						//console.log(cake);
						$.post("/api/update",{name:username,cake:cake,level:0},(data)=>{
							
						//console.log(data);
							if(data.res_code===1){
								$.post("/api/cake/find",{_id:cakeid},(data)=>{
									//console.log(data);
									var number = ++data.res_body.data[0].number;
									$.post("/api/cake/update",{_id:cakeid,number},(data)=>{
										if(data.res_code===1){
											//归还成功
											this.borrowDtails()
											this.success("归还商品成功");
										}else{
											//还书失败
											this.error("归还商品失败");
										}
									})
								});	
							}else{
								//还书失败
								this.error("归还商品失败");
							}
						});
					}
				}
			}else{
				//还书失败
				this.error("归还商品失败");
			}
		});
	},
	autoInput(){
			let loginUser = JSON.parse(sessionStorage.loginUser);
			//console.log(loginUser);
			$(".update-form").find("input")[0].value = loginUser.name;
			$(".update-form").find("input")[1].value = loginUser.sex;
			$(".update-form").find("input")[2].value = loginUser.age;
			$(".update-form").find("input")[3].value = loginUser.tel;
	},
	xxk(e){
		this.loadPage();
		this.loadByPage();
		const src = $(e.target).parent(); 
		src.addClass("active").siblings().removeClass("active");
		const index = src.index();
		//console.log(index);
		if(index===2) this.borrowDtails();
		$(".box").eq(index).removeClass("hidden").siblings(".panel").addClass("hidden");
	},
	//借书详情列表
	borrowDtails(){
		const name = JSON.parse(sessionStorage.loginUser).name;
		$.post("/api/find",{name,level:0},(data)=>{
			if(data.res_code === 1){
				const cake = data.res_body.data[0].cake;
				let html = '';
				for(var index in cake){
					html+=`<tr>
								<td class="cakeId">${cake[index].id}</td>
								<td>${cake[index].cakename}</td>
								<td>${cake[index].borrow_time}</td>
								<td><a class="returnCake" href="javascript:void">还书</a></td>
							</tr>`;
				}
				$('.table-borrowCake tbody').html(html);
			}
		});
	},
	//修改密码操作
	changePassword(){
		//获取两次输入的密码，判断是否一致
		var newPwd=$("#newPwd").val();
		if($("#againNewPwd").val()===newPwd){
			const name = JSON.parse(sessionStorage.loginUser).name;
			const data = $(".password-form").serialize()+"&level=0&name="+name;
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
			this.error("两次输入密码不一致");
		}
		
	},
	//加载商品页数
	loadPage(){
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
	},
	//按页加载商品信息
	loadByPage(page){
		page=page||1;
		//加载页面
		$.post("/api/cake/findbypage",{page},(data)=>{
			//console.log(data);
			var html="";
			data.res_body.data.forEach((curr,index)=>{
				html+=`<tr>
 						<td class="id">${curr._id}</td>
						<td><img src="${curr.cover}" with="60"  height="60"}></td>
						<td class="cakename">${curr.name}</td>
						<td>${curr.type}</td>
						<td class="number">${curr.number}</td>
						<td>${curr.price}</td>
						<td>${curr.publish}</td>
						<td>
							<a href="javascript:void(0);" title="" class="borrow"><span class="glyphicon glyphicon-heart-empty" aria-hidden="true"></span>借阅</a>
						</td>
					</tr>
				`;
				$(".cake-table tbody").html(html);
				$(".paginationHide").removeClass("hide");
			});

		});
	},
	//商品翻页处理
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
	},
	//页面前进
	loadByNext(){
		var index=Number($(".pagination").children(".active").children("a").html());
		//当前总页数
		maxIndex=this.page;
		index=index<maxIndex?++index:maxIndex;
		this.loadByPage(index);
		$(".pagination").children("li:eq("+index+")").addClass("active").siblings().removeClass("active");
	},
	//当前搜索类型
	chooseType(){
		var aaa=$(this).html();
		var type=$(this).attr("class");
		//console.log(type);
		$(".thistype").attr("what",type);
		$(".thistype").html(aaa+"<span class='caret'></span>");
	},
	//分类查找商品
	findCake(){
		let value=$(".findCondition").val();
		if(!$(".thistype").attr("what")) var key="_id";
		else var key=$(".thistype").attr("what");
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
							<td class="cakename">${curr.name}</td>
							<td>${curr.type}</td>
							<td class="number">${curr.number}</td>
							<td>${curr.price}</td>
							<td>${curr.publish}</td>
							<td>
								<a href="javascript:void(0);" title="" class="borrow"><span class="glyphicon glyphicon-heart-empty" aria-hidden="true"></span>借阅</a>
							</td>
						</tr>
					`;
					$(".cake-table tbody").html(html);
					$(".paginationHide").addClass("hide");
				});
			}else{
				//alert("搜索不存在");
				this.error("搜索不存在");
				
			}
		});
	},
	//借书
	borrowCake(e){
		
		//获取当前商品编码
		const src = e.target;
		var _id=$(src).parent().siblings(".id").html();
		const _this = this;
		var cakename=$(src).parent().siblings(".cakename").html();
		//获取当前商品数量
		var number=$(src).parent().siblings(".number").html();
		//console.log(number);
		//记录修改前的商品
		var lastNum=number;
		//商品数量减少一个
		if(number<1) {
			number=0;
			this.error("该书库存数量不足，请借阅其他商品");
		}
		else number--;
		//将借阅商品存入用户数据库
		const username = JSON.parse(sessionStorage.loginUser).name;
		$.post("/api/find",{name:username,level:0},(data)=>{
			if (data.res_code === 1) {
				var cake = data.res_body.data[0].cake;
				for(var index in cake){
					if(cake[index].id === _id){
						_this.error("已借阅该商品，不可再次借阅！");
							return ;
					}
					
				}
				cake.push({
					id:_id,
					cakename:cakename
				});
				cake = JSON.stringify(cake);
				$.post("/api/update",{name:username,cake:cake,level:0},(data)=>{
					//console.log(data);
					if(data.res_code===1){
						//改变用户的借书信息
						//改变数据库商品数据
						let url ="/api/cake/update";
						$.post(url,{_id,number},function(data){
							if(data.res_code===1){
								$(src).parent().siblings(".number").html(number);
								 sessionStorage.loginUser.cake = JSON.parse(cake);
								// console.log(cake);
								 _this.success("借阅商品成功");
							}else{
								_this.error("借阅商品失败");
							}
						});
					}else{
						_this.error("借阅商品失败");
					}
				});
			}
		});
	}
});

new User;