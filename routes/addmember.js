const express = require('express');
const router = express.Router();

const checkAuth = require('../utils/checkAuthUtil');

const mongoose = require('mongoose');
const Spend = require('../models/spend');
const Member = require('../models/member');

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

    let spendWarning = false;
    try {
        const count = await Spend.countDocuments({ sessionId: req.cookies.accessToken });
        if (count != 0) {
            spendWarning = true;
        }
    }
    catch (error) {
        console.log(error);
        next(error);
    }

    let memberWarning = false;
    try {
        const count = await Member.countDocuments({ sessionId: req.cookies.accessToken });
        if (count < 2) {
            memberWarning = true;
        }
    }
    catch (error) {
        console.log(error);
        next(error);
    }
    res.render('addmember', {
        members: members,
        spendWarning: spendWarning,
        memberWarning: memberWarning
    });
});

router.post('/', checkAuth.checkAuth, async (req, res, next) => {
    try {
        const doc = await Member.find({ sessionId: req.cookies.accessToken, memberName: req.body.membername });
        if (doc.length != 0) {
            return res.redirect('back');
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

router.get('/clear', checkAuth.checkAuth, async (req, res, next) => {
    await Member.deleteMany({ sessionId: req.cookies.accessToken })
        .exec()
        .then(result => {
            console.log("Members deleted due to user cleared all members");
        })
        .catch(error => {
            console.log(error);
            next(error);
        });

    await Spend.deleteMany({ sessionId: req.cookies.accessToken })
        .exec()
        .then(result => {
            console.log("Spends deleted due to user cleared all members");
        })
        .catch(error => {
            console.log(error);
            next(error);
        });
    res.redirect('back');
})

module.exports = router;