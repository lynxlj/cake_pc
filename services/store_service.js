const StoreDao = require("../dao/store_dao.js");

const StoreService = {
	// 发布店铺信息
	publish(req, res, next) {
		console.log('publishStore',req)
		// 获取请求中传递的数据
		const {_id,name,address,tel,} = req.body;
		// 保存到数据库中
		StoreDao.save({_id,name,address,tel
		})
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
		StoreDao.findByPage(page)
					.then((data)=>{
						res.json({res_code:1,res_error:"",res_body:{data}});
					})
					.catch((err)=>{
						res.json({res_code:1,res_error:err,res_body:{}});
					});
	},
	//查找所有店铺
	findAll(req,res,next){
		StoreDao.findAll()
					.then((data)=>{
						res.json({res_code:1,res_error:"",res_body:{data}});
					})
					.catch((err)=>{
						res.json({res_code:1,res_error:err,res_body:{}});
					});
	},
	//查找页数
	findPage(req,res,next){
		StoreDao.findPage()
					.then((data)=>{
						data=Math.ceil(data/3);
						res.json({res_code:1,res_error:"",res_body:{data}});
					})
					.catch((err)=>{
						res.json({res_code:1,res_error:err,res_body:{}});
					});
	},
	//删除店铺
	remove(req,res,next){
		const {_id}=req.body;
		StoreDao.remove({_id})
				.then((data)=>{
					res.json({res_code:1,res_error:"",res_body:{data}});
				})
				.catch((err)=>{
					res.json({res_code:0,res_error:err,res_body:{}});
				});
	},
	//修改店铺信息
	update(req,res,next){
		const {_id,name,address,tel} = req.body;
		var obj={_id,name,address,tel};
		for(var key in obj){
			if(!obj[key]) delete obj[key];
		}
		console.log('updateStore',obj);
		StoreDao.update({_id},obj)
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
		StoreDao.find(obj)
					.then((data)=>{
						console.log(data);
						res.json({res_code:1, res_error:"", res_body:{data}});
					})
					.catch((err)=>{
						res.json({res_code:1, res_error:err, res_body:{}});
					});
		}
	}

module.exports = StoreService;