const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "productData",  
    required: [true, "Product ID is required"]
  },
  userId: {  
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: [true, "User ID is required"]
  },
  quantity: {
    type: Number,
    default: 1, 
    min: [1, "Quantity cannot be less than 1"]
  },
  createdAt: {
    type: Date,
    default: Date.now 
  }
});

module.exports = mongoose.model("CartDetail", cartSchema);
