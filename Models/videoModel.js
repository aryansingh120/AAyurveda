const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, "video URL is required"],
    },
    public_id: {
      type: String,
      required: [true, "Public ID  required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HomeVideo", videoSchema);
