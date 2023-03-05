const router = require('express').Router();
const getSummary = require('../utils/summaryUtil');
const Spend = require('../models/spend');

router.get('/', async (req, res, next) => {
    try{
        let count = await Spend.countDocuments({});
        if(count == 0){
            return res.redirect('/dashboard');
        }
        const summaryObj = await getSummary();
        console
        res.render('complete', {
            dues : summaryObj.dues,
            total : summaryObj.totalAmount,
            average : summaryObj.average
        });
    }
    catch(error){
        console.log(error);
        next(error);
    }
});

router.get('/:memberName/:total', async (req, res, next) => {
    await Spend.find({memberName : req.params.memberName})
    .exec()
    .then(result => {
        res.render('details', {
            memberName : req.params.memberName,
            spends : result,
            total : req.params.total
        });
    })
    .catch(error => {
        console.log(error);
        next(error);
    });
});

module.exports = router;