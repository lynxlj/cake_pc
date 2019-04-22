const TypeDao = require("../dao/type_dao.js");

const TypeService = {
	// 发布店铺信息
	publish(req, res, next) {
		console.log('publishType',req)
		// 获取请求中传递的数据
		const {_id,name} = req.body;
		// 保存到数据库中
		TypeDao.save({_id,name})
							.then((data)=>{
								console.log(data);
								res.json({res_code: 1, res_error: "", res_body: {data}});
							})
							.catch((err)=>{
								res.json({res_code: 0, res_error: err, res_body: {}});
							});
	},
	//按页查找店铺
	findByPage(req,res,next){
		const {page}=req.body;
		TypeDao.findByPage(page)
					.then((data)=>{
						res.json({res_code:1,res_error:"",res_body:{data}});
					})
					.catch((err)=>{
						res.json({res_code:1,res_error:err,res_body:{}});
					});
	},
	//查找所有店铺
	findAll(req,res,next){
		TypeDao.findAll()
					.then((data)=>{
						res.json({res_code:1,res_error:"",res_body:{data}});
					})
					.catch((err)=>{
						res.json({res_code:1,res_error:err,res_body:{}});
					});
	},
	//查找页数
	findPage(req,res,next){
		TypeDao.findPage()
					.then((data)=>{
						data=Math.ceil(data/5);
						res.json({res_code:1,res_error:"",res_body:{data}});
					})
					.catch((err)=>{
						res.json({res_code:1,res_error:err,res_body:{}});
					});
	},
	//删除店铺
	remove(req,res,next){
		const {_id}=req.body;
		TypeDao.remove({_id})
				.then((data)=>{
					res.json({res_code:1,res_error:"",res_body:{data}});
				})
				.catch((err)=>{
					res.json({res_code:0,res_error:err,res_body:{}});
				});
	},
	//修改店铺信息
	update(req,res,next){
		const {_id,name} = req.body;
		var obj={_id,name};
		for(var key in obj){
			if(!obj[key]) delete obj[key];
		}
		console.log('updateType',obj);
		TypeDao.update({_id},obj)
				.then((data)=>{
					res.json({res_code:1,res_error:"",res_body:{data}});
				})
				.catch((err)=>{
					res.json({res_code:0,res_error:err,res_body:{}});
				});
	},
	// 按条件查找店铺
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
		TypeDao.find(obj)
					.then((data)=>{
						console.log(data);
						res.json({res_code:1, res_error:"", res_body:{data}});
					})
					.catch((err)=>{
						res.json({res_code:1, res_error:err, res_body:{}});
					});
		}
	}

module.exports = TypeService;