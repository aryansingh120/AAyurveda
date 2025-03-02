const nodemailer = require("nodemailer");
require("dotenv").config();
const crypto=require("crypto");
const axios=require("axios")
const otpGenerator=()=>crypto.randomInt(1000,9909);
const storeOtp=otpGenerator();

const generateEmailTemplate = (otp) => {
  return `
    <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f3f4f6;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 450px;
            margin: 40px auto;
            background: linear-gradient(135deg, #6e8efb, #a777e3);
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            text-align: center;
            color: #fff;
        }
        .header {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 15px;
        }
        .otp {
            font-size: 30px;
            font-weight: bold;
            color: #333;
            background: #fff;
            display: inline-block;
            padding: 14px 28px;
            margin: 20px 0;
            border-radius: 8px;
            letter-spacing: 4px;
        }
        .message {
            font-size: 16px;
            color: #f0f0f0;
            margin-bottom: 20px;
        }
        .footer {
            font-size: 12px;
            color: #ddd;
            padding-bottom: 25px;
            border-bottom: 1px solid #ddd;
            padding-top: 10px;
        }
        .brand {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 10px;
            font-size: 14px;
            font-weight: bold;
        }
        .brand img {
            width: 20px;
            height: 20px;
            margin-right: 8px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">🔒 Secure OTP Verification</div>
        <p class="message">Please use the OTP below to complete your verification. This OTP is valid for 10 minutes.</p>
        <div class="otp">${otp}</div>
        <p class="message">Never share this OTP with anyone for security reasons.</p>
        <p class="footer">If you did not request this, please ignore this email or contact our support team.</p>
        <div class="brand">
            <p style="font-size: 12px; color: #ddd;">&copy; 2024 Team Aayurveda</p>
        </div>
    </div>
</body>
</html>

  `;
};


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
  try{

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject:"Your OTP for Signup",
        html: generateEmailTemplate(storeOtp)
    };

    await transporter.sendMail(mailOptions);
    
    return { success: true, message: "OTP sent successfully" };
  }catch(error){
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send OTP", error: error.message };
  }
};

module.exports = { registerMail,storeOtp};
