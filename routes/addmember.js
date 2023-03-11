const express = require('express');
const router = express.Router();

const Spend = require('../models/spend');
const Member = require('../models/member');

const checkAuth = require('../utils/checkAuthUtil');
const mongoose = require('mongoose');

router.get('/', checkAuth.checkAuth, async (req, res, next) => {
    let members = [];
    await Member.find({ sessionId: req.cookies.accessToken })
        .exec()
        .then(result => {
            result.forEach(member => {
                members.push(member.memberName);
            })
        })
        .catch(error => {
            console.log(error);
            next(error);
        });

    let warning = false;
    try {
        const count = await Spend.countDocuments({ sessionId: req.cookies.accessToken });
        if (count != 0) {
            warning = true;
        }
    }
    catch (error) {
        console.log(error);
        next(error);
    }
    res.render('addmember', {
        members: members,
        warning: warning
    });
});

router.post('/', checkAuth.checkAuth, async (req, res, next) => {
    try {
        const doc = await Member.find({ sessionId: req.cookies.accessToken, memberName: req.body.membername });
        if (doc.length != 0) {
            res.redirect('back');
        }
    }
    catch (error) {
        console.log(error);
        next(error);
    }
    const member = new Member({
        sessionId: req.cookies.accessToken,
        _id: new mongoose.Types.ObjectId(),
        memberName: req.body.membername
    });
    await member.save()
        .then(result => {
            return res.redirect('back');
        })
        .catch(error => {
            console.log(error);
            next(error);
        });
});

router.get('/next', checkAuth.checkAuth, async (req, res, next) => {
    try {
        const count = await Member.countDocuments({ sessionId: req.cookies.accessToken });
        if (count < 2)
            return res.redirect('back');
        res.redirect('/dashboard');
    }
    catch (error) {
        console.log(error);
        next(error);
    }
})

router.get('/clear', checkAuth.checkAuth, async (req, res, next) => {
    await Member.deleteMany({ sessionId: req.cookies.accessToken })
        .exec()
        .then(result => {
            console.log("All members deleted");
            res.redirect('back');
        })
        .catch(error => {
            console.log(error);
            next(error);
        });

    await Spend.deleteMany({ sessionId: req.cookies.accessToken })
        .exec()
        .then(result => {
            console.log("All entries cleared");
            res.redirect('back');
        })
        .catch(error => {
            console.log(error);
            next(error);
        });
})

module.exports = router;