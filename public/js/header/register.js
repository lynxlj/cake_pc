function Register(){
	this.creatDom();
	this.addListener()
};

Register.template = `<div class="modal fade" id="RegModal" tabindex="-1" role="dialog">
	  <div class="modal-dialog" role="document">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true" class="close">&times;</span></button>
	        <h4 class="modal-title">用户密码修改</h4>
	      </div>
	      <div class="modal-body">
				 <div class="alert alert-danger hidden register-error">修改失败</div>
				 <div class="alert alert-danger hidden register-texterror">输入错误</div>
				 <div class="alert alert-danger hidden register-dataerror">数据错误</div>
				 <div class="alert alert-success hidden register-success">修改成功</div>
	        <form class="register-form">
			  <div class="form-group">
			    <label for="exampleInputEmail1">用户名</label>
			    <input type="text" class="form-control" name="name" placeholder="输入用户名">
				</div>
				<div class="form-group">
			    <label for="question">你的真实姓名</label>
			    <input type="text" class="form-control" name="truename" placeholder="输入密保答案">
			  </div>
			  <div class="form-group">
			    <label for="exampleInputPassword1">密码</label>
			    <input type="password" class="form-control password" name="password" placeholder="输入密码">
			  </div>
			  <div class="form-group">
			    <label for="exampleInputPassword1">确认密码</label><span class="prompt hidden" style="color:red;">*两次输入密码不一致</span>
			    <input type="password" class="form-control repassword" name="repassword" placeholder="再次输入密码">
			  </div>
			</form>
	      <div class="modal-footer">
	        <button type="button" class="btn btn-primary register-btn">修改</button>
	      </div>
	    </div><!-- /.modal-content -->
	  </div><!-- /.modal-dialog -->
	</div><!-- /.modal -->`;

$.extend(Register.prototype,{
	flag:[false,false],
	creatDom(){
		$(Register.template).appendTo("body");
	},
	//载入验证码
	load(){
		// $.getJSON("/api/captcha",(data)=>{
		// 	$(".captcha2").html(data.res_body.data);
		// });
	},
	//添加监听
	addListener(){
		//第二次输入密码是否一致
		$(".repassword").on("blur",this.check.bind(this));
		//注册按钮点击
		$(".register-btn").on("click",this.regHandler);
		$(".register").on("click",this.load);
	},
	check(e){
		const password = $(".password").val();
		const repassword = $(e.target).val();
		if(password!=repassword){
			$(".prompt").removeClass("hidden");
			//$(".register-btn").attr("disabled","disabled");
			this.flag[1]=false;
		}else{
				$(".prompt").addClass("hidden");
				this.flag[1]=true;
				//$(".register-btn").removeAttr("disabled");
		}
		//console.log(this.flag);
		// if(this.flag.every((value)=>{return value}))
		// $(".register-btn").removeAttr("disabled");
		// else
		// $(".register-btn").attr("disabled","disabled");
	},
	regHandler(){
		var form=document.querySelector(".register-form");
		var formdata=new FormData(form);
		let name = formdata.get("name");
		let truename = formdata.get("truename");
		let password = formdata.get("password");
		let repassword = formdata.get("repassword");
		console.log(name,truename,password,repassword);
		if(!truename || !name || !password || !repassword || password != repassword){
			$(".register-texterror").removeClass("hidden");
			setTimeout(()=>{
				$(".register-texterror").addClass("hidden");
			},1000)
		}
		$.post('/api/find',{name:name,level:1},(data)=>{
			console.log(data)
			// 处理响应数据
			if (data.res_code == 1) { 
				console.log(data.res_body.data.length)
				if(data.res_body.data.length == 0 ){
					$(".register-texterror").removeClass("hidden");
					setTimeout(()=>{
						$(".register-texterror").addClass("hidden");
					},1000)
				}else{
					let true_name = data.res_body.data[0].true_name;
					console.log(true_name == truename)
					if(true_name == truename){
						$.post('/api/update',{name,password,level:1,true_name:truename},(data)=>{
							console.log(data)
							// 处理响应数据
							if (data.res_code === 1) { //修改成功
								$(".register-success").removeClass("hidden");
								setTimeout(()=>{
									$(".register-success").addClass("hidden");
									window.location.reload();
								},1000)
								
							} else { // 修改失败
								$(".register-error").removeClass("hidden");
								setTimeout(()=>{
									$(".register-error").addClass("hidden");
								},1000)
							}
						});
					}else{
						$(".register-dataerror").removeClass("hidden");
						setTimeout(()=>{
							$(".register-dataerror").addClass("hidden");
						},1000)
					}
				}
			} else { 
				$(".register-error").removeClass("hidden");
				setTimeout(()=>{
					$(".register-error").addClass("hidden");
				},1000)
			}
		});
		// $.post(url,data,(data)=>{
		// 	//console.log(data);
		// 	// 处理响应数据
		// 	if (data.res_code === 1) { // 注册成功，即登录成功
		// 		// 将注册成功的用户信息保存到 sessionStorage 中
		// 		sessionStorage.loginUser = JSON.stringify(data.res_body.data);
		// 		// 刷新页面
		// 		window.location.href = "/html/user/user.html";
		// 	} else { // 注册失败
		// 		$(".register-error").removeClass("hidden");
		// 	}
		// });
	}
});
