const express=require("express");
const router=express.Router();
const {cartDetails,allCart}=require("../controllers/cartDetails");

router.post("/cartadd",cartDetails);
router.get("/allCart",allCart)

module.exports=router

