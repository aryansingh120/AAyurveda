const express=require("express");
const upload=require("../middlewares/multer");
const router=express.Router();
const {productData,skincarePoducts,nutritionProducts,showPoducts}=require("../controllers/productData");


router.post("/addData",upload.single("image"),productData);
router.get("/skincareProducts",skincarePoducts);
router.get("/nutritionProducts",nutritionProducts)
router.get("/allProducts",showPoducts)



module.exports=router;
