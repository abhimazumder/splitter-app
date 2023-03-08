const express = require('express');
const router = express.Router();
const fs = require('fs');

const getEmoji = require('../utils/generateEmojisUtil');

const mongoose = require('mongoose');
const Spend = require('../models/spend');

router.get('/', async (req, res, next) => {
    try{
        if(!fs.existsSync('membersData.txt'))
            return res.redirect('back');
    }
    catch(error){
        console.log(error);
        next(error);
    }
    await Spend.find()
    .exec()
    .then(result => {
        res.render('dashboard', {
            members : JSON.parse(fs.readFileSync('membersData.txt', {encoding:'utf8', flag:'r'})),
            spends : result,
            getEmoji : getEmoji
        });
    })
    .catch(error => {
        console.log(error);
        next(error);
    });
});

router.post('/', async (req, res, next) => {
    const spend = new Spend({
        _id : new mongoose.Types.ObjectId(),
        memberName : req.body.memberName,
        amount : req.body.amount,
        item : req.body.item == ""?"something he/she doesn't know":req.body.item
    });
    await spend.save()
    .then(result => {
        console.log(result);
        return res.redirect('back');
    })
    .catch(error => {
        console.log(error);
        next(error);
    });
});

router.get('/clear', async (req, res, next) => {
    await Spend.deleteMany()
    .exec()
    .then(result => {
        console.log("All entries cleared");
        return res.redirect('back');
    })
    .catch(error => {
        console.log(error);
        next(error);
    });
});

router.get('/clear/:_id', async (req, res, next) => {
    await Spend.deleteOne({_id : req.params._id})
    .exec()
    .then(result =>{
        console.log("Database entry", req.params._id, "deleted");
        return res.redirect('back');
    })
    .catch(error => {
        console.log(error);
        next(error);
    });
});

router.get('/edit/:_id', async (req, res, next) => {
    await Spend.findById(req.params._id)
    .exec()
    .then(result => {
        res.render('edit', {
            doc : result,
            members : JSON.parse(fs.readFileSync('membersData.txt', {encoding:'utf8', flag:'r'})),
            getEmoji : getEmoji
        });
    })
    .catch(error => {
        console.log(error);
        next(error);
    });
});

router.post('/edit/:_id', async (req, res, next) => {
    await Spend.updateOne({
        _id : req.params._id
    },
    {
        $set : {
            memberName : req.body.memberName,
            amount : req.body.amount,
            item : req.body.item
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