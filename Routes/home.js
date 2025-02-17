const express=require("express");
const router=express.Router();
const upload=require("../middlewares/multer");
const { addhomeImg,fetchImg } = require("../controllers/homeImg");

router.post("/addimg",upload.single("image"),addhomeImg)

router.get("/receiveImg",fetchImg)



module.exports=router
