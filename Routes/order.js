const express=require("express");
const router=express.Router();
const {createOrder,cancelOrder,updateOrder}=require("../controllers/order");

router.post("/addOrder",createOrder);
router.post("/cancelOrder/:id",cancelOrder);
router.patch("/updateOrder/:id",updateOrder);



module.exports=router