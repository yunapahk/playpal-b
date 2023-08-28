const jwt = require('jsonwebtoken');

async function authCheck(req, res, next) {
    if (req.cookies.token) {
        try {
            const payload = jwt.verify(req.cookies.token, process.env.SECRET);
            req.payload = payload;
            next();
        } catch (error) {
            res.status(401).json({ error: "Invalid or expired token" });
        }
    } else {
        res.status(400).json({ error: "You are not authorized" });
    }
}

module.exports = authCheck;
