
const jwt = require('jsonwebtoken')
require('dotenv').config()

exports.verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.SCRET_KEY)
        req.userid = decoded
        next();
    } catch (err) {
        return res.status(401).json({
            message: 'Auth failed'
        })
    }
}
