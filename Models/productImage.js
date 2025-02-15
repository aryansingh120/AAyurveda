const mongoose = require("mongoose");

const ProductImgSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, "Image URL is required"],
    },
    public_id: {
      type: String,
      required: [true, "Public ID  required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductImage", ProductImgSchema);
