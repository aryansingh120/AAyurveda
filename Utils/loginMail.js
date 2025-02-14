const nodemailer=require("nodemailer");
require("dotenv").config();

const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }

});

const loginMail=async(name,email)=>{
       const mailOptions={
        from:process.env.EMAIL_USER,
        to:email,                   // imported email from body
        subject:"Login Successful",
        text:`Hello ${name},\n\nWe are pleased to inform you that your login was successful. Welcome back to our website! If you have any questions or need assistance, feel free to reach out to us.\n\nThank you for being a part of our community.\n\nBest regards,\nAAyurvedic Team`
       }
    

       await transporter.sendMail(mailOptions)
}

module.exports={loginMail}