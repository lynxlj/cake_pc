const {Type}=require("./model.js");

const TypeDao={
	//保存信息
	save(typeInfo){
		return new Type(typeInfo).save();
	},
	//按页查找类型
	findByPage(page){
		const pageSize=5;
		return Type.find().limit(pageSize).skip((page-1)*pageSize);
	},
	//查找所以类型
	findAll(page){
		return Type.find();
	},
	//查找总数目
	findPage(){
		return Type.find().count();
	},
	//删除类型信息
	remove(condition){
		return Type.remove(condition);
	},
	//修改类型信息
	update(condition,typeInfo){
		return Type.update(condition,typeInfo);
	},
	//查找类型信息
	find(condition){
		return Type.find(condition);
		//return condition;
	}
}

module.exports=TypeDao;