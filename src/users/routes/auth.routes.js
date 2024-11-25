const express = require('express');
const { body, validationResult, checkSchema } = require('express-validator');
const authController = require('../controller/auth.controller');
const { validate, registrationSchema, validateConfirmPassword } = require('../../../middlewares/validateSchema');
const { authenticate } = require('../../../middlewares/authenticate');
const router = express.Router();


router.post(
    '/signup', 
    validate([validateConfirmPassword]), 
    validate(checkSchema(registrationSchema)), 
    authController.signup
);

router.post(
    "/verification",  
    validate([
        body('email').isEmail().normalizeEmail(),
        body('otp_code').isLength({min: 6})
    ]), 
    authController.registration_verification
);

// validate( [body.email('')]),

router.post("/signin",  authController.signin);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);


router.post(
    '/change_password', 
    authenticate,
    validate([validateConfirmPassword]), 
    authController.change_password
);

module.exports = router;