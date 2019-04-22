var express = require('express');
var router = express.Router();
var TypeService=require("../services/type_service.js");
var path=require("path");
var multer=require("multer");


//发布类型
router.post("/publish",TypeService.publish);
//按页查找类型
router.post("/findbypage",TypeService.findByPage);
//查找总页数
router.post("/findpage",TypeService.findPage);
//删除类型
router.post("/delete",TypeService.remove);
//修改类型
router.post("/update",TypeService.update);
//按条件查找类型
router.post("/find",TypeService.find);
//查找所有类型
router.post("/findAll",TypeService.findAll);


module.exports = router;
