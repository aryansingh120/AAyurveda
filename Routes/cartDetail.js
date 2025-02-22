const express=require("express");
const router=express.Router();
const {cartDetails,allCart,deleteCart}=require("../controllers/cartDetails");
const verifyToken=require("../middlewares/verifyToken")


router.post("/cartadd",verifyToken,cartDetails);
router.get("/allCart",verifyToken,allCart);
router.post("/deleteCart",deleteCart)

module.exports=router

