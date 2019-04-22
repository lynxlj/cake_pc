const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/cakesystem",{ useNewUrlParser: true });

const userSchema = new mongoose.Schema({
	name:String,
	password:String,
	tel:Number,
	sex:String,
	age:Number,
	cake:Array,
	cart:Array,
	reg_time:Date,
	true_name:String
});

const managerSchema = new mongoose.Schema({
	name:String,
	password:String,
	tel:Number,
	sex:String,
	age:Number,
	reg_time:Date,
	true_name:String
});

const cakeSchema = new mongoose.Schema({
	_id:String,
	name:String,
	type:String,
	price:Number,
	cover:String,
	comment:Array,
	store:String,
});

const storeSchema = new mongoose.Schema({
	_id:String,
	name:String,
	address:String,
	tel:Number,
});

const typeSchema = new mongoose.Schema({
	_id:String,
	name:String,
});


const User = mongoose.model('user',userSchema);
const Manager = mongoose.model('manager',managerSchema);
const Cake = mongoose.model('cake',cakeSchema);
const Store = mongoose.model('store',storeSchema);
const Type = mongoose.model('type',typeSchema);

//导出模型

module.exports = {User,Manager,Cake,Store,Type};