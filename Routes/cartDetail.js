const express=require("express");
const router=express.Router();
const {cartDetails,allCart,deleteCart,updateCartQuantity,paras}=require("../controllers/cartDetails");
const verifyToken=require("../middlewares/verifyToken")


router.post("/cartadd",verifyToken,cartDetails);
router.get("/allCart",verifyToken,allCart);
router.post("/deleteCart",deleteCart)
router.post("/updateQuantity",updateCartQuantity)
router.post("/aman",paras)

module.exports=router

