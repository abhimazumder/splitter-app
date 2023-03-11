const express = require('express');
const router = express.Router();

const getEmoji = require('../utils/generateEmojisUtil');
const checkAuth = require('../utils/checkAuthUtil');

const mongoose = require('mongoose');
const Spend = require('../models/spend');
const Member = require('../models/member');

router.get('/', checkAuth.checkAuth, async (req, res, next) => {
    try {
        const count = await Member.countDocuments({ sessionId: req.cookies.accessToken });
        if (count < 2)
            return res.redirect('/addmember');
        res.redirect('/dashboard');
    }
    catch (error) {
        console.log(error);
        next(error);
    }
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
        if (count == 0) {
            warning = true;
        }
    }
    catch (error) {
        console.log(error);
        next(error);
    }

    await Spend.find({ sessionId: req.cookies.accessToken })
        .exec()
        .then(result => {
            res.render('dashboard', {
                members: members,
                spends: result,
                warning: warning,
                getEmoji: getEmoji
            });
        })
        .catch(error => {
            console.log(error);
            next(error);
        });
});

router.post('/', checkAuth.checkAuth, async (req, res, next) => {
    const spend = new Spend({
        sessionId: req.cookies.accessToken,
        _id: new mongoose.Types.ObjectId(),
        memberName: req.body.memberName,
        amount: req.body.amount,
        item: req.body.item == "" ? "something he/she doesn't know" : req.body.item
    });
    await spend.save()
        .then(result => {
            return res.redirect('back');
        })
        .catch(error => {
            console.log(error);
            next(error);
        });
});

router.get('/clear', checkAuth.checkAuth, async (req, res, next) => {
    await Spend.deleteMany({ sessionId: req.cookies.accessToken })
        .exec()
        .then(result => {
            console.log("Spends deleted due to user cleared expenses")
            return res.redirect('back');
        })
        .catch(error => {
            console.log(error);
            next(error);
        });
});

router.get('/clear/:_id', checkAuth.checkAuth, async (req, res, next) => {
    await Spend.deleteOne({ _id: req.params._id })
        .exec()
        .then(result => {
            return res.redirect('back');
        })
        .catch(error => {
            console.log(error);
            next(error);
        });
});

router.get('/edit/:_id', checkAuth.checkAuth, async (req, res, next) => {
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
    await Spend.findById(req.params._id)
        .exec()
        .then(result => {
            res.render('edit', {
                doc: result,
                members: members,
                getEmoji: getEmoji
            });
        })
        .catch(error => {
            console.log(error);
            next(error);
        });
});

router.post('/edit/:_id', checkAuth.checkAuth, async (req, res, next) => {
    await Spend.updateOne({
        _id: req.params._id
    },
        {
            $set: {
                memberName: req.body.memberName,
                amount: req.body.amount,
                item: req.body.item
            }
        })
        .exec()
        .then(result => {
            res.redirect('back');
        })
        .catch(error => {
            console.log(error);
            next(error);
        });
});

module.exports = router;