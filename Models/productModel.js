const mongoose=require("mongoose");

const productSchema=new mongoose.Schema({
    productImg:{
        url:{
            type:String,
            required:[true,"url is required"]
        },
        public_id:{
            type:String,
            required:[true,"public id is required"]
        }
    },
    productName:{
        type:String,
        required:[true,"productName is required"]

    },
    description:{
        type:String,
        required:[true,"product description is required"]
    },
    price:{
        type:Number,
        required:[true,"product price is required"]


    },
    category:{
        type:String,
        required:[true,"product category is required"]


    },
    seller:{
        type:mongoose.Schema.Types.ObjectId,
         ref: 'Seller', required: true
    }
},{ timestamps: true })

module.exports=mongoose.model("productDetail",productSchema)