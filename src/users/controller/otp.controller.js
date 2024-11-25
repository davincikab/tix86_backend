const { User, OTP} = require("../models/index");
const otpGenerator = require("otp-generator");
const sendVerificationEmail = require("../utils/send_otp");
const { where } = require("sequelize");


exports.sendOTP = async (req, res) => {
    console.log("Send otp");

    try {
        // check is user exists
        let { email } = req.body;
        let user = await User.findOne({ where:{email} });

        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        // check if we have otp on the db
        let result = await OTP.findOne({ where:{otp: otp} });
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
            });
            result = await OTP.findOne({ where:{otp: otp} });
        }

        let otpEntry = await OTP.create({email, otp, userId:user.id});
        
        // send the code once it' saved
        await sendVerificationEmail(otpEntry.email, otpEntry.otp);

        res.status(200).send({message:"Registration Success"});
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
    
}

// const resendOTP = async (req,res) => {
//  this.sendOTP(req, res);
// }

exports.verfify_otp = async ({ email, otp_code}) => {
    try {
        console.log("User:", email, otp_code);
        const user = await User.findOne({ where :{ email }});
        if(!user) return null;

        
        const alreadyVerified = user.is_verified === true
        if (alreadyVerified) {
            throw new Error('Email has been verified')
        }

        const otp = await OTP.findOne({ where : { otp:otp_code }});
        
        if(!otp) {
            throw new Error("Invalid Code");
        }

        // const OTPExpired = new Date() > new Date(otp.otp_expiration)
        // if (OTPExpired) throw new Error('OTP is expired');

        // delete the OTP
        await otp.destroy();

        // update model
        const userUpdate = await user.update({ is_verified:true })
        return userUpdate;
    } catch (error) {
       throw error;
    }
}