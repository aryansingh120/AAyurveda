const express=require("express");
const router=express.Router();
const {uploadVideo}=require("../controllers/videos");
const upload=require("../middlewares/multer");


router.post("/addVideo",upload.single("video"),uploadVideo);

module.exports=router