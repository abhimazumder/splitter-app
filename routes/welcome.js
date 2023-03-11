const express = require('express');
const router = express.Router();

const checkAuth = require('../utils/checkAuthUtil');

let sessionExists = false;

router.get('/', (req, res, next) => {
    if (typeof (req.cookies.accessToken) == 'undefined' || !checkAuth.isTokenValid(req.cookies.accessToken))
        sessionExists = false;
    else
        sessionExists = true;
    res.render('welcome', {
        sessionExists: sessionExists
    });
});

router.get('/create', (req, res, next) => {
    const token = checkAuth.generateToken(req.ip);
    sessionExists = true;
    res.cookie("accessToken", token, { httpOnly: true }).redirect('/addmember');
});

router.get('/end', (req, res, next) => {
    sessionExists = false;
    res.clearCookie('accessToken').redirect('back');
})

module.exports = router;