const Address = require("../Models/userAddress");

const address = async (req, res) => {
    try {
        const { fullName, mobile, street, city, state, pincode, landmark, addressType } = req.body;
        const user=req.user
        
        if ( !fullName || !mobile || !street || !city || !state || !pincode) {
            return res.status(400).json({ message: "All required fields must be filled" });
        }
        if(!user)
            return res.status(400).json({message:"userId not found"})


        const newAddress = new Address({
            userId:user?.userId,
            fullName,
            mobile,
            street,
            city,
            state,
            pincode,
            landmark,
            addressType
        });

        await newAddress.save();
       return res.status(201).json({ message: "Address saved successfully", success: true });
    } catch (error) {
        console.error("Save Address Error:", error);
       return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports = { address };
