const express = require("express");
const router = express.Router();
const {address}=require("../controllers/userAddress");
const verifyToken=require("../middlewares/verifyToken")



router.post("/userAddress",verifyToken, address);

module.exports = router;
