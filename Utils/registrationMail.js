const nodemailer = require("nodemailer");
require("dotenv").config();
const crypto=require("crypto");
const otpGenerator=()=>crypto.randomInt(1000,9909);
const storeOtp=otpGenerator();


// ✅ Email transporter setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ✅ Email Send Function
const registerMail = async (email) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject:"Your OTP for Signup",
        text:`Thank you for signing up on our website! Your OTP for account verification is: ${storeOtp}. Please use this OTP to complete your registration process.\n If you have any questions or need assistance, feel free to reach out to us. `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { registerMail,storeOtp};
