const CartDetail = require("../Models/cartModel");
const productData =require("../Models/productData")
const userDetails=require("../Models/userModel");
const Order=require("../Models/orderModel")
const cartDetails = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = req.user; // Middleware se user ka data aa raha hai

    if (!productId || !quantity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🛒 Product ko DB se fetch karna padega taaki uska price mile
    const product = await productData.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingCartItem = await CartDetail.findOne({ productId, userId: user?.userId });

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      existingCartItem.totalPrice = existingCartItem.quantity * product.discountedPrice; // ✅ Total price update
      await existingCartItem.save();
      return res.status(200).json({ message: "Cart updated successfully", result: existingCartItem });
    }

    // 🆕 Naya cart item agar exist nahi karta
    const cartOrder = {
      productId,
      userId: user?.userId,
      quantity,
      totalPrice: quantity * product.discountedPrice, // ✅ Total price calculate kar diya
    };

    const result = await CartDetail.create(cartOrder);

    return res.status(200).json({ message: "Cart added successfully", result });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server error", error: error.message });
  }
};


const allCart = async (req, res) => {
  try {
      const userId = req.user.userId;  
      
      const allCartItems = await CartDetail.find({ userId }).populate("productId"); 

      if (!allCartItems.length) {
          return res.status(404).json({ message: "No items found in your cart" });
      }

      return res.status(200).json({ message: "Cart items fetched successfully",totalProducts:allCartItems.length, allCarts: allCartItems });

  } catch (error) {
      return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const deleteCart=async(req,res)=>{
  try {
         const {productId}=req.body
         if(!productId)
          return res.status(400).json({message:"product id not received"})
        const result=await CartDetail.findOneAndDelete({productId:productId})
        if(!result)
          return res.status(400).json({message:"Id not found and Item not deleted"})

        return res.status(200).send({message:"item deleted successfully",result:result})
  } catch (error) {
    return res.status(500).json({message:"Internal error",error:error.message})
  }

}

const updateCartQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid productId or quantity" });
    }

    const cartItem = await CartDetail.findOne({ "productId": productId });
     const product=await productData.findById(productId)
     
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    
    cartItem.quantity = quantity;
    cartItem.totalPrice=quantity*product.discountedPrice
    await cartItem.save();

    return res.status(200).json({ 
      message: "Cart quantity updated successfully", 
      updatedCart: cartItem 
    });
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const paras = async (req, res) => {
  try {
    const { productId,paymentMethod } = req.body;
    

    // Check if productId is provided
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Find the cart item that contains the given productId
    const cartData = await CartDetail.findOne({ productId });
    const userId=cartData.userId
    const user = await userDetails.findOne({ _id: userId });
    const product=await productData.findOne({_id:productId})
    if (!cartData) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

const mohit={
  user:{
    _id:user._id,
       fullName:user.fullName,
       email:user.email
  },
  products:[{
    productId:productId,
    quantity:cartData.quantity,
    price:product.price

  }],
  totalAmount:cartData.totalPrice,
  shippingAddress:"Kishanpura",
  paymentMethod

}
  const result=await Order.create(mohit)

    console.log("Cart Data =>", result);
    
    return res.status(200).json({ message: "Data received", cartData });
  } catch (error) {
    console.error("Error fetching cart data:", error);
    res.status(500).json({ message: "Internal server error" });
  }

}


module.exports = {cartDetails,allCart,deleteCart,updateCartQuantity,paras};
