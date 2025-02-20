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

module.exports = { uploadVideo };
