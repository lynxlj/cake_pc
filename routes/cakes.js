var express = require('express');
var router = express.Router();
var CakeService=require("../services/cake_service.js");
var path=require("path");
var multer=require("multer");

//配置磁盘存储
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname,"../public/images/upload"));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + file.originalname.slice(file.originalname.lastIndexOf(".")));
  }
})
 
var upload = multer({ storage: storage })

//发布商品
router.post("/publish",upload.single("cover"),CakeService.publish);
//按页查找商品
router.post("/findbypage",CakeService.findByPage);
//查找总页数
router.post("/findpage",CakeService.findPage);
//删除职位
router.post("/delete",CakeService.remove);
//修改职位
router.post("/update",upload.single("cover"),CakeService.update);
//按条件查找商品
router.post("/find",CakeService.find);
//查找所以
router.post("/findAll",CakeService.findAll);


module.exports = router;
