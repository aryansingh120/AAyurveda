const cloudinary=require("../config/cloudinaryConfig")
const videoSchema=require("../Models/videoModel")

const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No video uploaded" });
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: "video", folder: "videos" }, 
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    const savedVideo = await videoSchema.create({
      url: result.secure_url,
      public_id: result.public_id,
    });

    res.status(201).json({
      message: "Video uploaded successfully",
      video: savedVideo,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const allVideos=async(req,res)=>{
  try {
    const allvideos=await videoSchema.find({});
    if(!allVideos)
      return res.status(400).json("videos not found");

    return res.status(200).json({Message:"all videos are here",videos:allvideos})
    
  } catch (error) {
    return res.status(500).json({Message:"internal error",error:error.message})
    
  }
}
module.exports = { uploadVideo,allVideos };
