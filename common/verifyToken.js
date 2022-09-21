var config = require("config");
var utils = require("./utils");

function verifyToken(req, res, next) {
    try {
        var token = req.headers["x-access-token"];
        if (!token) {
            res.status(401).json({
                message: "Token not found"
            })
        } else {
            utils.verifyToken(token).then((data) => {
                res.status(200).json({
                    token: data
                });
            }).catch((error) => {
                res.status(401).json({
                    message: "Invalid token",
                    data: error
                })
            });
        }
    } catch (error) {
        res.status(401).json({
            message: "Invalid token",
            data: error
        })
    }
}

module.exports = { verifyToken }