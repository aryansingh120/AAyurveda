const dataSchema = require("../Models/productData"); 
const cloudinary = require("../config/cloudinaryConfig");

const productData = async (req, res) => {
    try {
        const { productName, description, price, category, discount, reviews } = req.body;

        if (!productName || !description || !price || !category || !discount || !reviews) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if (!req.file) {
            return res.status(400).json({ error: "Image is required" });
        }

        // ✅ Cloudinary me image upload
        const uploadImage = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: "productData" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(req.file.buffer);
        });

        
        const discountedPrice = (price * (100 - discount)) / 100;

        
        const addedProduct = {productName,description,price,category,discount,
            reviews, discountedPrice,url: uploadImage.secure_url,public_id: uploadImage.public_id
        };

        await dataSchema.create(addedProduct);

        return res.status(201).json({ message: "Product added successfully", product: addedProduct });

    } catch (error) {
        console.error("Error adding product:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const skincarePoducts=async(req,res)=>{
    try {
        const allProducts=await dataSchema.find({category:"Skincare"});
        if(!allProducts)
            return res.status(400).json({message:"products not received"})

        return res.status(200).json({message:"all products are here",TotalProducts: allProducts.length,allProducts:allProducts})
        
    } catch (error) {
        return res.status(500).json({ message:"internal error receive",error:error });

        
    }
}

const nutritionProducts=async(req,res)=>{
    try{
    const allProducts=await dataSchema.find({category: "nutraceuticals"});
        if(!allProducts)
            return res.status(400).json({message:"products not received"})

        return res.status(200).json({message:"all products are here",TotalProducts: allProducts.length,allProducts:allProducts})
        
    } catch (error) {
        return res.status(500).json({ message:"internal error receive",error:error });

        
    }

}

module.exports = {productData,skincarePoducts,nutritionProducts};
