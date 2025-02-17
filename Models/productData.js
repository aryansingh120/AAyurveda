const mongoose=require("mongoose");

const dataSchema=new mongoose.Schema({

        url:{
            type:String,
            required:[true,"url is required"]
        },
        public_id:{
            type:String,
            required:[true,"public id is required"]
        },
        discount:{
            type:String,
            required:[true,"discount is required"]
        },
        reviews:{
            type:String,
            required:[true,"reviews is required"]
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
    discountedPrice:{
        type:String,
        required:[true,"discountedPrice is required"]
    }
},{ timestamps: true })

module.exports=mongoose.model("productData",dataSchema)