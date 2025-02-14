const Order=require("../Models/orderModel");

const createOrder=async(req,res)=>{
    try{
        const { userId, products, shippingAddress } = req.body;

    if (!userId || !products || products.length===0|| !shippingAddress) {
      return res.status(400).json({ error: "All fields are required" });
    }
        let totalPrice=0;
        products.forEach(item => {
            totalPrice+=item.quantity*item.price;
            
        });

        const newOrder={userId,products,totalAmount:totalPrice,shippingAddress,};

        const result=await Order.create(newOrder)
        if(!result)
            return res.status(400).send({Message:"Order not placed"});

        return res.status(200).send({Message:"Order Placed SuccessFully",order:result})

          
      

    }catch(error)
    {
        return res.status(500).send({message:"internal error",error:error.message})
    }

}

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