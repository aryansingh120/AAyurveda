const Order = require("../Models/orderModel");
const razorpay = require("../config/razorpay");
const crypto = require("crypto");

const payment = async (req, res) => {
    try {
        const { amount, currency } = req.body;

        if (!amount) {
            return res.status(400).json({ message: "Amount is required" });
        }

        const options = {
            amount: Number(amount) * 100, // Ensure it's a number
            currency: currency || "INR",
            receipt: `order_rcpt_${Date.now()}`, // Unique & reliable receipt
        };

        const order = await razorpay.orders.create(options); // ✅ Corrected

        return res.status(200).json({
            message: "Payment request generated successfully",
            order,
        });
    } catch (error) {
        console.error("Payment Error:", error);
        return res.status(500).json({
            message: "Internal error",
            error: error.message,
        });
    }
};


const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, products, totalAmount, shippingAddress } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: "Invalid payment data" });
        }

        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generated_signature === razorpay_signature) {
            // ✅ Payment successful, Save order details in DB
            const newOrder = new Order({
                userId,
                products,
                totalAmount,
                orderStatus: "Pending",
                paymentStatus: "Completed",
                shippingAddress,
                razorpayOrderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
            });

            await newOrder.save();

            return res.status(200).json({ message: "Payment verified & order placed successfully", success: true });
        } else {
            return res.status(400).json({ message: "Payment verification failed", success: false });
        }
    } catch (error) {
        console.error("Payment Verification Error:", error);
        return res.status(500).json({ message: "Internal error", error: error.message });
    }
};

module.exports = { payment, verifyPayment };


