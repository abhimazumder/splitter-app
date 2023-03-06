const fs = require('fs');
const jwt = require('jsonwebtoken');

const getToken = () => {
    if(fs.existsSync('jwtToken.txt')){
        const token = fs.readFileSync('jwtToken.txt', {encoding:'utf8', flag:'r'});
        return token;
    }
    
    const token = jwt.sign({data: 'thisWillExpireIn30seconds'}, 'dummy',  {expiresIn: 30});
    fs.writeFileSync('jwtToken.txt', token, 'utf8');
    setTimeout(()=>{
        fs.unlinkSync('jwtToken.txt');
    }, 30000);

    return token;
}

const checkToken = (req, res, next) => {
    try{
        const token = req.cookies.Auth;
        const decode = jwt.verify(token, 'secret');
        next();
    }
    catch(error){
        console.log(error);
        next(error);
    }
}

module.exports = {getToken, checkToken};