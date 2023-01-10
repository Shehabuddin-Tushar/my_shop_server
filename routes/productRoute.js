const express = require("express");
const { allproducts } = require("../Controllers/products");
const router = express.Router();


router.get('/products', allproducts)


module.exports = router;