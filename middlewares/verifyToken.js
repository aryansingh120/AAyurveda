const jwt = require("jsonwebtoken");
require("dotenv").config(); // .env se SECRET_KEY access karne ke liye

const SECRET_KEY = process.env.SECRET_KEY; // Best practice: .env me store karo

const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ message: "Access Denied. No token provided" });
    }

    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
        req.user = verified; // Decoded user data request me attach kar do
        next(); // Proceed to the next middleware or route
    } catch (error) {
        return res.status(400).json({ message: "Invalid or Expired Token" });
    }
};

module.exports = verifyToken;


