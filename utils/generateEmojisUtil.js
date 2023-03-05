const generateEmoji = (amount) => {
    if(amount < 50)
        return 'x1FA99;'
    if(amount < 500)
        return '128181;'
    if(amount < 1000)
        return '128184;'
    return '128176;'
}

module.exports = generateEmoji;