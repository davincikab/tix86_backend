const { body, checkSchema, validationResult, check } = require('express-validator');
const { User } = require("../src/users/models/index");
const { CuoponCode } = require('../src/tix86_subscription/models');

const registrationSchema = {
    password: {
        isStrongPassword: {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        },
        errorMessage: "Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number",
    },
    phone_number: {
        notEmpty: true,
        errorMessage: "Phone number cannot be empty",
        custom: {
            options: value => {
                return User.findOne({
                    where:{phone_number: value}
                }).then(user => {
                    if (user) {
                        return Promise.reject('Phone number already registered')
                    }
                })
            }
        }
    },
    email: {
        normalizeEmail: true,
        notEmpty:true,
        custom: {
            options: value => {
                return User.findOne({
                    where:{email: value}
                }).then(user => {
                    if (user) {
                        return Promise.reject('Email address already taken')
                    }
                })
            }
        }
    }
}



const validateConfirmPassword = check('password_confirmation')
.trim()
.isLength({ min: 8  })
.withMessage('Password must be between 8 characters')
.custom(async(confirmPassword, { req }) => {
    const password = req.body.password;

    // If password and confirm password not same
    // don't allow to sign up and throw error
    if (password !== confirmPassword) {
        throw new Error('Passwords must be same')
    }
})


const couponcodeValidator = {
    code:{
        notEmpty:true,
        custom: {
            options: value => {
                return CuoponCode.findOne({
                    where:{code: value}
                }).then(coupon => {
                    if (coupon) {
                        return Promise.reject('Cuopon code exists')
                    }
                })
            }
        }
    }
}

const validate = validations => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        res.status(400).json({
            errors: errors.array()
        });
    };
};


module.exports = { registrationSchema, validate, validateConfirmPassword, couponcodeValidator};