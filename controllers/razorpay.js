const Order = require("../Models/orderModel");
const razorpay = require("../config/razorpay");

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

module.exports = { payment };
