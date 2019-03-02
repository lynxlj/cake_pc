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
	reg_time:Date
});

const managerSchema = new mongoose.Schema({
	name:String,
	password:String,
	tel:Number,
	sex:String,
	age:Number,
	reg_time:Date
});

const cakeSchema = new mongoose.Schema({
	_id:String,
	name:String,
	type:String,
	price:Number,
	cover:String,
	comment:Array,
});

const storeSchema = new mongoose.Schema({
	_id:String,
	name:String,
	address:String,
	tel:Number,
});


const User = mongoose.model('user',userSchema);
const Manager = mongoose.model('manager',managerSchema);
const Cake = mongoose.model('cake',cakeSchema);
const Store = mongoose.model('store',storeSchema);

//导出模型

module.exports = {User,Manager,Cake,Store};