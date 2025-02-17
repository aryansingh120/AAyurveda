const express=require("express");
const upload=require("../middlewares/multer");
const router=express.Router();
const {productData,allProducts}=require("../controllers/productData");


router.post("/addData",upload.single("image"),productData);
router.get("/fetchProducts",allProducts)

module.exports=router;