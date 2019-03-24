const {Store}=require("./model.js");

const StoreDao={
	//保存信息
	save(storeInfo){
		return new Store(storeInfo).save();
	},
	//按页查找店铺
	findByPage(page){
		const pageSize=3;
		return Store.find().limit(pageSize).skip((page-1)*pageSize);
	},
	//查找所以店铺
	findAll(page){
		return Store.find();
	},
	//查找总数目
	findPage(){
		return Store.find().count();
	},
	//删除店铺信息
	remove(condition){
		return Store.remove(condition);
	},
	//修改店铺信息
	update(condition,storeInfo){
		return Store.update(condition,storeInfo);
	},
	//查找店铺信息
	find(condition){
		return Store.find(condition);
		//return condition;
	}
}

module.exports=StoreDao;