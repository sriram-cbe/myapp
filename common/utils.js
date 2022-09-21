const jwt = require("jsonwebtoken");
const config = require("../config/dev.json");

var getConnectionString = () => {
    var connStr = "";
    var userOption = "";
    if (config.database.username) {
        userOption = config.database.username + ":" + config.database.password + "@";
    }

    return "mongodb://"
        + userOption
        + config.database.host + ":"
        + config.database.port + "/"
        + config.database.database;
}

var verifyToken = (token) => {
    return new Promise((reject, resolve) => {
        jwt.verifyToken(token, config.project.jwtSecret, (error, verifiedToken) => {
            if (error) {
                reject(error);
            } else {
                resolve(verifiedToken);
            }
        })
    });
}

var generateJwtToken = (data) => {
    console.log(data);
    var token = jwt.sign(data, config.project.jwtSecret, { expiresIn: '1d' });
    return token;
}

module.exports = { getConnectionString, verifyToken, generateJwtToken };