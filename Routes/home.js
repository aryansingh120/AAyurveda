const express=require("express");
const router=express.Router();
const upload=require("../middlewares/multer");
const { addhomeImg,fetchImg ,addProductImg} = require("../controllers/homeImg");

router.post("/addimg",upload.single("image"),addhomeImg)
router.post("/productImg",upload.single("image"),addProductImg)

router.get("/receiveImg",fetchImg)


module.exports=router
