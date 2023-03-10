const express = require('express');
const router = express.Router();

const checkAuth = require('../utils/checkAuthUtil');
const getSummary = require('../utils/summaryUtil');
const generateEmoji = require('../utils/generateEmojisUtil');

const Spend = require('../models/spend');

router.get('/', checkAuth.checkAuth, async (req, res, next) => {
    try {
        let count = await Spend.countDocuments({ sessionId: req.cookies.accessToken });
        if (count == 0) {
            return res.redirect('/dashboard');
        }
        const summaryObj = await getSummary(req.cookies.accessToken);
        res.render('complete', {
            dues: summaryObj.dues,
            total: summaryObj.totalAmount,
            average: summaryObj.average
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});

router.get('/:memberName/:total', checkAuth.checkAuth, async (req, res, next) => {
    await Spend.find({ sessionId: req.cookies.accessToken, memberName: req.params.memberName })
        .exec()
        .then(result => {
            res.render('details', {
                memberName: req.params.memberName,
                spends: result,
                total: req.params.total,
                generateEmoji: generateEmoji
            });
        })
        .catch(error => {
            console.log(error);
            next(error);
        });
});

module.exports = router;