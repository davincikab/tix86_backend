const jwt = require('jsonwebtoken');
const { BlackListToken } = require('../src/users/models');
require("dotenv").config();

const authenticate = async (req, res, next) => {
    const accessToken = req.headers['authorization'];
    

    if (!accessToken) {
        return res.status(401).send('Access Denied. No token provided.');
    }

    try {
        // check if is blacklisted
        let token = accessToken.split(" ")[1];
        let istokenBlackListed = await BlackListToken.findOne({ where : { token }});

        if(istokenBlackListed) {
            return res.status(401).send('Invalid Token.');
        }

        // console.log(process.env.SECRET_KEY);
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        // console.log(decoded);
        // let user = await User.findOne({ where: { email: decoded.user.email }});
        
        // if(!user) {
        //     throw new Error("Invalid user");
        // }

        req.user = decoded.user;
        next();
    } catch (error) {
        // console.log("Error");
        console.log(error.message);
        // if (!refreshToken) {
        //     return res.status(401).send('Access Denied. No refresh token provided.');
        // }

        // try {
        // const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY);
        // const accessToken = jwt.sign({ user: decoded.user }, process.env.SECRET_KEY, { expiresIn: '1h' });

        // res
        //     .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
        //     .header('Authorization', accessToken)
        //     .send(decoded.user);
        // } catch (error) {
        //     return res.status(400).send('Invalid Token.');
        // }

        return res.status(401).send('Invalid Token.');
    }
}

module.exports = { authenticate };