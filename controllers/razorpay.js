const Order = require("../Models/orderModel");
const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const CartDetail = require("../Models/cartModel");
const productData =require("../Models/productData")
const userDetails=require("../Models/userModel");

const payment = async (req, res) => {
    try {
        const { productId, paymentMethod } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "ProductId is required" });
        }

        // ✅ Cart se product ka detail fetch karo
        const cartData = await CartDetail.findOne({ productId });

        if (!cartData) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        // ✅ User aur Product ka detail fetch karo
        const user = await userDetails.findOne({ _id: cartData.userId });
        const product = await productData.findOne({ _id: productId });

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        if (!product) {
            return res.status(404).json({ message: "Product not found!" });
        }

        // ✅ Razorpay order create karo
        const options = {
            amount: cartData.totalPrice * 100, // Convert to paise
            currency: "INR",
            receipt: `order_rcpt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        // ✅ Order data prepare karo
        const newOrder = new Order({
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email
            },
            products: [{
                productId: productId,
                quantity: cartData.quantity,
                price: product.price
            }],
            totalAmount: cartData.totalPrice,
            shippingAddress: "Kishanpura", // TODO: Actual address fetch karo
            paymentMethod: paymentMethod,
            razorpayOrderId: order.id,
            paymentStatus:"Completed" // Payment abhi pending hai
        });

        // ✅ Order ko Database me save karo
        await newOrder.save();

        return res.status(200).json({
            message: "Payment request generated successfully",
            order,
        });
    } catch (error) {
        console.error("❌ Payment Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};


const verifyPayment = async (req, res) => {
    try {
        // console.log("🛠 Payment Verification Request:", req.body);

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: "Missing payment details!" });
        }

        // ✅ Razorpay signature verify karo
        const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
        const generatedSignature = crypto
            .createHmac("sha256", razorpaySecret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Signature verification failed!" });
        }

        //  console.log("✅ Payment Verified Successfully!");
        return res.status(200).json({ success: true, message: "Payment verified!" });

    } catch (error) {
        // console.error("❌ Payment Verification Error:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error!" });
    }
};

module.exports = { payment, verifyPayment };