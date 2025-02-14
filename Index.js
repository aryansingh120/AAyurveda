const express=require("express");
require("dotenv").config();
const cors=require("cors")
const app=express();
app.use(express.json());
const connectDb=require("./config/database")
app.use(cors());

connectDb();




 app.use('/user',require('./Routes/userAuth'))
 app.use('/seller',require('./Routes/sellerAuth'));
 app.use("/product",require("./Routes/product"));
 app.use("/order",require("./Routes/order"));
 app.use("/home",require("./Routes/home"));






app.listen(2100,()=>console.log("server started on 2100")
)
