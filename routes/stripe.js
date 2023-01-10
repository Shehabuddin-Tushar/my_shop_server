const express = require("express");
const { stripeCheckout } = require("../Controllers/stripe");

const router = express.Router();



router.post('/',stripeCheckout)



module.exports = router;