商品管理系统
一、登录界面
用户/管理员
账号：
密码：

二、用户界面
-商品详情（
-用户信息（个人账号信息 可修改部分信息 ）
-密码修改

三、管理员界面
-商品管理（可修改商品信息）
-店铺管理（可修改商品信息）
-订单管理（可修改商品信息）
-用户管理（管理各个用户账号 可添加管理员）
-密码修改

==========================================================


数据库设计（cakeSystem）
管理员表（manager）
-name 主键
-password
-sex
-age
-tel
-reg_time

用户表(user)
-name 主键
-password
-sex
-age
-tel
-cake [{id,cakename,cakenum,order_time,state}]
_cart [{id,cakename,cakeprice,cakenum}]
-reg_time

商品表（cake）
-_id  主键(NO.xxxx)
-cake_name
-type
-price
-cover
-comment

店铺表（store）
-_id  主键(NO.xxxx)
-name
-address
-tel

==========================================================

用户接口：

注册：
	接口：/api/register
	请求方式：POST
	请求参数：
		-level
		-user_name / -manager_name
		-password
		-sex
		-age
		-tel

	返回JSON：
		{
			"res_code" : 1, // 1表示注册成功，否则失败
			"res_error" : "", // 失败时的错误信息
			"res_body" : { // 响应主体
				"data" : {
					"user_name"
					"password"
					"sex"
					"age"
					"tel"
					"reg_time": "" // 注册时间
				}
			}
		}

登录：
	接口：/api/login
	请求方式：POST
	请求参数：
		-level(用户/管理员)
		-user_name / -manager_name
		-password
	返回JSON：
		{
			"res_code" : 1, // 1表示登录成功，否则失败
			"res_error" : "", // 失败时的错误信息
			"res_body" : { // 响应主体
				"data" : {
					"user_name"
					"password"
					"sex"
					"age"
					"tel"
					"reg_time": "" // 注册时间
				}
			}
		}

注销：
	接口：/api/logout
	请求方式：GET
	请求参数：
	返回JSON：
		{
			"res_code" : 1, // 1表示注销成功，否则失败
			"res_error" : "", // 失败时的错误信息
			"res_body" : { // 响应主体
				"status" : true // 注销成功还是失败   true成功
			}
		}


==========================================================

管理员 

商品管理

添加商品：
	接口：/api/cake/publish
	请求方式：POST
	请求参数：
		-_id  主键(NO.0001)
		-cake_name
		-type
		-number
		-price
		-publish
		-cover
	返回JSON：
		{
			"res_code" : 1, // 1表示发布成功，否则失败
			"res_error" : "", // 失败时的错误信息
			"res_body" : { // 响应主体
				"data" : {
					-_id  主键(NO.0001)
					-cake_name
					-type
					-price
					-cover
					-comment
				}
			}
		}

修改商品信息：
	接口：/api/cake/update
	请求方式：POST
	请求参数：
		-_id  主键(NO.0001)
		-cake_name
		-type
		-price
		-publish
	返回JSON：
		{
			"res_code" : 1, // 1表示修改成功，否则失败
			"res_error" : "", // 失败时的错误信息
			"res_body" : { // 响应主体
				"data" : {
					-_id  主键(NO.0001)
					-cake_name
					-type
					-price
					-cover
				}
			}
		}

删除商品：
	接口：/api/cake/delete
	请求方式：GET
	请求参数：
		_id - 待删除商品的主键值 编号
	返回JSON：
		{
			"res_code" : 1, // 1表示修改成功，否则失败
			"res_error" : "", // 失败时的错误信息
			"res_body" : { // 响应主体
				"status" : true // 删除成功/失败
			}
		}

获取总页码数：
	接口：/api/cake/findallpage
		请求方式：GET
		请求参数：
		返回JSON：
			{
				"res_code" : 1, // 1表示查询成功，否则失败
				"res_error" : "", // 失败时的错误信息
				"res_body" : { // 响应主体
					number
				}
			}

按页查询职位：
	接口：/api/cake/findbypage
	请求方式：GET
	请求参数：
		page - 待查询的页码
	返回JSON：
		{
			"res_code" : 1, // 1表示查询成功，否则失败
			"res_error" : "", // 失败时的错误信息
			"res_body" : { // 响应主体
				"data" : [
					{
						-_id  主键(NO.0001)
					-cake_name
					-type
					-price
					-cover
					-comment
					},
					{
						-_id  主键(NO.0002)
					-cake_name
					-type
					-price
					-cover
					-comment
					},...
				]
			}
		}

