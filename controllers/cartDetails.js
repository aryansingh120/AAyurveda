const CartDetail = require("../Models/cartModel");

const cartDetails = async (req, res) => {
  try {
    const { productId,quantity } = req.body;
    const user = req.user //middleware se aaya h

    if (!productId || !quantity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingCartItem = await CartDetail.findOne({ productId, userId :user?.userId });
    if(existingCartItem)
    {
        existingCartItem.quantity += quantity;
        await existingCartItem.save();
        return res.status(200).json({ message: "Cart updated successfully", result: existingCartItem });
    }


    const cartOrder = { productId, userId :user?.userId };

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

module.exports = {cartDetails,allCart,deleteCart};
