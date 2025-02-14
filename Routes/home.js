const express=require("express");
const router=express.Router();
const upload=require("../middlewares/multer");
const { addhomeImg } = require("../controllers/homeImg");

router.post("/addimg",upload.single("image"),addhomeImg)

module.exports=router
