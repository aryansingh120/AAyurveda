const express=require("express");
const router=express.Router();
const {payment}=require("../controllers/razorpay")

router.post("/paras",payment);



module.exports=router