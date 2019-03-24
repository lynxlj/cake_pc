const IdDao = require("../dao/id_dao.js");
const bcrypt = require('bcrypt');

const IdService = {
	register(req,res,next){
		var {name,password,age,sex,tel,level,true_name} = req.body;
		const hash = bcrypt.hashSync(password, 10);
		IdDao.save({name,password:hash,tel,sex,age,true_name},level)
		.then((data)=>{
			// 将用户信息保存到 session 中
			//req.session.loginUser = data;
			res.json({res_code:1,res_error:"",res_body:{data:{name:data.name,true_name:data.true_name,age:data.age,sex:data.sex,tel:data.tel,cake:data.cake,reg_time:data.reg_time}}});
		})
		.catch((err)=>{
			res.json({res_code: 0, res_error: err, res_body: {}});
		});
	},
	login(req,res,next){
		var {name,password,level} = req.body;
		console.log('===',req.body)
		IdDao.login({name},level)
		.then((data)=>{
			if(data.length!=0){
				const user = data[0];
				console.log('>>>',data)
				if(bcrypt.compareSync(password, user.password)){
				// 将用户信息保存到 session 中
				//req.session.loginUser = data;
				res.json({res_code:1,res_error:"",res_body:{data:{name:user.name,age:user.age,sex:user.sex,tel:user.tel,reg_time:user.reg_time,cake:user.cake,cart:user.cart}}});	
				}else{
					res.json({res_code:0,res_error:"err",res_body:{}});
				}				
			}else{
				res.json({res_code:0,res_error:"err",res_body:{}});
			}
		})
		.catch((err)=>{
			res.json({res_code: 0, res_error: err, res_body: {}});
		});
	},
	update(req,res,next){
		if(req.body.oldPwd){
			var {name,level,oldPwd,newPwd} = req.body;
			IdDao.login({name},level)
			.then((data)=>{
				if(data.length!=0){
					const user = data[0];
					if(bcrypt.compareSync(oldPwd, user.password)){
					// 将用户信息保存到 session 中
					//req.session.loginUser = data;
					const hash = bcrypt.hashSync(newPwd, 10);
					IdDao.update({name},{password:hash},level)
					.then((data)=>{
							res.json({res_code:1,res_error:"",res_body:{data:data}});
						})
						.catch((err)=>{
							res.json({res_code: 0, res_error: err, res_body: {}});
						});
					}else{
						res.json({res_code:0,res_error:"err",res_body:{}});
					}				
				}else{
					res.json({res_code:0,res_error:"err",res_body:{}});
				}
			})
			.catch((err)=>{
				res.json({res_code: 0, res_error: err, res_body: {}});
			});
		}else if(req.body.cart){
			var {name,cart,level} = req.body;
			IdDao.update({name},{cart},level)
			.then((data)=>{
				res.json({res_code:1,res_error:"",res_body:{data:data}});
			})
			.catch((err)=>{
				res.json({res_code: 0, res_error: err, res_body: {}});
			});
		}else if(req.body.cake){
			var {name,cake,level} = req.body;
			IdDao.update({name},{cake},level)
			.then((data)=>{
				res.json({res_code:1,res_error:"",res_body:{data:data}});
			})
			.catch((err)=>{
				res.json({res_code: 0, res_error: err, res_body: {}});
			});
		}else if(req.body.true_name){
			console.log('qqq',req.body)
			var {name,password,level,true_name} = req.body;
			const hash = bcrypt.hashSync(password, 10);
			IdDao.update({name},{password:hash,true_name},level)
			.then((data)=>{
				res.json({res_code:1,res_error:"",res_body:{data:data}});
			})
			.catch((err)=>{
				res.json({res_code: 0, res_error: err, res_body: {}});
			});
		}else{
			var {name,age,sex,tel,level} = req.body;
			IdDao.update({name},{age,sex,tel},level)
			.then((data)=>{
				res.json({res_code:1,res_error:"",res_body:{data:data}});
			})
			.catch((err)=>{
				res.json({res_code: 0, res_error: err, res_body: {}});
			});
		}
	},
	find(req,res,next){
		if(req.body.page){
			const {page} = req.body;
			IdDao.findpage(page)
			.then((data)=>{
				res.json({res_code:1,res_error:"",res_body:data});
			})
			.catch((err)=>{
				res.json({res_code:0,res_error:err,res_body:{}});
			}); 
		}else{
			var {name,level} = req.body;
			/*if(name){
				var name = "kry";
				res.json({name});
			}*/
			IdDao.find({name},level)
			.then((data)=>{
				res.json({res_code:1,res_error:"",res_body:{data:data}});
			})
			.catch((err)=>{
				res.json({res_code: 0, res_error: err, res_body: {}});
			});	
		}	
	},
	logout(req,res,next){
		//req.session.loginUser = null;
		res.json({res_code:1});
	}
}


module.exports = IdService; 