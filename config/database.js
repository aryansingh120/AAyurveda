let mongoose=require("mongoose");

let connectDb=async(req,res)=>{
    try {
        await mongoose.connect(process.env.URI,{
            useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 50000, 
        });
        
    } catch (error) {
        console.log({message:"connection failed due to internal errror",error:error.message});
        
    }
};
module.exports=connectDb