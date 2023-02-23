require("dotenv").config();

const middleware = (req, res, next) => {
    if (req.cookies.auth != process.env.ADMIN_COOKIE) {
        res.status(401).json({error: "Please login as admin"});
    } else {
        next();
    }
}

module.exports = middleware;