const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "userDetails", required: true },
  fullName: String,
  mobile: String,
  street: String,
  city: String,
  state: String,
  pincode: String,
  landmark: String,
  addressType: { type: String, enum: ["home", "office", "other"], default: "home" },
});

module.exports = mongoose.model("Address", addressSchema);
