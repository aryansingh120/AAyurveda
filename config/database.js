let mongoose=require("mongoose");

let connectDb=async(req,res)=>{
    try {
        await mongoose.connect(process.env.URI);
        
    } catch (error) {
        console.log("connection failed due to internal errror");
        
    }
};
module.exports=connectDb