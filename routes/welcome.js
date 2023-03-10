const express = require('express');
const router = express.Router();

const checkAuth = require('../utils/checkAuthUtil');

router.get('/', (req, res, next) => {
    res.render('welcome');
});

router.get('/next', (req, res, next) => {
    let token = req.cookies.accessToken;
    if (!token) {
        token = checkAuth.generateToken(req.ip);
        return res.cookie("accessToken", token, { httpOnly: true }).redirect('/addmember');
    } else {
        if (checkAuth.isTokenValid(token)) {
            return res.redirect('/addmember');
        }
        return res.clearCookie('accessToken').redirect('/next');
    }
});

module.exports = router;