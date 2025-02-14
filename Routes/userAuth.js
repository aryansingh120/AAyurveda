const express=require("express");
const { signup,verifyOtp,login,updateUser,removeUser } = require("../controllers/user");
const router=express.Router();


router.post("/signup",signup);
router.post("/verifyOtp",verifyOtp);
router.post("/login",login)
router.patch("/update/:id",updateUser)
router.delete("/remove/:id",removeUser)


   module.exports=router