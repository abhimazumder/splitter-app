const Spend = require('../models/spend');
const fs = require('fs');

var totalAmount;
var average;

const getTotal = async () => {
    let total = "";
    const result = Spend.aggregate([
        {
            $group: {
                _id: null,
                total: {
                    $sum: "$amount"
                }
            }
        }
    ])
    .cursor();
    await result.eachAsync(function (doc, i) {
        total = JSON.stringify(doc);
    });
    return JSON.parse(total);
}

const getAllTotal = async () => {
    let allTotal = "[";
    const result = Spend.aggregate([
        {
            $group: {
                _id: "$memberName",
                total: {
                    $sum: "$amount"
                }
            }
        }
    ])
    .cursor();
    await result.eachAsync(function (doc, i) {
        allTotal += JSON.stringify(doc) + ',';
    });
    allTotal = allTotal.substring(0, allTotal.length-1) + ']';
    return JSON.parse(allTotal);
}

const getSummary = async () => {
    const total = await getTotal();
    const allTotal = await getAllTotal();
    const members = JSON.parse(fs.readFileSync('membersData.txt', {encoding:'utf8', flag:'r'}));

    for(const member of members){
        if (allTotal.find(doc => doc._id == member)){
            continue;
        } else {
            allTotal.push({_id : member, total : 0});
        }
    }

    const membersNo = members.length;
    totalAmount = total.total;
    average = totalAmount / membersNo;

    let dues = '[';
    for(let i = 0; i < allTotal.length; i++){
        const doc = allTotal[i];
        const diff = doc.total - average;
        const type = diff < 0 ? "Pay" : "Receive";
        dues += '{ ' + '"memberName" : ' + JSON.stringify(doc._id) + ', "total" : ' + JSON.stringify(Math.round(Math.abs(doc.total))) + ', "difference" : ' + JSON.stringify(Math.round(Math.abs(diff))) + ', "type" : ' + JSON.stringify(type) + ' }';
        if(i < allTotal.length-1) dues += ',';
    }
    dues += ']';
    const summaryObj = '{' + '"totalAmount" : ' + JSON.stringify(totalAmount) + ', "average" : ' + JSON.stringify(Math.round(Math.abs(average))) + ', "dues" : ' + dues + '}';
    return JSON.parse(summaryObj);
}

module.exports = getSummary;