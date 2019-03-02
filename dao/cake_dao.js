const {Cake}=require("./model.js");

const CakeDao={
	//保存用户信息
	save(cakeInfo){
		return new Cake(cakeInfo).save();
	},
	//按页查找商品
	findByPage(page){
		const pageSize=3;
		return Cake.find().limit(pageSize).skip((page-1)*pageSize);
	},
	//查找总数目
	findPage(){
		return Cake.find().count();
	},
	//删除商品信息
	remove(condition){
		return Cake.remove(condition);
	},
	//修改商品信息
	update(condition,cakeInfo){
		return Cake.update(condition,cakeInfo);
	},
	//查找商品信息
	find(condition){
		return Cake.find(condition);
		//return condition;
	}
}

module.exports=CakeDao;