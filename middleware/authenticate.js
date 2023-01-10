const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
    const headers = req.header("auth-token");
    const token= headers.split(" ")[1]
    if (!token) return res.status(401).send("Access denied. Not authorized...");
    try {
        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        const decoded = jwt.verify(token, jwtSecretKey);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send("Invalid auth token...");
    }
}

module.exports = authenticate