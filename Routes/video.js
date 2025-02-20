const express=require("express");
const router=express.Router();
const {uploadVideo,allVideos}=require("../controllers/videos");
const upload=require("../middlewares/multer");


router.post("/addVideo",upload.single("video"),uploadVideo);
router.get("/allVideos",allVideos)

module.exports=router