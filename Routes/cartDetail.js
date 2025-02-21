const express=require("express");
const router=express.Router();
const {cartDetails,allCart}=require("../controllers/cartDetails");
const verifyToken=require("../middlewares/verifyToken")


router.post("/cartadd",verifyToken,cartDetails);
router.get("/allCart",allCart)

module.exports=router

