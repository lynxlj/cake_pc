const {User,Manager} = require("./model.js");

const IdDao = {
	save(info,level){
		info.reg_time = new Date();
		if(level==0){//判断是否为普通用户注册
			info.cake = [];
			return new User(info).save();
		}else{//管理员账号注册
			return new Manager(info).save();//存入集合操作
		}	
	},
	login(condition,level){
		if(level==0){//判断是否为普通用户登录
			return User.find(condition);
		}else{//管理员账号注册
			return Manager.find(condition);//存入集合操作
		}
	},
	update(condition,info,level){
		if(info.cart){
			info.cart = JSON.parse(info.cart);
			if(info.cart.length===0){
				return User.update(condition,{cart:[]});
			}
			else{
				return User.update(condition,{cart:info.cart});
			}
			// const index = info.cake.length-1;
			// if(!info.cake[index].borrow_time)
			// info.cake[index].borrow_time = new Date();
		}
		if(info.cake){
			info.cake = JSON.parse(info.cake);
			if(info.cake.length===0){
				return User.update(condition,{cake:[]});
			}
			else{
				return User.update(condition,{cake:info.cake});
			}
			// const index = info.cake.length-1;
			// if(!info.cake[index].borrow_time)
			// info.cake[index].borrow_time = new Date();
		}
		if(info.true_name){
			if(level==0){
				return User.update(condition,{password:info.password});
			}else{
				return Manager.update(condition,{password:info.password});
			}
		}
		if(level==0){//判断是否为普通用户更新
			return User.update(condition,info);
		}else{//管理员账号注册
			return Manager.update(condition,info);//存入集合操作
		}
	},
	find(condition,level){
		if(level==0){//判断是否为普通用户注册
			if(condition.name ==="kry"){
				return User.find();
			}else{
				return User.find(condition);
			}
		}else{//管理员账号注册
			return Manager.find(condition);//存入集合操作
		}
	},
	logout(){

	},
	findpage(page){
		const pageCount = 3;
		return User.find().skip((page-1)*pageCount).limit(pageCount);
	},
	findAll(){
		return Manager.find();
	},
};

module.exports = IdDao;