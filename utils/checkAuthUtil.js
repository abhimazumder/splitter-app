const jwt = require('jsonwebtoken');

const member = require('../models/member');
const Spend = require('../models/spend');

const deleteData = (token, time) => {
    setTimeout(() => {
        member.deleteMany({ sessionId: token })
            .exec()
            .then(result => {
                console.log("Members deleted due to token reached expiry\naccessToken :", token);
            })
            .catch(error => {
                console.log(error);
                next(error);
            });

        Spend.deleteMany({ sessionId: token })
            .exec()
            .then(result => {
                console.log("Spends deleted due to token reached expiry\naccessToken :", token);
            })
            .catch(error => {
                console.log(error);
                next(error);
            });
    }, time);
};

const generateToken = (ip) => {
    const token = jwt.sign({ ip: ip }, process.env.SECRET_KEY, { expiresIn: '1h' });
    console.log("Token generated for IP:", ip, "\naccessToken :", token);
    deleteData(token, 1000 * 60 * 60);
    return token;
}

const isTokenValid = (token) => {
    let isValid;
    jwt.verify(token, process.env.SECRET_KEY, (error, decode) => {
        if (error || (decode.exp - decode.iat) < 0) {
            isValid = false;
        } else {
            isValid = true;
        }
    });
    return isValid;
};

const checkAuth = (req, res, next) => {
    const token = req.cookies.accessToken;
    jwt.verify(token, process.env.SECRET_KEY, (error, decode) => {
        if (error || (decode.exp - decode.iat) < 0) {
            next(error);
        }
    });
    next();
}

module.exports = { deleteData, generateToken, isTokenValid, checkAuth };