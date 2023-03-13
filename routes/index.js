const express = require('express');
const router = express.Router();

const checkAuth = require('../utils/checkAuthUtil');

const mongoose = require('mongoose');
const Feedback = require('../models/feedback');

let sessionExists = false;
let feedbackSubmitted = false;

router.get('/', (req, res, next) => {
    if (typeof (req.cookies.accessToken) == 'undefined' || !checkAuth.isTokenValid(req.cookies.accessToken))
        sessionExists = false;
    else
        sessionExists = true;
    res.render('index', {
        sessionExists: sessionExists
    });
});

router.get('/create', (req, res, next) => {
    const token = checkAuth.generateToken(req.ip);
    sessionExists = true;
    res.cookie("accessToken", token, { maxAge: 60 * 60 * 1000, httpOnly: true }).redirect('/addmember');
});

router.get('/end', (req, res, next) => {
    sessionExists = false;
    checkAuth.deleteData(req.cookies.accessToken);
    res.clearCookie('accessToken').redirect('/feedback');
});

router.get('/feedback', (req, res, next) => {
    if (typeof (req.cookies.accessToken) != 'undefined')
        return res.redirect('back');
    res.render('feedback', {
        feedbackSubmitted: feedbackSubmitted
    })
});

router.post('/feedback', async (req, res, next) => {
    const feedback = new Feedback({
        _id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        feedback: req.body.feedback
    });
    feedback.save()
        .then(result => {
            feedbackSubmitted = true;
            res.redirect('back');
        })
        .catch(error => {
            console.log(error);
            next(error);
        })
})

module.exports = router;