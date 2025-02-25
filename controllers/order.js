const Order = require("../Models/orderModel");
const UserDetails = require("../Models/userModel"); 

const createOrder = async (req, res) => {
    try {
        const { userId, products, shippingAddress, paymentMethod } = req.body;

        if (!userId || !products || products.length === 0 || !shippingAddress || !paymentMethod) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // ✅ User Details Fetch Karo
        const user = await UserDetails.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        let totalPrice = 0;
        products.forEach(item => {
            totalPrice += item.quantity * item.price;
        });

        // ✅ User Details ke saath Order Create Karo
        const newOrder = await Order.create({
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email
            },
            products,
            totalAmount: totalPrice,
            shippingAddress,
            paymentMethod,
            paymentStatus: paymentMethod === "COD" ? "Pending" : "Completed",
            orderStatus: "Pending",
            razorpayOrderId: paymentMethod === "COD" ? null : req.body.razorpayOrderId || null,
            paymentId: paymentMethod === "COD" ? null : req.body.paymentId || null
        });

        return res.status(200).json({ message: "Order Placed Successfully", order: newOrder });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = { createOrder };



const cancelOrder=async(req,res)=>{
    try {
        const {id}=req.params;
        if(!id)
            return res.status(400).send("please provide orderId");
        const findOrder=await Order.findById(id);
        if(!findOrder)
        return res.status(400).send({Message:"order not found"})
         
        if(findOrder.orderStatus!=="Pending")  //starting letter ka dhyan rakhna
            return res.status(400).send({Message:"Order not canceled becouse order is not pending"})

        findOrder.orderStatus="Canceled";  //starting letter ka dhyan rakhna

        await findOrder.save(); //is method me schema use nhi hogi

        return res.status(200).send({Message:"Order canceled successfully"})

        
        
    } catch (error) {
        return res.status(500).send({Message:"Order not canceled due to internal error",error:error})
        
    }
}

const updateOrder =async(req,res)=>{
    try{
        const {id}=req.params;
        const { products, shippingAddress}=req.body
        if(!id)
        return res.status(400).send("please provide orderId");

        const findOrder=await Order.findById(id);
        if(!findOrder)
        return res.status(400).send({Message:"order not found"})

    if(findOrder.orderStatus==="Completed" || findOrder.orderStatus==="Canceled" ||findOrder.orderStatus==="Shipped")
        return res.status(400).send({Message:"order not updated "});

       
    if(shippingAddress) findOrder.shippingAddress=shippingAddress;

    if(products)
    {
        let totalPrice=0;   //ise let hi lena padega kyonki loop me value baar baar change hogi
        products.forEach((item)=>{
            totalPrice+=item.quantity*item.price
        })
        findOrder.products=products;
        findOrder.totalAmount=totalPrice
    }
     
    await findOrder.save();

    return res.status(200).send({Message:"order updated successfully"})




    }catch(error){
        return res.status(500).send({Message:"Order not updated due to internal error",error:error.message})


    }
}

module.exports={createOrder,cancelOrder,updateOrder}