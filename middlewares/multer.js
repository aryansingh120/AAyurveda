const multer = require("multer");

//  Memory Storage (Cloudinary ke liye useful)
const storage = multer.memoryStorage(); 

//  Multer Middleware Setup
const upload = multer({ storage: storage });

module.exports = upload;