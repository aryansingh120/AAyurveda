const sellerSchema=require("../Models/sellerModel");
const seller2Schema=require("../Models/seller2Model")
const {registerMail,storeOtp}=require("../Utils/registrationMail")
const jwt=require("jsonwebtoken");
require("dotenv").config()

const signup=async(req,res)=>{
    const {fullName,email,password,confirmPassword,contact,address,storeName}=req.body;
    if(!email || !fullName || !password || !confirmPassword || !contact || !address || !storeName)
        return res.status(404).send("all fields are required");

    try {
        if(password!==confirmPassword)
            return res.status(400).send("pass or confirmpass not same")
          const existinguser=await seller2Schema.findOne({email});
          if(existinguser)
            return res.status(400).send("email already exist");

          await seller2Schema.collection.drop();

          const createdUser={fullName,email,password,contact,address,storeName,otp:storeOtp};
          await seller2Schema.create(createdUser);
          await registerMail(email)
    
    return res.status(200).send("otp sent on email")

    } catch (error) {
        return res.status(500).send({message:"internal error",error:error.message})
        
    }
}
// *****************************************************************
const verifyOtp=async(req,res)=>{
    const {otp}=req.body;
    if(!otp)
        return res.status(400).send("otp reqired");
    try {
        const user= await seller2Schema.findOne({otp})
        if(!user)
            return res.status(500).send("invalid otp")
         if(otp!==user.otp)
            return res.status(400).send(receiveOtp)

          
          const user2={
            fullName:user.fullName,
            email:user.email,
            password:user.password,
            contact:user.contact,
            address:user.address,
            storeName:user.storeName
          }
          const result=await sellerSchema.create(user2)
          await seller2Schema.collection.drop();
          const mailOptions={
              from:"aryanhp940@gmail.com",
              to:user.email,                   // imported email from body
              subject:"For Your sellerId",
              text:`Thank you for signing up on our website! Your seller Id is paras ${result._id} .\n If you have any questions or need assistance, feel free to reach out to us. `
          }      
          await transporter.sendMail(mailOptions);
          return res.status(200).send("otp verification successfull");

    } catch (error) {
       return res.status(500).send("internal errror from otp skhgajhd")
        
    }

}


const login=async(req,res)=>{
    const {email,password}=req.body;
    if(!email)
        return res.status(400).send("email is required");
    else if(!password)
        return res.status(400).send("password is required");

    try {
        const user=await sellerSchema.findOne({email})   
       if(!user)
        return res.status(400).send("invalid email");
    else if(user.password!==password)
        return res.status(400).send("invalid password");


    const token = jwt.sign(
        { userId: user._id, email: user.email }, // Payload
        process.env.SECRET_KEY, // Secret Key from .env
        { expiresIn: "1h" } // Token expiry time
    );

    const mailOptions={
        from:"aryanhp940@gmail.com",
        to:email,                   // imported email from body
        subject:"Login Successful",
        text:`Hello ${user.fullName},\n\nWe are pleased to inform you that your login was successful. Welcome back to our website! If you have any questions or need assistance, feel free to reach out to us.\n\nThank you for being a part of our community.\n\nBest regards,\nAAyurvedic Team`
    }
    
    await transporter.sendMail(mailOptions);

    return res.status(200).send({message:"login successfull",token:token})
        
}catch(error){
    return res.status(500).send("login failed due to internal error");


}
}


const updateSeller=async(req,res)=>{
    try{
        const userId=req.params.id;
        const updated=req.body;
        if(!userId)
            return res.status(400).send("enter user Id");

       const updatedUser= await sellerSchema.findByIdAndUpdate(userId,updated,{new:true,runValidators: true});
          if(!updatedUser)
        return res.status(400).send("user not found")

          return res.status(200).send("user updated successfully")


    }catch(error){
        return res.status(500).send("updation failed due to internal error");

    }
}


const removeSeller=async(req,res)=>{
    try {
        const userId=req.params.id;
        if(!userId)
            return res.status(400).send("enter user Id");

        const deletedUser=await sellerSchema.findByIdAndDelete(userId);
        if(!deletedUser)
            return res.status(200).send("user not found");

        return res.status(200).send("user deleted successfully");

  

    } catch(error){
        return res.status(500).send("user not deleted due to internal error");

    }
}


module.exports={signup,verifyOtp,login,updateSeller,removeSeller}






