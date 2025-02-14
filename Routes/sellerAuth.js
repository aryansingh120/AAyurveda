const express=require("express");
const { signup,verifyOtp,login,updateSeller,removeSeller } = require("../controllers/seller");
const router=express.Router();


router.post("/signup",signup);
router.post("/verifyOtp",verifyOtp);
router.post("/login",login);
router.patch("/update/:id",updateSeller);
router.delete("/remove/:id",removeSeller);



   module.exports=router