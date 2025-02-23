const express=require("express");
const router=express.Router();
const {payment,verifyPayment}=require("../controllers/razorpay")

router.post("/generatePayment",payment);
router.post ("/verifyPayment",verifyPayment)



module.exports=router