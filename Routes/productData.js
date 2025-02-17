const express=require("express");
const upload=require("../middlewares/multer");
const router=express.Router();
const {productData}=require("../controllers/productData");


router.post("/addData",upload.single("image"),productData);

module.exports=router;