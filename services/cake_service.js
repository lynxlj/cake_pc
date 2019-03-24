const CakeDao = require("../dao/cake_dao.js");

const CakeService = {
	// 发布商品信息
	publish(req, res, next) {
		// 获取请求中传递的数据
		console.log("蛋糕",req.body)
		const {_id,name,type,price,comment,store} = req.body;
		let cover = "/images/upload/" + req.file.filename; // 获取上传文件Cover路径
		console.log('>>>',{_id,name,type,price,comment,cover,store})
		//return;
		// 保存到数据库中
		CakeDao.save({_id,name,type,price,comment,cover,store})
							.then((data)=>{
								console.log(data);
								res.json({res_code: 1, res_error: "", res_body: {data}});
							})
							.catch((err)=>{
								res.json({res_code: 0, res_error: err, res_body: {}});
							});
	},
	//按页查找商品
	findByPage(req,res,next){
		const {page}=req.body;
		CakeDao.findByPage(page)
					.then((data)=>{
						res.json({res_code:1,res_error:"",res_body:{data}});
					})
					.catch((err)=>{
						res.json({res_code:1,res_error:err,res_body:{}});
					});
	},
	//查找页数
	findPage(req,res,next){
		CakeDao.findPage()
					.then((data)=>{
						data=Math.ceil(data/3);
						res.json({res_code:1,res_error:"",res_body:{data}});
					})
					.catch((err)=>{
						res.json({res_code:1,res_error:err,res_body:{}});
					});
	},
	//删除商品
	remove(req,res,next){
		const {_id}=req.body;
		CakeDao.remove({_id})
				.then((data)=>{
					res.json({res_code:1,res_error:"",res_body:{data}});
				})
				.catch((err)=>{
					res.json({res_code:0,res_error:err,res_body:{}});
				});
	},
	//修改商品信息
	update(req,res,next){
		console.log('1122',req.body)
		const {_id,name,type,price,comment,store} = req.body;
		var obj={_id,name,type,price,comment,store};
		for(var key in obj){
			if(!obj[key]) delete obj[key];
		}
		if(req.file){
			let cover="/images/upload/"+req.file.filename;
			obj.cover=cover;
		}
		console.log('修改商品信息',obj);
		CakeDao.update({_id},obj)
				.then((data)=>{
					res.json({res_code:1,res_error:"",res_body:{data}});
				})
				.catch((err)=>{
					res.json({res_code:0,res_error:err,res_body:{}});
				});
	},
	// 按条件查找商品
	find(req, res, next) {
		//console.log(req.body.info);
		var {_id}=req.body;
		if(_id){
			var obj={_id};
		}else{
			// 获取查询的页码
			const {type,info} = req.body;
			// 查询条件 模糊查询
			var obj={}
			//console.log(info);
			obj[type]=new RegExp(info,"i");
			//console.log(query);
			
		}
		//console.log(obj);
		CakeDao.find(obj)
					.then((data)=>{
						console.log(data);
						res.json({res_code:1, res_error:"", res_body:{data}});
					})
					.catch((err)=>{
						res.json({res_code:1, res_error:err, res_body:{}});
					});
		}
	}

module.exports = CakeService;