const CartDetail = require("../Models/cartModel");

const cartDetails = async (req, res) => {
  try {
    const { productId,quantity } = req.body;
    const user = req.user //middleware se aaya h

    if (!productId) {
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
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

const allCart=async(req,res)=>{
    try{
        const allCart=await CartDetail.find({});
        if(!allCart.length)
            return res.status(400).json({message:"cartItems not found"})

        return res.status(200).json({message:"all items are here",allCarts:allCart})

    }catch(error){
        return res.status(500).json({message:"internal error",error:error.message})
    }

}

module.exports = {cartDetails,allCart};
