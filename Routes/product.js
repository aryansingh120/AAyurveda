const express=require("express");
const {addProduct,allProducts,filter,deleteProduct,updateProduct}=require('../controllers/product')
const upload=require("../middlewares/multer");
const verifyToken=require("../middlewares/verifyToken")
const router=express.Router();

router.post("/addProduct",verifyToken, upload.single("image"),addProduct);
router.get("/showProducts",allProducts);
router.get("/filterProducts",filter);
router.delete("/deleteProduct/:id",deleteProduct);
router.patch('/updateProduct/:id', upload.single('image'), updateProduct);





module.exports=router