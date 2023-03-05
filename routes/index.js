const express = require('express');
const router = express.Router();
const fs = require('fs');

const Spend = require('../models/spend');

let members = [];

if(fs.existsSync('membersData.txt'))
    members = JSON.parse(fs.readFileSync('membersData.txt', {encoding:'utf8', flag:'r'}));

router.get('/', async (req, res, next) => {
    let warning = false;
    try{
        const count = await Spend.countDocuments({});
        if(count != 0){
            warning = true;
        }
    }
    catch(error){
        console.log(error);
        next(error);
    }
    res.render('index', {
        members: members,
        warning : warning
    });
});

router.post('/', async (req, res, next) => {
    if(members.includes(req.body.username))
        return res.redirect('/');
    members.push(req.body.username);
    res.redirect('/');
});

router.get('/next', async (req, res, next) => {
    if(members.length < 2)
        return res.redirect('/');
    
    const stringData = JSON.stringify(members);
    try{
        fs.writeFileSync("membersData.txt", stringData, 'utf8');
        console.log("Data file written successfully");
        res.redirect('/dashboard');
    }
    catch(error){
        console.log(error);
        next(error);
    }
})

router.get('/clear', async (req, res, next) => {
    members = [];

    if(fs.existsSync('membersData.txt')){
        fs.unlink("membersData.txt", (error) => {
            if(error) {
                console.log(error);
                next(error);
            }
        });
    }
    console.log("Data file deleted successfully");

    await Spend.deleteMany({})
    .exec()
    .then(result => {
        console.log("All entries cleared");
        res.redirect('/');
    })
    .catch(error => {
        console.log(error);
        next(error);
    });
})

module.exports = router;