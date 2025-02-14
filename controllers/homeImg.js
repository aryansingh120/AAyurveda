const cloudinary = require("../config/cloudinaryConfig");
const homeSchema=require("../Models/homeImage")

const addhomeImg = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }


    const uploadImage = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "homeImg" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    const addedImg = await homeSchema.create({
      homeImg: {
        url: uploadImage.secure_url,
        public_id: uploadImage.public_id,
      },
    });

    return res.status(201).json({message: "Image added successfully"
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports = { addhomeImg };
