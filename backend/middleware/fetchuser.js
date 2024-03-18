var jwt = require('jsonwebtoken');
const JWT_SECRET = "HARRyisgood";

const fetchuser = (req, res, next) => {
    const token = req.header("auth-token");

    if (!token) {
        return res.status(401).json({
            error: "Please authenticate using a valid token"
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user;  // Use 'decoded.user' instead of 'data.user'
        next();
    } catch (error) {
        return res.status(401).json({
            error: "Please authenticate using a valid token"
        });
    }
};

module.exports = fetchuser;
