const Product = require("../Models/productModel"); 
const cloudinary = require("../config/cloudinaryConfig");

const addProduct = async (req, res) => {
    try {
        const { productName, description, price, category,seller } = req.body;

        if (!productName || !description || !price || !category || !seller) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if (!req.file) {
            return res.status(400).json({ error: "Image is required" });
        }

        // ✅ Memory storage ka buffer use karna padega (req.file.buffer)
        const uploadImage = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: "products" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(req.file.buffer);
        });

        // ✅ Product save karo database me
        const newProduct = new Product({
            productName,
            description,
            price,
            category,
            seller,
            productImg: {
                url:uploadImage.secure_url,
                public_id:uploadImage.public_id

            }
        });

        await newProduct.save(); // ✅ MongoDB me save hoga

        return res.status(201).json({ message: "Product added successfully", product: newProduct });

    } catch (error) {
        console.error("Error adding product:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const allProducts=async(req,res)=>{
    try {
        const allProducts=await Product.find({});
        if(!allProducts)
            return res.status(400).send({message:"products not received"})

        return res.status(200).send({message:"all products are here",TotalProducts: allProducts.length,allProducts:allProducts})
        
    } catch (error) {
        return res.status(500).json({ message:"internal error",error:error });

        
    }
}

const filter=async(req,res)=>{
    try {
        const receive=req.body;
        const result=await Product.find(receive)
        if(result.length===0)
            return res.status(404).send("no products matched")

        return res.status(200).send({message:"Your searched products are here",totalResults:result.length,result:result})

        
    } catch (error) {
        return res.status(500).send({message:" internal error",error:error});

        
    }
}

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { productName, price, description, category } = req.body;

        // Find existing product
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        let imageUrl = existingProduct.productImg.url;
        let oldImagePublicId = existingProduct.productImg.public_id;

        // If new image is provided, delete old one from Cloudinary and upload new one
        if (req.file) {
                try {
                    await cloudinary.uploader.destroy(oldImagePublicId); // Deleting the old image
                } catch (error) {
                    return res.status(500).json({ message: "Error deleting old image", error: error.message });
                }
            

            // Upload the new image to Cloudinary
            try {
                const uploadResult = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        { folder: "products" },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    ).end(req.file.buffer);
                });

                imageUrl = uploadResult.secure_url; // Update image URL with the new one
                oldImagePublicId = uploadResult.public_id; // Update public ID
            } catch (error) {
                console.error("Error uploading image to Cloudinary:", error);
                return res.status(500).json({ message: "Error uploading image", error: error.message });
            }
        }

        // Update product in database
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                productName: productName || existingProduct.productName,
                description: description || existingProduct.description,
                price: price || existingProduct.price,
                category: category || existingProduct.category,
                productImg: { url: imageUrl, public_id: oldImagePublicId },
            },
            { new: true } 
        );

        return res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const deleteProduct=async(req,res)=>{

    try {
        const {id}=req.params;
        const product=await Product.findById(id)
          if(!product)
            return res.status(404).send("product not found")
       
          if(product.productImg.url && product.productImg.public_id)
          {
            try {
                await cloudinary.uploader.destroy(product.productImg.public_id); 
            } catch (error) {
                return res.status(500).json({ message: "Error deleting old image", error: error.message });
            }
          }
            await Product.findByIdAndDelete(id)
        res.status(200).send({message:"Product deleted successfully"})

        
    } catch (error) {
        return res.status(500).send({message:" internal error",error:error});

        
    }

}


module.exports = {addProduct,allProducts,filter,deleteProduct,updateProduct};
