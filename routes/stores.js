var express = require('express');
var router = express.Router();
var StoreService=require("../services/store_service.js");
var path=require("path");
var multer=require("multer");


//发布店铺
router.post("/publish",StoreService.publish);
//按页查找店铺
router.post("/findbypage",StoreService.findByPage);
//查找总页数
router.post("/findpage",StoreService.findPage);
//删除店铺
router.post("/delete",StoreService.remove);
//修改店铺
router.post("/update",StoreService.update);
//按条件查找店铺
router.post("/find",StoreService.find);


module.exports = router;
