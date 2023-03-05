const express = require('express');
const router = express.Router();
const fs = require('fs');

const generateEmoji = require('../utils/generateEmojis');

const mongoose = require('mongoose');
const Spend = require('../models/spend');

let members = [];
let spends = [];

router.get('/', async (req, res, next) => {
    try{
        if(!fs.existsSync('membersData.txt'))
        return res.redirect('/');

    members = JSON.parse(fs.readFileSync('membersData.txt', {encoding:'utf8', flag:'r'}));
    
    if(members.length < 2)
        return res.redirect('/');
    }
    catch(error){
        console.log(error);
        next(error);
    }

    await Spend.find()
    .exec()
    .then(docs => {
        spends = docs;
        res.render('dashboard', {
            members : members,
            spends : spends,
            generateEmoji : generateEmoji
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
        return res.redirect('/dashboard');
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
        return res.redirect('/dashboard');
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
        return res.redirect('/dashboard');
    })
    .catch(error => {
        console.log(error);
        next(error);
    });
});

router.get('/edit/:_id', async (req, res, next) => {
    await Spend.findById(req.params._id)
    .exec()
    .then(doc => {
        console.log(doc);
        res.render('edit', {details : {
            doc : doc,
            members : JSON.parse(fs.readFileSync('membersData.txt', {encoding:'utf8', flag:'r'}))
        }});
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
        console.log(result);
        res.redirect('/dashboard');
    })
    .catch(error => {
        console.log(error);
        next(error);
    });
});

module.exports = router;