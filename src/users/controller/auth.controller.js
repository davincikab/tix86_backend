const { User, OTP, Role, BlackListToken } = require("../models/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendOTP, verfify_otp } = require("./otp.controller");

require('dotenv').config();


exports.signup = async (req, res) => {
    console.log("signup");
    try {
        const { phone_number, email, password  } = req.body;

        // Secure password
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: `Hashing password error for ${password}: ` + error.message,
            });
        }

        let user = await User.create({ phone_number, email, password:hashedPassword});

        // add user role
        let role = await Role.findOne({ where: { name:'customer' }})
        await user.setRoles(role);

        return sendOTP(req, res);

        // send otp
        return res.status(200).json({message:"User Created Successfully"});

        // redirect to otp page: frontend
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
    
}

exports.registration_verification = async (req, res) => {
    try {
        console.log("Verify");
        let { email, otp_code} = req.body;
        const user = await User.findOne({ where:{ email }});

        if(!user) {
            res.status(404).send({message:'User not found'});
        }

        try {
            console.log("Verify Code");
            let verified_user = await verfify_otp({email, otp_code});
            if (!verified_user) return res.status(400).send({message: 'OTP is invalid'})

            const result = verified_user;

            return res.status(200).send({
                message: 'Email is verified',
                result: result,
            });

        } catch (error) {
            if (error.message === 'OTP is expired') return res.status(400).send({  message: 'OTP is expired' })
            if (error.message === 'Email has been verified') return res.status(400).send({ message: 'Email has been verified'})
        }

        // handle vverification
        
    } catch (error) {
        res.status(500).send({message:error.message});
    }
}
exports.signin = async (req, res) => {
    try {
        let { username, password, identifier='email' } =  req.body;
        let user = await User.findOne({ where: { [identifier]:username }});

         // check if user exists
        if(!user) {
            return res.status(400).send({message:'Incorret Username or Password'})
        }

        // validate password
        let isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            return res.status(400).send({message:'Incorret Username or Password'})
        }

        // generate token (jsonwebtoken)
        let userData = user.toJSON();
        let userInfo = {
            id:userData.id,
            email:userData.email,
            phone_number:userData.phone_number,
            is_subscribed:userData.is_subscribed,
            is_verified:userData.is_verified
        };

        let accessToken = jwt.sign({user:userInfo}, process.env.SECRET_KEY, {expiresIn:'1h'});
        let refreshToken = jwt.sign({user:userInfo}, process.env.SECRET_KEY, {expiresIn:'1d'});

        res.send({user:userInfo, accessToken, refreshToken});
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
}


exports.refresh =  async(req, res) => {
    const { refresh } = req.body;

    if (!refresh) {
      return res.status(401).send('Access Denied. No refresh token provided.');
    }
  
    try {
        const decoded = jwt.verify(refresh, process.env.SECRET_KEY);
        const accessToken = jwt.sign({ user: decoded.user }, secretKey, { expiresIn: '1h' });

        res.send({user:decoded.user, accessToken, refreshToken:refresh });
    } catch (error) {
      return res.status(401).send('Invalid refresh token.');
    }
}

exports.logout = async(req, res) => {
    try {
        let { token } = req.body;
        const isBlackListed = await BlackListToken.findOne({ where: { token } });

        if(isBlackListed) {
            return res.sendStatus(204);
        }
        
        await BlackListToken.create({ token });

        res.setHeader('Clear-Site-Data', 'cookies');
        res.status(200).send({message:"You're logged out!"})
    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        });
    }
}


// reset password
exports.send_reset_password_link = async (req, res) => {
    try {
        // get user email
        let 
        // generate token
        // send mail
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

exports.reset_password = async (req, res) => {
    // get token
    // verify token
    // update password
}

// change password
exports.change_password = async (req, res) => {
    
    try {
        let { password } = req.body;
        const accessToken = req.headers['authorization'].split(" ")[1];
        const decoded = jwt.verify(accessToken, process.env.SECRET_KEY);


        let user = await User.findOne({ where : { email:decoded.user.email }});
        let hashedPassword;

        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: `Hashing password error for ${password}: ` + error.message,
            });
        }

        await user.update({ password:hashedPassword });
        return res.status(200).send({ message: "Password Updated"});
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}
// 
// {email: 'davidnganganjeri079@gmail.com', phone_number: '+18654322145', password: '477Jesusc?', password_confirmation: '477Jesusc?'}